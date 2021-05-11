/**
 * NOTE: this is meant for debugging Bramble, and as an example
 * of how to do basic things with the API. It wasn't intended as a production setup.
 *
 * Use ?forceFiles=1 to force startup to re-install the default files
 */
var IDE = (function() {
    "use strict";

    var currentProjectId = $('#editor').attr('data-project-id');
    var currentProjectName = "";
    var currentProjectTags = [];
    var isOwner = false;
    var currentProjectIsLoaded = false;

    require.config({
        baseUrl: './'
    });

    // Allow the user to override what we do with default files using `?forceFiles=1`
    var forceFiles = window.location.search.indexOf("forceFiles=1") > -1;

    // Default filesystem content
    var projectRoot = "/project/" + currentProjectId;

    var hackathonProjectId = '5d7a7c4b04605858164345d9';
    var hackathonSlug = 'system-nasa-moon-to-mars-challenges';

    var _isDirty = false;
    var _dirtySince;
    var _isAutoSaveEnabled = true;
    var _exportSaveProject = null;
    var _exportSubmitHackathonEntry = null;
    var _isPlaying = false;

    //
    // Recursively get the files in the project
    //
    function getFiles(Bramble, path) {
        var Path = Bramble.Filer.Path;
        var _fs = Bramble.getFileSystem();
        var filePaths = [];
        var deferred = $.Deferred();

        // Do we have a file or directory?
        _fs.stat(path, function(err, stats) {
            if (err) {
                return deferred.reject();
            }
            // Add file to list
            if (stats.isFile()) {
                filePaths.push(path);
                deferred.resolve(filePaths);

                // Add files in directory to list
            } else if (stats.isDirectory()) {
                _fs.readdir(path, function(err, list) {
                    if (err) {
                        // Could not get list
                        return deferred.reject();
                    }
                    // Go through each entry in the list and getFiles() on them
                    $.when.apply($, list.map(function(fileOrDir) {
                        var listDeferred = $.Deferred();
                        var currentPath = Path.join(path, fileOrDir);
                        getFiles(Bramble, currentPath).then(function(list) {
                            $.each(list, function(i, file) {
                                filePaths.push(file);
                            });
                            listDeferred.resolve(filePaths);
                        }, function() {
                            listDeferred.reject();
                        });
                        return listDeferred;
                    })).then(function() {
                        deferred.resolve(filePaths);
                    }, function(err) {
                        deferred.reject(err);
                    });
                });

            } else {
                deferred.resolve(filePaths);
            }
        });

        return deferred;
    }

    function brambleReady(Bramble) {
        window.Bramble = Bramble;

        var Path = Bramble.Filer.Path;
        var Buffer = Bramble.Filer.Buffer;
        var Base64 = Bramble.Base64;
        var _fs = Bramble.getFileSystem();

        var _fileIdMapping = {};

        //
        // Load a project
        //
        function loadProject(projectId, callback) {
            // Wipe out local project storage
            Bramble.formatFileSystem(function(err) {
                if (!err) {
                    $.ajax({
                        "url" : "/code/project/api/loadproject",
                        "type" : "POST",
                        "data" : {
                            "id" : projectId
                        },
                        "success" : function(result) {
//                            if (!result.data.isOwner) {
//                                $('#editor').attr('data-project-id', null);
//                                currentProjectId = null;
//                            }

                            isOwner = result.data.isOwner;
                            currentProjectName = result.data.name;
                            if (result.data.tags) {
                                currentProjectTags = result.data.tags;
                            } else {
                                currentProjectTags = [];
                            }
                            if (window.parent && window.parent.updateProjectName) {
                                window.parent.updateProjectName(result.data.name);
                            }
                            loadFiles(result.data.files, function() {
                                // Mount the file system after everything loaded
                                Bramble.mount(projectRoot);

                                _setDirty(false);

                                if (callback) {
                                    callback();
                                }
                            });

                            // Flag used by our fork of Bramble that hides tutorial file if user is not the owner
                            // or the project is a remix of another project
                            window._showTutorialFile = isOwner && !result.data.originalid;

                            var projectId = result.data.id;
                            var originalProjectId = result.data.originalid && result.data.originalid.$id;

                            // Show the "Enter to win" button in the topbar if this project is a hackathon project
                            if (projectId === hackathonProjectId || originalProjectId === hackathonProjectId) {
                                if (window.parent && window.parent.showHackathonButton) {
                                    window.parent.showHackathonButton();
                                }
                            }

                            currentProjectIsLoaded = true;
                            $(document).trigger("bramble-ide-project-loaded");
                        }
                    });
                }
            });
        }

        //
        // Load files as separate requests from a project
        // Called from loadProject with list of files in array
        //   [{id:1, path:"/index.html},...]
        //
        function loadFiles(files, callback) {
            //var root = "/project"; // config.root;
            //var url = "/files/"; // config.host + "/files/";

            var results = [];

            $.when.apply($, files.map(function(fileInfo) {
                var deferred = $.Deferred();
                var path = Path.join(projectRoot, fileInfo.path);

                // Don't load the python preview files
                if (/\-[a-z]+preview.html/.test(fileInfo.path)) {
                    // Remove the file
                    $.ajax({
                        "url" : "/code/project/api/removefile",
                        "type" : "POST",
                        "data" : {
                            "id" : fileInfo.id,
                            "pid" : currentProjectId
                        }
                    });
                    deferred.resolve();

                } else {
                    _fileIdMapping[fileInfo.path] = fileInfo.id;

                    $.ajax({
                        "url" : "/code/project/api/loadfile",
                        "type" : "POST",
                        "data" : {
                            "id" : fileInfo.id
                        },
                        "success" : function(data) {
                            results.push({
                                path: path,
                                id: fileInfo.id,
                                data: data['data']
                            });
                            deferred.resolve();
                        },
                        "error" : function() {
                            return deferred.reject();
                        }
                    });
                }
                return deferred;

            })).then(function() {
                installAllFiles(results, callback);
            }, function() {
                callback(new Error("unable to load project files"));
            });
        }

        // @dfrancisco HACK: Doing this sequentially instead of in parallel seems to
        // fix an issue that appeared ocasionally where some files would be missing
        function installAllFiles(files, callback) {
            var mainDeferred = $.Deferred();
            var promise = mainDeferred.promise();

            files.forEach(function(file) {
                promise = promise.then(function() {
                    var deferred = $.Deferred();

                    var data = Base64.toByteArray(file.data);

                    // Install the file into bramble filesystem
                    installFile(file.path, data, function(err) {
                        if (err) {
                            return deferred.reject();
                        }
                        deferred.resolve();
                    });

                    return deferred;
                });
            });

            promise = promise.then(callback, function() {
                callback(new Error("unable to load project files"));
            });
            mainDeferred.resolve();
        }

        //
        // Write the file out to the specified path (creating dirs if required)
        //
        function installFile(path, data, callback) {
            var sh = new _fs.Shell();
            var basedir = Path.dirname(path);

            sh.mkdirp(basedir, function(err) {
                if (err) {
                    return callback(err);
                }

                _fs.writeFile(path, new Buffer(data), { encoding: null }, callback);
            });
        }

        // When the screenshot iframe is done, it'll call this to save the project
        function _saveProject(callback) {
            var currentProjectId = $('#editor').attr('data-project-id');
            //var title = $('header .title input').val();
            var title = '';
            if (window.parent && window.parent.getProjectName) {
                title = window.parent.getProjectName();
            }

//            if (screenshot) {
//                screenshot = screenshot.substr('data:image/jpeg;base64,'.length);
//            }

            var params = {
//                "screenshot" : screenshot,
                "name" : title
            }
//            if (isOwner) {
                params.id = currentProjectId;
//            }

            // Save the tags
            params.tags = currentProjectTags.join(",");

            var fileIdx = 0;

            // @dfrancisco HACK: This forces all pending changes to be persisted before we save the project
            // If the user saved before bramble was ready, just save it without using bramble
            var brambleSyncChanges = function (callback) {
                if (window.bramble) { bramble.saveAll(callback) }
                else { callback(); }
            };

            brambleSyncChanges(function() {
                // Add the files
                getFiles(Bramble, projectRoot).then(function(list) {
                    $.when.apply($, list.map(function(path) {
                        var deferred = $.Deferred();

                        var realPath = path.indexOf(projectRoot) === 0 ? path.substring(projectRoot.length) : path;
                        if (!/\-[a-z]+preview.html/.test(realPath)) {
                            _fs.readFile(path, {}, function(err, data, stat) {
                                if (err) {
                                    deferred.reject();
                                }
                                data = Base64.fromByteArray(data);
                                params["path" + fileIdx] = realPath;
                                params["data" + fileIdx] = data;
                                fileIdx++;
                                deferred.resolve();
                            });

                        } else {
                            deferred.resolve();
                        }

                        return deferred;
                    })).then(function() {
                        params["numFiles"] = fileIdx;
                        $.ajax({
                            "url" : "/code/project/api/saveproject",
                            "type" : "POST",
                            "data" : params,
                            "success" : function(result) {
                                $('#screenshot').detach();

                                _setDirty(false);

                                // @dfrancisco HACK: Removed so that when saving from a template
                                // project multiple times, it doesn't result in multiple projects
                                // @dfrancisco HACK: Readded with check. This is necessary because there's
                                // additional API calls we need to do before redirecting the user
                                if (callback && window.location.search.indexOf(hackathonProjectId) > 0) {
                                    if (result && result.data) {
                                        callback(result.data);
                                    } else {
                                        callback();
                                    }
                                // Did we get back a different project id?
                                } else if (result && result.data != currentProjectId) {
                                    currentProjectId = result.data;
                                    // Reload the new project
                                    window.open("/code/project/" + currentProjectId, "_top");

                                } else if (callback) {
                                    callback();
                                }
                            },
                            "error" : function() {
                                $('#screenshot').detach();
                            }
                        });
                    });
                });
            });
        }
        _exportSaveProject = _saveProject;

        // Hackathon button clicked
        var _codathonInfo = null;
        function submitHackathonEntry() {
            $('#project-submitentry').removeClass('hidden');
            $('#project-submitentry .modal').addClass('hidden');

            // Do we have summer codathon json yet?
            var deferred = $.Deferred();
            if (!_codathonInfo) {
                var hackathonDataUrl = '/play/summer/data/' + hackathonSlug + '.json';
                // Get the current week
                $.ajax({
                    "url" : hackathonDataUrl,
                    "success" : function(data) {
                        _codathonInfo = data;
                        deferred.resolve();
                    },
                    "error" : function() {
                        deferred.reject();
                    }
                });
            } else {
                deferred.resolve();
            }

            deferred.then(function() {
                // Is it already shared?
                $.ajax({
                    "url" : "/api/publishnotebook",
                    "type" : "POST",
                    "data" : {
                        "c" : "isShared",
                        "id" : currentProjectId
                    },
                    success : function(data) {
                        $('#project-submitentry').addClass('hidden');
                        $('#project-unsubmitentry').addClass('hidden');

                        if (data.shared && data.tags && data.tags.indexOf(hackathonSlug) >= 0) {
                            _showUnsubmitEntry();
                        } else {
                            _showSubmitEntry();
                        }
                    }
                });
            });
        }
        _exportSubmitHackathonEntry = submitHackathonEntry;

        // Close submit dialog
        $('#project-submitentry .close-modal,#project-submitentry .cancelBtn').on('click', function() {
            $('#project-submitentry').addClass('hidden');
        });
        $('#project-submitentry .saveBtn,#project-unsubmitentry .resubmitBtn').on('click', function() {
            var $self = $(this);
            var $dialog = $self.parents('.idedialog');

            // Resubmitting?
            if ($self.hasClass('resubmitBtn')) {
                $('#project-unsubmitentry .modal').addClass('hidden');

            // New submission
            } else {
                $('#project-submitentry .modal').addClass('hidden');

                // Grab the tags
                var tags = [];
                $dialog.find('.tags input[type=checkbox]').each(function() {
                    if (this.checked) {
                        tags.push($(this).attr('name'));
                    }
                });
                // Add user-entered tags
                var otherTags = $dialog.find('.tags input[type=text]').val();
                if (otherTags) {
                    otherTags = otherTags.trim().split(',');
                    for (var i = 0; i < otherTags.length; i++) {
                        var tag = otherTags[i].trim().toLowerCase();
                        if (tag && tags.indexOf(tag) < 0) {
                            tags.push(tag);
                        }
                    }
                }
                // Add system tags
                otherTags = $dialog.find('.tags input[type=hidden]').val();
                if (otherTags) {
                    otherTags = otherTags.trim().split(',');
                    for (var i = 0; i < otherTags.length; i++) {
                        var tag = otherTags[i].trim().toLowerCase();
                        if (tag && tags.indexOf(tag) < 0) {
                            tags.push(tag);
                        }
                    }
                }
                // Add hackathon tag
                if (tags.indexOf(hackathonSlug) < 0) {
                    tags.push(hackathonSlug);
                }
                if (typeof _codathonInfo.currentStage == 'number') {
                    var tag = hackathonSlug + '-week-' + _codathonInfo.currentStage;
                    if (tag && tags.indexOf(tag) < 0) {
                        tags.push(tag);
                    }
                }
                currentProjectTags = tags;
            }

            // If we changed the project name in the form, update in project
            if (window.parent && window.parent.updateProjectName) {
                var newProjectName = $('#project-submitentry .projectname').val();
                if (newProjectName) window.parent.updateProjectName(newProjectName);
            }

            // Save and submit publish the project
            _saveProject(function(newProjectId) {
                $.ajax({
                    "url" : "/code/project/api/saveprojectdescription",
                    "type" : "POST",
                    "data" : {
                        "id" : newProjectId || currentProjectId,
                        "d" : $('#project-submitentry .details textarea').val()
                    },
                    success : function() {
                        $.ajax({
                            "url" : "/api/publishnotebook",
                            "type" : "POST",
                            "data" : {
                                "c" : 'publish',
                                "id" : newProjectId || currentProjectId,
                                "t" : currentProjectTags.join(',')
                            },
                            "success" : function(data) {
                                $('#project-submitentry').addClass('hidden');
                                $('#project-unsubmitentry').addClass('hidden');

                                if (newProjectId && currentProjectId !== newProjectId) {
                                    window.open("/code/project/" + newProjectId, "_top");
                                } else if ($self.hasClass('saveBtn')) {
                                    _showUnsubmitEntry();
                                }
                            }
                        });
                    }
                });
            });
        });

        // Close unsubmit dialog
        $('#project-unsubmitentry .close-modal').on('click', function() {
            $('#project-unsubmitentry').addClass('hidden');
        });
        $('#project-unsubmitentry .removeEntryBtn').on('click', function() {
            $.ajax({
                "url" : "/api/publishnotebook",
                "type" : "POST",
                "data" : {
                    "c" : "unpublish",
                    "id" : currentProjectId
                },
                "success" : function(data) {
                    $('#project-unsubmitentry').addClass('hidden');
                }
            });
        });

        // Show the submit dialog
        function _showSubmitEntry() {
            $('#project-submitentry .screenshot .scimg').empty().append('<img src="/code/screenshot/' + currentProjectId + '.png"/>');
            // $('#project-submitentry .projectname').val(currentProjectName);
            $.ajax({
                "url" : "/code/project/api/getprojectdescription",
                "type" : "POST",
                "data" : {
                    "id" : currentProjectId
                },
                success : function(data) {
                    $('#project-submitentry .details textarea').val(data.data);
                }
            });

            // Update the tags
            var otherTags = [];
            var systemTags = [];
            var $form = $('#project-submitentry .tags');
            $form.find('input[type=checkbox]').each(function() { this.checked = false; });
            for (var i = 0; i < currentProjectTags.length; i++) {
                var tag = currentProjectTags[i];
                var $tagEl = $form.find('input[name="' + tag + '"]');
                if ($tagEl.length > 0) {
                    $tagEl[0].checked = true;

                } else if (tag.indexOf('system-') < 0 && otherTags.indexOf(tag) < 0) {
                    otherTags.push(tag);

                } else if (systemTags.indexOf(tag) < 0) {
                    systemTags.push(tag);
                }
            }
            $form.find('input[type=text]').val(otherTags.join(','));
            $form.find('input[type=hidden]').val(systemTags.join(','));

            $('#project-submitentry').removeClass('hidden');
            $('#project-submitentry .modal').removeClass('hidden');
        }

        // Show the unsubmit dialog
        function _showUnsubmitEntry() {
            $('#project-unsubmitentry .screenshot').empty().append('<img src="/code/screenshot/' + currentProjectId + '.png"/>');
            $('#project-unsubmitentry .projectname').text(currentProjectName);
            $('#project-unsubmitentry').removeClass('hidden');
            $('#project-unsubmitentry .modal').removeClass('hidden');
        }


        //
        // Start bramble into #editor DOM element
        //
        Bramble.load("#editor",{
            url: "index.html",
            useLocationSearch: true
        });

        // Event listeners
        Bramble.on("ready", function(bramble) {
            window.bramble = bramble;
            console.log("Bramble ready");

            // @tsilva HACK: this is being used by the
            // feed to add code to the editor (find a
            // better way to communicate)
            window.__brambleAddCodeSnippet = code => {
                bramble.addCodeSnippet(code);
            };

            document.getElementById('toolbar').classList.remove("hidden");

            bramble.on("capacityExceeded", function(amountInBytes) {
                console.log("[Bramble] capacityExceeded event", amountInBytes);
            });

            bramble.on("capacityRestored", function() {
                console.log("[Bramble] capacityRestored event.");
            });

            // Refresh the preview
            document.getElementById('refresh').addEventListener('click', function(e) {
                if (_isPlaying) {
                    setPlaying(false);
                    IDE.handleStop();
                    return;
                }

                bramble.save(function() {
                    bramble.refreshPreview();
                    e.preventDefault();
                })
            });
            // Hide the sidebar
            document.getElementById('hide-sidebar').addEventListener('click', function(e) {
                bramble.hideSidebar();
                document.getElementById("show-sidebar").classList.remove("hidden");
                e.preventDefault();
            });
            // Show the sidebar
            document.getElementById('show-sidebar').addEventListener('click', function(e) {
                bramble.showSidebar();
                document.getElementById("show-sidebar").classList.add("hidden");
                e.preventDefault();
            });
            // Undo
            document.getElementById('undo').addEventListener('click', function(e) {
                bramble.undo();
                e.preventDefault();
            });
            // Redo
            document.getElementById('redo').addEventListener('click', function(e) {
                bramble.redo();
                e.preventDefault();
            });
            // "Full-screen" preview
            document.getElementById('minimize').addEventListener('click', function(e) {
                bramble.disableFullscreenPreview();

                document.getElementById('maximize').classList.remove("hidden");
                document.getElementById('minimize').classList.add("hidden");
                e.preventDefault();
            });

            document.getElementById('maximize').addEventListener('click', function(e) {
                bramble.enableFullscreenPreview();

                document.getElementById('maximize').classList.add("hidden");
                document.getElementById('minimize').classList.remove("hidden");
                document.getElementById('treeview').style.width = "0px";
                document.getElementById('editorview').style.width = "0px";
                document.getElementById('preview').style.width = "100%";
                document.getElementById('tynker-logo').style.width = "0px";
                e.preventDefault();
            });

            // Layout changed
            bramble.on("layout", function(data) {
                document.getElementById('treeview').style.width = data.sidebarWidth + "px";
                document.getElementById('editorview').style.width = data.firstPaneWidth + "px";
                document.getElementById('preview').style.width = data.secondPaneWidth + "px";
                document.getElementById('tynker-logo').style.width = data.sidebarWidth + "px";

                if (data.sidebarWidth === 0) {
                    document.getElementById("show-sidebar").classList.remove("hidden");
                } else {
                    document.getElementById("show-sidebar").classList.add("hidden");
                }
            });
            // New file selected
            bramble.on("activeEditorChange", function(data) {
                document.querySelector("#editorview label span").innerText = data.filename;
            });

            // Turn off auto-update (important for Python or else console pops up with errors as you type)
            // bramble.disableAutoUpdate();

            // Show the sidebar on launch (and also get a layout event)
            bramble.showSidebar();

            // Triggers a saving event (to update the save icon) and returns a timestamp so you can track
            // if any other changes where done in the meantime and the flag `isDirty` should still be on
            function beforeSaving() {
                $("body").trigger("bramble:saving");
                return +new Date();
            }

            // After saving, given the timestamp that says when the save process started,
            // it checks if more changes were done in the meantime and the editor is still dirty
            function afterSaving(startedSavingAt) {
                if (startedSavingAt >= _dirtySince) {
                    $("body").trigger("bramble:saved");
                    _setDirty(false);
                } else {
                    $("body").trigger("bramble:dirty");
                }
            }

            //
            // File data changes
            //
            function handleFileChange(path) {
                var _fs = Bramble.getFileSystem();

                _fs.readFile(path, {}, function(err, data, stat) {
                    if (!err) {
                        data = Base64.fromByteArray(data);
                        var realPath = path.indexOf(projectRoot) === 0 ? path.substring(projectRoot.length) : path;
                        var fileId = _fileIdMapping[realPath];
                        var params = {
                            "pid" : currentProjectId,
                            "path" : realPath,
                            "data" : data
                        };
                        if (fileId) {
                            params.id = fileId;
                        }
                        // Don't save python preview files
                        if (!/\-[a-z]+preview.html/.test(realPath)) {
                            var startedSavingAt = beforeSaving();

                            $.ajax({
                                "url" : "/code/project/api/savefile",
                                "type" : "POST",
                                "data" : params,
                                "success" : function(result) {
                                    if (result.success) {
                                        _fileIdMapping[realPath] = result.data;
                                        afterSaving(startedSavingAt);
                                    }
                                }
                            });
                        }
                    }
                });
            }

            //
            // File deletion
            //
            function handleFileDelete(path) {
                var startedSavingAt = beforeSaving();

                var realPath = path.indexOf(projectRoot) === 0 ? path.substring(projectRoot.length) : path;
                var fileId = _fileIdMapping[realPath];
                $.ajax({
                    "url" : "/code/project/api/removefile",
                    "type" : "POST",
                    "data" : {
                        "id" : fileId,
                        "pid" : currentProjectId
                    },
                    "success" : function(result) {
                        if (result.success) {
                            delete _fileIdMapping[realPath];
                            afterSaving(startedSavingAt);
                        }
                    }
                });
            }

            //
            // File rename
            //
            function handleFileRename(oldFilename, newFilename) {
                var startedSavingAt = beforeSaving();

                var realPathOld = oldFilename.indexOf(projectRoot) === 0 ? oldFilename.substring(projectRoot.length) : oldFilename;
                var realPathNew = newFilename.indexOf(projectRoot) === 0 ? newFilename.substring(projectRoot.length) : newFilename;

                var fileId = _fileIdMapping[realPathOld];
                $.ajax({
                    "url" : "/code/project/api/savefile",
                    "type" : "POST",
                    "data" : {
                        "id" : fileId,
                        "pid" : currentProjectId,
                        "path" : realPathNew
                    },
                    "success" : function(result) {
                        if (result.success) {
                            delete _fileIdMapping[realPathOld];
                            _fileIdMapping[realPathNew] = fileId;
                            afterSaving(startedSavingAt);
                        }
                    }
                });
            }

            //
            // Rename a folder and its contents
            //
            function handleFolderRename(paths) {
                var startedSavingAt = beforeSaving();

                var realPathOldRoot = paths.oldPath.indexOf(projectRoot) === 0 ? paths.oldPath.substring(projectRoot.length) : paths.oldPath;
                var realPathNewRoot = paths.newPath.indexOf(projectRoot) === 0 ? paths.newPath.substring(projectRoot.length) : paths.newPath;

                $.each(paths.children, function(idx, filename) {
                    var oldPath = Path.join(realPathOldRoot, filename);
                    var newPath = Path.join(realPathNewRoot, filename);
                    console.log('rename ' + oldPath + ' to ' + newPath);
                    var fileId = _fileIdMapping[oldPath];
                    if (fileId) {
                        $.ajax({
                            "url" : "/code/project/api/savefile",
                            "type" : "POST",
                            "data" : {
                                "id" : fileId,
                                "pid" : currentProjectId,
                                "path" : newPath
                            },
                            "success" : function(result) {
                                if (result.success) {
                                    delete _fileIdMapping[oldPath];
                                    _fileIdMapping[newPath] = fileId;
                                    afterSaving(startedSavingAt);
                                }
                            }
                        });
                    }
                });
            }

            // Mark project has dirty (has changes unsaved)
            function markFileChanged(path) {
                var realPath = path.indexOf(projectRoot) === 0 ? path.substring(projectRoot.length) : path;
                if (!/\-[a-z]+preview.html/.test(realPath)) {
                    _setDirty(true);
                }
            }
            function markFolderChanged(change) {
                change.children.forEach(function (filename) {
                    markFileChanged(change.oldPath + filename);
                });
            }
            bramble.on("fileChange", markFileChanged);
            bramble.on("fileDelete", markFileChanged);
            bramble.on("fileRename", markFileChanged);
            bramble.on("folderRename", markFolderChanged);

            // @dfrancisco HACK: The methods above take a long time to trigger, which means
            // for eg the leave modal may not ask you to save unsaved changes if you're quick.
            // This method should mark dirty changes instantly.
            try {
                var EditorManager = brackets.getModule("editor/EditorManager");
                var handleActiveEditorChange = function() {
                    var editor = EditorManager.getCurrentFullEditor();
                    if (!editor) return;

                    var codeMirror = editor._codeMirror;
                    if (!codeMirror) return;

                    var handleChange = function() {
                        _setDirty(true);
                    };
                    codeMirror.off("change", handleChange);
                    codeMirror.on("change", handleChange);
                }
                EditorManager.on("activeEditorChange", handleActiveEditorChange);
                handleActiveEditorChange();
            } catch (e) {
                console.error("[Bramble] Problems with instant dirty...", e);
            }

            // Handle auto-saving
            IDE.handleFileChange = handleFileChange;
            IDE.handleFileDelete = handleFileDelete;
            IDE.handleFileRename = handleFileRename;
            IDE.handleFolderRename = handleFolderRename;
            initAutoSave(currentProjectId);

            if(window.__triggerBrambleReady) { window.__triggerBrambleReady(); }
            else { $(document).trigger("bramble-ready"); }

            // @dfrancisco If there isn't a file open on load, open by default a main.py or index.html if exists
            try {
                var _EditorManager = brackets.getModule("editor/EditorManager");
                var _FileViewController = brackets.getModule("project/FileViewController");
                if (!_EditorManager.getCurrentFullEditor()) {
                    var _fs = Bramble.getFileSystem();
                    var openFile = function(filename) {
                        return new Promise(function(resolve, reject) {
                            _fs.exists(projectRoot + "/" + filename, function (exists) {
                                if (exists) {
                                    _FileViewController.openFileAndAddToWorkingSet(projectRoot + "/" + filename);
                                    resolve(true);
                                } else {
                                    resolve(false);
                                }
                            });
                        });
                    }
                    openFile("main.py")
                        .then(function(opened) { return opened || openFile("Main.java"); })
                        .then(function(opened) { return opened || openFile("index.py"); })
                        .then(function(opened) { return opened || openFile("index.html"); });
                }
            } catch (e) {
                console.error("[Bramble] Problem loading default file:", e);
            }

            $(document).trigger("bramble-ready");
        });

        Bramble.once("error", function(err) {
            console.error("Bramble error", err);
            window.alert("Fatal Error: " + err.message + ". If you're in Private Browsing mode, data can't be written.");
        });

        Bramble.on("readyStateChange", function(previous, current) {
//            console.log("Bramble readyStateChange", previous, current);
        });

        Bramble.on("offlineReady", function() {
            console.log("Bramble available for offline use.");
        });

        Bramble.on("updatesAvailable", function() {
            console.log("Bramble offline content updated, please refresh to use.");
        });

        if (currentProjectId) {
            loadProject(currentProjectId, function(metadata) { });

//        } else {
//            loadProject('5ad6684ca2dff812265aae86', function(metadata) { });
//            // Setup the filesystem while Bramble is loading
//            ensureFiles(Bramble, function() {
//                // Now that fs is setup, tell Bramble which root dir to mount
//                // and which file within that root to open on startup.
//                Bramble.mount(projectRoot);
//            });
        }
    }

    require(["bramble", "/ext/base64js.min.js"], function(Bramble, b64) {
        Bramble.Base64 = b64;
        brambleReady(Bramble);
    });

    function isDirty() {
        return _isDirty;
    }

    function _setDirty(isDirty) {
        if (!_isDirty && isDirty) {
            $("body").trigger("bramble:dirty");
        }
        _isDirty = isDirty;
        _dirtySince = isDirty ? +new Date() : null;
    }

    function isAutoSaveEnabled() {
        return _isAutoSaveEnabled;
    }

    function initAutoSave(currentProjectId) {
        // @dfrancisco TODO Replace with Bramble Preferences / State
        if (typeof window.localStorage !== 'undefined') {
            _isAutoSaveEnabled = localStorage.getItem("bramble::auto-save") !== 'false';
        }

        if (currentProjectId && isOwner && _isAutoSaveEnabled) {
            setAutoSave(true);
        }
    }

    function setAutoSave(enable) {
        _isAutoSaveEnabled = enable;

        // @dfrancisco TODO Replace with Bramble Preferences / State
        if (typeof window.localStorage !== 'undefined') {
            localStorage.setItem("bramble::auto-save", _isAutoSaveEnabled);
        }

        if (enable) {
            bramble.on("fileChange", IDE.handleFileChange);
            bramble.on("fileDelete", IDE.handleFileDelete);
            bramble.on("fileRename", IDE.handleFileRename);
            bramble.on("folderRename", IDE.handleFolderRename);
        } else {
            bramble.off("fileChange", IDE.handleFileChange);
            bramble.off("fileDelete", IDE.handleFileDelete);
            bramble.off("fileRename", IDE.handleFileRename);
            bramble.off("folderRename", IDE.handleFolderRename);
        }
    }

    function setPlaying(isPlaying) {
        var $button = $("#refresh");
        _isPlaying = isPlaying;

        if (isPlaying) {
            $button.html('<i class="fa fa-stop"></i> Stop');
            $button.addClass("is-running");
        } else {
            $button.html('<i class="fa fa-play"></i> Play');
            $button.removeClass("is-running");
        }
    }

    function handleStop() {
    }

    function saveProjectAs(projectName) {
        // Clear the project ID
        $('#editor').attr('data-project-id', "");

        // Update the project name
        // @dfrancisco TODO: The setProjectName name should do this...
        if (window.parent && window.parent.updateProjectName) {
            window.parent.updateProjectName(projectName);
        }

        // Save the project with new ID
        _exportSaveProject();
    }

    return {
        saveProject : function(callback) { _exportSaveProject(callback); },
        saveProjectAs : saveProjectAs,
        submitHackathonEntry : function() { _exportSubmitHackathonEntry(); },
        getProjectName : function() { return currentProjectName; },
        setProjectName : function(name) { currentProjectName = name; _setDirty(true); },
        isDirty : isDirty,
        isAutoSaveEnabled : isAutoSaveEnabled,
        setAutoSave : setAutoSave,
        setDirty : _setDirty,
        getProjectTags : function() { return currentProjectTags },
        currentProjectIsLoaded :  function() { return currentProjectIsLoaded },
        projectRoot : projectRoot,
        getFiles : getFiles,
        setPlaying : setPlaying,
        handleStop : handleStop
    };
}());

function saveProject(callback) {
    IDE.saveProject(callback);
}

function submitHackathonEntry(callback) {
    IDE.submitHackathonEntry(callback);
}

function getProjectName(name) {
    return IDE.getProjectName();
}

function setProjectName(name) {
    IDE.setProjectName(name);
}

function isDirty() {
    return IDE.isDirty();
}

function isAutoSaveEnabled() {
    return IDE.isAutoSaveEnabled();
}

function setAutoSave(enable) {
    return IDE.setAutoSave(enable);
}