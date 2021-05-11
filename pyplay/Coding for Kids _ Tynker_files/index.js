$(document).ready(function() {
    //
    // Some key handlers
    //
    $('header .title input').on("keyup", function(e) {
        if (e.keyCode == 13) {
            var projectName = $('header .title input').val();
            $('header .title .label').text(projectName);
            $('header .title').removeClass('edit');

            var $iframe = $('#bramble-editor');
            if ($iframe.length > 0 && $iframe[0].contentWindow.setProjectName) {
                $iframe[0].contentWindow.setProjectName(projectName);
            }
        }
    }).on("focusout", function(e) {
        var projectName = $('header .title input').val();
        $('header .title .label').text(projectName);
        $('header .title').removeClass('edit');

        var $iframe = $('#bramble-editor');
        if ($iframe.length > 0 && $iframe[0].contentWindow.setProjectName) {
            $iframe[0].contentWindow.setProjectName(projectName);
        }
    });
    $('header .title .view').on("click", function(e) {
        if (!$('header .title').hasClass('edit')) {
            $('header .title').addClass('edit');
            $('header .title input').val($('header .title .label').text())[0].select();
        }
        e.preventDefault();
    });

    var timer;

    function setSavingState() {
        clearTimeout(timer);

        $('header .title .label').text($('header .title input').val());
        $('header .title').removeClass('edit');
        $('header .save-button')
            .removeClass('is-default')
            .removeClass('is-saved')
            .addClass('is-saving');
    }

    function setSavedState() {
        clearTimeout(timer);

        $('header .save-button')
            .removeClass('is-default')
            .addClass('is-saved')
            .removeClass('is-saving');

        timer = setTimeout(function() {
            setSaveDefaultState();
        }, 3000);
    }

    function setSaveDefaultState() {
        clearTimeout(timer);

        $('header .save-button')
            .addClass('is-default')
            .removeClass('is-saved')
            .removeClass('is-saving');
    }

    $('header .save-button').removeClass("hidden");

    $('header .save').on("click", function(e) {
        setSavingState();
        saveProject(setSavedState);
    });

    $('header .button-hackathon').on("click", function(e) {
        submitHackathonEntry(function() {
        });
        e.preventDefault();
    });

    // Save the project if dirty and redirect after completion
    $('a[data-leave]').on("click", function(e) {
        var $this = $(this);
        var redirectTo = $this.attr('href');
        var $iframe = $('#bramble-editor');

        if ($iframe.length === 0) return;

        var iframeWindow = $iframe[0].contentWindow;

        if (iframeWindow.isDirty()) {
            e.preventDefault();

            if (iframeWindow.isAutoSaveEnabled()) {
                console.log("[Bramble] Autosaving before leaving...");

                setSavingState();
                saveProject(function() {
                    setSavedState();
                    window.location = redirectTo;
                });
            } else {
                console.log("[Bramble] Autosaved disabled. Triggering leave modal...");

                iframeWindow.Bramble.confirmLeave(function() {
                    setSavingState();
                    saveProject(function() {
                        setSavedState();
                        window.location = redirectTo;
                    });
                }, function() {
                    window.onbeforeunload = null;
                    window.location = redirectTo;
                });
            }
        }
    });

    // Update project name on start (in case iframe loads before us)
    var $iframe = $('#bramble-editor');
    if ($iframe.length > 0 && $iframe[0].contentWindow.getProjectName) {
        var projectName = $iframe[0].contentWindow.getProjectName();
        $('header .title .label').text(projectName);
        $('header .title input').val(projectName);
    }

    function saveProject(callback) {
        var $iframe = $('#bramble-editor');
        if ($iframe.length > 0 && $iframe[0].contentWindow.saveProject) {
            $iframe[0].contentWindow.saveProject(callback);
        }
    }

    function submitHackathonEntry(callback) {
        var $iframe = $('#bramble-editor');
        if ($iframe.length > 0 && $iframe[0].contentWindow.submitHackathonEntry) {
            $iframe[0].contentWindow.submitHackathonEntry(callback);
        }
    }

    // Listen to save events and update save button accordingly
    var $iframe = $('#bramble-editor');
    if ($iframe.length > 0 && $iframe[0].contentWindow) {
        var listenToSaveEvents = function() {
            var $body = $iframe[0].contentWindow.$("body");

            $body.on("bramble:saving", function() {
                setSavingState();
            });

            $body.on("bramble:saved", function() {
                setSavedState();
            });

            $body.on("bramble:dirty", function() {
                setSaveDefaultState();
            });
        }

        if ($iframe[0].contentWindow.$) {
            listenToSaveEvents();
        } else {
            $iframe.on("load", listenToSaveEvents)
        }
    }
});

// Called after project loads
function updateProjectName(projectName) {
    $('header input').val(projectName);
    $('header .title .label').text(projectName);
}

function getProjectName() {
    return $('header input').val();
}

function showHackathonButton() {
    $("[data-hackathon]").show();
}

window.onbeforeunload = function(e) {
    var $iframe = $('#bramble-editor');
    if ($iframe.length > 0 && $iframe[0].contentWindow.isDirty()) {
        // Custom message displayed in the confirmation dialog for browsers that support it.
        // (doesn't include Chrome, see: https://goo.gl/6v5dLa)
        var msg = 'You have unsaved changes. Are you sure you wish to leave?';
        e = e || window.event;
        if (e) {
            e.returnValue = msg;
        }
        return msg;
    }
};
