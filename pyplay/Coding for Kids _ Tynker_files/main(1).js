define("text",["module"],function(e){"use strict";var n,t,i,o,a,r=["Msxml2.XMLHTTP","Microsoft.XMLHTTP","Msxml2.XMLHTTP.4.0"],s=/^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,l=/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,u="undefined"!=typeof location&&location.href,d=u&&location.protocol&&location.protocol.replace(/\:/,""),c=u&&location.hostname,h=u&&(location.port||void 0),v={},p=e.config&&e.config()||{};return n={version:"2.0.10",strip:function(e){if(e){e=e.replace(s,"");var n=e.match(l);n&&(e=n[1])}else e="";return e},jsEscape:function(e){return e.replace(/(['\\])/g,"\\$1").replace(/[\f]/g,"\\f").replace(/[\b]/g,"\\b").replace(/[\n]/g,"\\n").replace(/[\t]/g,"\\t").replace(/[\r]/g,"\\r").replace(/[\u2028]/g,"\\u2028").replace(/[\u2029]/g,"\\u2029")},createXhr:p.createXhr||function(){var e,n,t;if("undefined"!=typeof XMLHttpRequest)return new XMLHttpRequest;if("undefined"!=typeof ActiveXObject)for(n=0;3>n;n+=1){t=r[n];try{e=new ActiveXObject(t)}catch(i){}if(e){r=[t];break}}return e},parseName:function(e){var n,t,i,o=!1,a=e.indexOf("."),r=0===e.indexOf("./")||0===e.indexOf("../");return-1!==a&&(!r||a>1)?(n=e.substring(0,a),t=e.substring(a+1,e.length)):n=e,i=t||n,a=i.indexOf("!"),-1!==a&&(o="strip"===i.substring(a+1),i=i.substring(0,a),t?t=i:n=i),{moduleName:n,ext:t,strip:o}},xdRegExp:/^((\w+)\:)?\/\/([^\/\\]+)/,useXhr:function(e,t,i,o){var a,r,s,l=n.xdRegExp.exec(e);return l?(a=l[2],r=l[3],r=r.split(":"),s=r[1],r=r[0],!(a&&a!==t||r&&r.toLowerCase()!==i.toLowerCase()||(s||r)&&s!==o)):!0},finishLoad:function(e,t,i,o){i=t?n.strip(i):i,p.isBuild&&(v[e]=i),o(i)},load:function(e,t,i,o){if(o.isBuild&&!o.inlineText)return void i();p.isBuild=o.isBuild;var a=n.parseName(e),r=a.moduleName+(a.ext?"."+a.ext:""),s=t.toUrl(r),l=p.useXhr||n.useXhr;return 0===s.indexOf("empty:")?void i():void(!u||l(s,d,c,h)?n.get(s,function(t){n.finishLoad(e,a.strip,t,i)},function(e){i.error&&i.error(e)}):t([r],function(e){n.finishLoad(a.moduleName+"."+a.ext,a.strip,e,i)}))},write:function(e,t,i,o){if(v.hasOwnProperty(t)){var a=n.jsEscape(v[t]);i.asModule(e+"!"+t,"define(function () { return '"+a+"';});\n")}},writeFile:function(e,t,i,o,a){var r=n.parseName(t),s=r.ext?"."+r.ext:"",l=r.moduleName+s,u=i.toUrl(r.moduleName+s)+".js";n.load(l,i,function(t){var i=function(e){return o(u,e)};i.asModule=function(e,n){return o.asModule(e,u,n)},n.write(e,l,i,a)},a)}},"node"===p.env||!p.env&&"undefined"!=typeof process&&process.versions&&process.versions.node&&!process.versions["node-webkit"]?(t=require.nodeRequire("fs"),n.get=function(e,n,i){try{var o=t.readFileSync(e,"utf8");0===o.indexOf("\ufeff")&&(o=o.substring(1)),n(o)}catch(a){i(a)}}):"xhr"===p.env||!p.env&&n.createXhr()?n.get=function(e,t,i,o){var a,r=n.createXhr();if(r.open("GET",e,!0),o)for(a in o)o.hasOwnProperty(a)&&r.setRequestHeader(a.toLowerCase(),o[a]);p.onXhr&&p.onXhr(r,e),r.onreadystatechange=function(n){var o,a;4===r.readyState&&(o=r.status,o>399&&600>o?(a=new Error(e+" HTTP status: "+o),a.xhr=r,i(a)):t(r.responseText),p.onXhrComplete&&p.onXhrComplete(r,e))},r.send(null)}:"rhino"===p.env||!p.env&&"undefined"!=typeof Packages&&"undefined"!=typeof java?n.get=function(e,n){var t,i,o="utf-8",a=new java.io.File(e),r=java.lang.System.getProperty("line.separator"),s=new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(a),o)),l="";try{for(t=new java.lang.StringBuffer,i=s.readLine(),i&&i.length()&&65279===i.charAt(0)&&(i=i.substring(1)),null!==i&&t.append(i);null!==(i=s.readLine());)t.append(r),t.append(i);l=String(t.toString())}finally{s.close()}n(l)}:("xpconnect"===p.env||!p.env&&"undefined"!=typeof Components&&Components.classes&&Components.interfaces)&&(i=Components.classes,o=Components.interfaces,Components.utils["import"]("resource://gre/modules/FileUtils.jsm"),a="@mozilla.org/windows-registry-key;1"in i,n.get=function(e,n){var t,r,s,l={};a&&(e=e.replace(/\//g,"\\")),s=new FileUtils.File(e);try{t=i["@mozilla.org/network/file-input-stream;1"].createInstance(o.nsIFileInputStream),t.init(s,1,0,!1),r=i["@mozilla.org/intl/converter-input-stream;1"].createInstance(o.nsIConverterInputStream),r.init(t,"utf-8",t.available(),o.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER),r.readString(t.available(),l),r.close(),t.close(),n(l.value)}catch(u){throw new Error((s&&s.path||"")+": "+u)}}),n}),define("text!CSSProperties.json",[],function(){return'{\n    "align-content":               {"values": ["center", "flex-end", "flex-start", "space-around", "space-between", "stretch"]},\n    "align-items":                 {"values": ["baseline", "center", "flex-end", "flex-start", "stretch"]},\n    "align-self":                  {"values": ["auto", "baseline", "center", "flex-end", "flex-start", "stretch"]},\n    "animation":                   {"values": []},\n    "animation-delay":             {"values": []},\n    "animation-direction":         {"values": ["alternate", "alternate-reverse", "normal", "reverse"]},\n    "animation-duration":          {"values": []},\n    "animation-fill-mode":         {"values": ["backwards", "both", "forwards", "none"]},\n    "animation-iteration-count":   {"values": ["infinite"]},\n    "animation-name":              {"values": ["none"]},\n    "animation-play-state":        {"values": ["paused", "running"]},\n    "animation-timing-function":   {"values": ["cubic-bezier()", "ease", "ease-in", "ease-in-out", "ease-out", "linear", "step-end", "step-start", "steps()"]},\n    "backface-visibility":         {"values": ["hidden", "visible"]},\n    "background":                  {"values": []},\n    "background-attachment":       {"values": ["fixed", "local", "scroll", "inherit"]},\n    "background-blend-mode":       {"values": ["color", "color-burn", "color-dodge", "darken", "difference", "exclusion", "hard-light", "hue", "lighten", "luminosity", "normal", "multiply", "overlay", "saturation", "screen", "soft-light"]},\n    "background-clip":             {"values": ["border-box", "content-box", "padding-box", "inherit"]},\n    "background-color":            {"values": ["inherit"], "type": "color"},\n    "background-image":            {"values": ["image()", "linear-gradient()", "radial-gradient()", "repeating-linear-gradient()", "repeating-radial-gradient()", "url()"]},\n    "background-origin":           {"values": ["border-box", "content-box", "padding-box", "inherit"]},\n    "background-position":         {"values": ["left", "center", "right", "bottom", "top"]},\n    "background-repeat":           {"values": ["no-repeat", "repeat", "repeat-x", "repeat-y", "round", "space"]},\n    "background-size":             {"values": ["auto", "contain", "cover"]},\n    "border":                      {"values": []},\n    "border-collapse":             {"values": ["collapse", "separate", "inherit"]},\n    "border-color":                {"values": ["inherit"], "type": "color"},\n    "border-spacing":              {"values": ["inherit"]},\n    "border-style":                {"values": ["dashed", "dotted", "double", "groove", "hidden", "inset", "none", "outset", "ridge", "solid", "inherit"]},\n    "border-bottom":               {"values": []},\n    "border-bottom-color":         {"values": ["inherit"], "type": "color"},\n    "border-bottom-left-radius":   {"values": []},\n    "border-bottom-right-radius":  {"values": []},\n    "border-bottom-style":         {"values": ["dashed", "dotted", "double", "groove", "hidden", "inset", "none", "outset", "ridge", "solid", "inherit"]},\n    "border-bottom-width":         {"values": ["medium", "thin", "thick", "inherit"]},\n    "border-image":                {"values": [ "url()" ]},\n    "border-image-outset":         {"values": []},\n    "border-image-slice":          {"values": []},\n    "border-image-source":         {"values": []},\n    "border-image-repeat":         {"values": ["repeat", "round", "space", "stretch"]},\n    "border-image-width":          {"values": ["auto"]},\n    "border-left":                 {"values": []},\n    "border-left-color":           {"values": ["inherit"], "type": "color"},\n    "border-left-style":           {"values": ["dashed", "dotted", "double", "groove", "hidden", "inset", "none", "outset", "ridge", "solid", "inherit"]},\n    "border-left-width":           {"values": ["medium", "thin", "thick", "inherit"]},\n    "border-radius":               {"values": []},\n    "border-right":                {"values": []},\n    "border-right-color":          {"values": ["inherit"], "type": "color"},\n    "border-right-style":          {"values": ["dashed", "dotted", "double", "groove", "hidden", "inset", "none", "outset", "ridge", "solid", "inherit"]},\n    "border-right-width":          {"values": ["medium", "thin", "thick", "inherit"]},\n    "border-top":                  {"values": []},\n    "border-top-color":            {"values": ["inherit"], "type": "color"},\n    "border-top-left-radius":      {"values": []},\n    "border-top-right-radius":     {"values": []},\n    "border-top-style":            {"values": ["dashed", "dotted", "double", "groove", "hidden", "inset", "none", "outset", "ridge", "solid", "inherit"]},\n    "border-top-width":            {"values": ["medium", "thin", "thick", "inherit"]},\n    "border-width":                {"values": ["medium", "thin", "thick", "inherit"]},\n    "box-decoration-break":        {"values": []},\n    "box-shadow":                  {"values": []},\n    "box-sizing":                  {"values": ["border-box", "content-box", "padding-box", "inherit"]},\n    "bottom":                      {"values": ["auto", "inherit"]},\n    "break-after":                 {"values": ["always", "auto", "avoid", "avoid-column", "avoid-page", "avoid-region", "column", "left", "page", "region", "right"]},\n    "break-before":                {"values": ["always", "auto", "avoid", "avoid-column", "avoid-page", "avoid-region", "column", "left", "page", "region", "right"]},\n    "break-inside":                {"values": ["auto", "avoid", "avoid-column", "avoid-page", "avoid-region"]},\n    "caption-side":                {"values": ["bottom", "top", "inherit"]},\n    "clear":                       {"values": ["both", "left", "none", "right", "inherit"]},\n    "clip":                        {"values": ["auto", "inherit"]},\n    "color":                       {"values": ["inherit"], "type": "color"},\n    "columns":                     {"values": []},\n    "column-count":                {"values": []},\n    "column-fill":                 {"values": ["auto", "balance"]},\n    "column-gap":                  {"values": ["normal"]},\n    "column-rule":                 {"values": []},\n    "column-rule-color":           {"values": [], "type": "color"},\n    "column-rule-style":           {"values": ["dashed", "dotted", "double", "groove", "hidden", "inset", "none", "outset", "ridge", "solid", "inherit"]},\n    "column-rule-width":           {"values": ["medium", "thin", "thick", "inherit"]},\n    "column-span":                 {"values": ["all", "none"]},\n    "column-width":                {"values": ["auto", "inherit"]},\n    "content":                     {"values": ["attr()", "close-quote", "no-close-quote", "no-open-quote", "normal", "none", "open-quote", "inherit"]},\n    "counter-increment":           {"values": ["none", "inherit"]},\n    "counter-reset":               {"values": ["none", "inherit"]},\n    "cursor":                      {"values": ["alias", "all-scroll", "auto", "cell", "col-resize", "context-menu", "copy", "crosshair", "default", "e-resize", "ew-resize", "grab", "grabbing", "help", "inherit", "move", "n-resize", "ne-resize", "nesw-resize", "no-drop", "none", "not-allowed", "ns-resize", "nw-resize", "nwse-resize", "pointer", "progress", "row-resize", "s-resize", "se-resize", "sw-resize", "text", "vertical-text", "w-resize", "wait", "zoom-in", "zoom-out"]},\n    "direction":                   {"values": ["ltr", "rtl", "inherit"]},\n    "display":                     {"values": ["block", "flex", "grid", "inline", "inline-block", "inline-flex", "inline-grid", "inline-table", "list-item", "none", "run-in", "table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row", "table-row-group", "inherit"]},\n    "empty-cells":                 {"values": ["hide", "show", "inherit"]},\n    "filter":                      {"values": ["blur()", "brightness()", "contrast()", "custom()", "drop-shadow()", "grayscale()", "hue-rotate()", "invert()", "none", "opacity()", "sepia()", "saturate()", "url()"]},\n    "flex":                        {"values": ["auto", "initial", "none"]},\n    "flex-basis":                  {"values": ["auto"]},\n    "flex-direction":              {"values": ["column", "column-reverse", "row", "row-reverse"]},\n    "flex-flow":                   {"values": ["column", "column-reverse", "nowrap", "row", "row-reverse", "wrap", "wrap-reverse"]},\n    "flex-grow":                   {"values": []},\n    "flex-shrink":                 {"values": []},\n    "flex-wrap":                   {"values": ["nowrap", "wrap", "wrap-reverse"]},\n    "float":                       {"values": ["left", "right", "none", "inherit"]},\n    "flow-into":                   {"values": ["none"], "type": "named-flow"},\n    "flow-from":                   {"values": ["none", "inherit"], "type": "named-flow"},\n    "font":                        {"values": []},\n    "font-display":                {"values": ["auto", "block", "swap", "fallback", "optional"]},\n    "font-family":                 {"values": ["cursive", "fantasy", "inherit", "monospace", "sans-serif", "serif"]},\n    "font-feature-settings":       {"values": ["normal"]},\n    "font-kerning":                {"values": ["auto", "none", "normal"]},\n    "font-language-override":      {"values": ["normal"]},\n    "font-size":                   {"values": []},\n    "font-size-adjust":            {"values": ["auto", "none"]},\n    "font-stretch":                {"values": ["condensed", "expanded", "extra-condensed", "extra-expanded", "normal", "semi-condensed", "semi-expanded", "ultra-condensed", "ultra-expanded"]},\n    "font-style":                  {"values": ["italic", "normal", "oblique"]},\n    "font-synthesis":              {"values": ["none", "style", "weight"]},\n    "font-variant":                {"values": ["normal", "small-caps", "inherit"]},\n    "font-variant-alternates":     {"values": ["normal"]},\n    "font-variant-caps":           {"values": ["normal", "small-caps", "all-small-caps", "petite-caps", "all-petite-caps", "unicase", "titling-caps"]},\n    "font-variant-east-asian":     {"values": ["normal"]},\n    "font-variant-ligatures":      {"values": ["normal", "none"]},\n    "font-variant-numeric":        {"values": ["normal"]},\n    "font-variant-position":       {"values": ["normal", "sub", "super"]},\n    "font-weight":                 {"values": ["bold", "bolder", "lighter", "normal", "100", "200", "300", "400", "500", "600", "700", "800", "900", "inherit"]},\n    "grid":                        {"values": []},\n    "grid-area":                   {"values": []},\n    "grid-auto-columns":           {"values": []},\n    "grid-auto-flow":              {"values": ["row", "column", "dense"]},\n    "grid-auto-rows":              {"values": []},\n    "grid-column":                 {"values": ["auto"]},\n    "grid-column-end":             {"values": []},\n    "grid-column-gap":             {"values": []},\n    "grid-column-start":           {"values": []},\n    "grid-gap":                    {"values": []},\n    "grid-row":                    {"values": ["auto"]},\n    "grid-row-end":                {"values": []},\n    "grid-row-start":              {"values": []},\n    "grid-row-gap":                {"values": []},\n    "grid-template-areas":         {"values": []},\n    "grid-template-columns":       {"values": ["auto"]},\n    "grid-template-rows":          {"values": ["auto"]},\n    "height":                      {"values": ["auto", "inherit"]},\n    "hyphens":                     {"values": ["auto", "manual", "none"]},\n    "image-orientation":           {"values": []},\n    "image-resolution":            {"values": ["from-image", "snap"]},\n    "justify-content":             {"values": ["center", "flex-end", "flex-start", "space-around", "space-between"]},\n    "left":                        {"values": ["auto", "inherit"]},\n    "letter-spacing":              {"values": ["normal", "inherit"]},\n    "line-height":                 {"values": ["normal", "inherit"]},\n    "list-style":                  {"values": ["none", "inherit", "initial", "unset", "url()", "armenian", "circle", "decimal", "decimal-leading-zero", "disc", "georgian", "inside", "lower-alpha", "lower-greek", "lower-latin", "lower-roman", "outside", "square", "upper-alpha", "upper-latin", "upper-roman"]},\n    "list-style-image":            {"values": ["none", "url()", "inherit"]},\n    "list-style-position":         {"values": ["inside", "outside", "inherit"]},\n    "list-style-type":             {"values": ["armenian", "circle", "decimal", "decimal-leading-zero", "disc", "georgian", "lower-alpha", "lower-greek", "lower-latin", "lower-roman", "none", "square", "upper-alpha", "upper-latin", "upper-roman", "inherit"]},\n    "margin":                      {"values": ["auto", "inherit"]},\n    "margin-bottom":               {"values": ["auto", "inherit"]},\n    "margin-left":                 {"values": ["auto", "inherit"]},\n    "margin-right":                {"values": ["auto", "inherit"]},\n    "margin-top":                  {"values": ["auto", "inherit"]},\n    "max-height":                  {"values": ["none", "inherit"]},\n    "max-width":                   {"values": ["none", "inherit"]},\n    "min-height":                  {"values": ["inherit"]},\n    "min-width":                   {"values": ["inherit"]},\n    "object-fit":                  {"values": ["contain", "cover", "fill", "none", "scale-down"]},\n    "object-position":             {"values": ["left", "center", "right", "bottom", "top"]},\n    "opacity":                     {"values": ["inherit"]},\n    "order":                       {"values": []},\n    "orphans":                     {"values": ["inherit"]},\n    "outline":                     {"values": ["inherit"]},\n    "outline-color":               {"values": ["invert", "inherit"], "type": "color"},\n    "outline-offset":              {"values": ["inherit"]},\n    "outline-style":               {"values": ["dashed", "dotted", "double", "groove", "hidden", "inset", "none", "outset", "ridge", "solid", "inherit"]},\n    "outline-width":               {"values": ["medium", "thin", "thick", "inherit"]},\n    "overflow":                    {"values": ["auto", "hidden", "scroll", "visible", "inherit"]},\n    "overflow-x":                  {"values": ["auto", "hidden", "scroll", "visible", "inherit"]},\n    "overflow-y":                  {"values": ["auto", "hidden", "scroll", "visible", "inherit"]},\n    "padding":                     {"values": ["inherit"]},\n    "padding-bottom":              {"values": []},\n    "padding-left":                {"values": []},\n    "padding-right":               {"values": []},\n    "padding-top":                 {"values": []},\n    "page-break-after":            {"values": ["always", "auto", "avoid", "left", "right", "inherit"]},\n    "page-break-before":           {"values": ["always", "auto", "avoid", "left", "right", "inherit"]},\n    "page-break-inside":           {"values": ["auto", "avoid", "inherit"]},\n    "perspective":                 {"values": ["none"]},\n    "perspective-origin":          {"values": ["bottom", "center", "left", "right", "top"]},\n    "pointer-events":              {"values": ["all", "auto", "fill", "inherit", "none", "painted", "stroke", "visible", "visibleFill", "visiblePainted", "visibleStroke"]},\n    "position":                    {"values": ["absolute", "fixed", "relative", "static", "sticky", "inherit"]},\n    "quotes":                      {"values": ["none", "inherit"]},\n    "region-break-after":          {"values": ["always", "auto", "avoid", "avoid-column", "avoid-page", "avoid-region", "column", "left", "page", "region", "right"]},\n    "region-break-before":         {"values": ["always", "auto", "avoid", "avoid-column", "avoid-page", "avoid-region", "column", "left", "page", "region", "right"]},\n    "region-break-inside":         {"values": ["auto", "avoid", "avoid-column", "avoid-page", "avoid-region"]},\n    "region-fragment":             {"values": ["auto", "break"]},\n    "resize":                      {"values": ["both", "horizontal", "none", "vertical", "inherit"]},\n    "right":                       {"values": ["auto", "inherit"]},\n    "src":                         {"values": [ "url()"]},\n    "shape-image-threshold":       {"values": []},\n    "shape-inside":                {"values": ["auto", "circle()", "ellipse()", "inherit", "outside-shape", "polygon()", "rectangle()"]},\n    "shape-margin":                {"values": []},\n    "shape-outside":               {"values": ["none", "inherit", "circle()", "ellipse()", "polygon()", "inset()", "margin-box", "border-box", "padding-box", "content-box", "url()", "image()", "linear-gradient()", "radial-gradient()", "repeating-linear-gradient()", "repeating-radial-gradient()"]},\n    "table-layout":                {"values": ["auto", "fixed", "inherit"]},\n    "text-align":                  {"values": ["center", "left", "justify", "right", "inherit"]},\n    "text-align-last":             {"values": ["center", "left", "justify", "right", "inherit"]},\n    "text-decoration":             {"values": ["line-through", "none", "overline", "underline", "inherit"]},\n    "text-decoration-color":       {"values": [], "type": "color"},\n    "text-decoration-line":        {"values": ["line-through", "none", "overline", "underline"]},\n    "text-decoration-skip":        {"values": ["edges", "ink", "none", "objects", "spaces"]},\n    "text-decoration-style":       {"values": ["dashed", "dotted", "double", "solid", "wavy"]},\n    "text-emphasis":               {"values": []},\n    "text-emphasis-color":         {"values": [], "type": "color"},\n    "text-emphasis-position":      {"values": ["above", "below", "left", "right"]},\n    "text-emphasis-style":         {"values": ["circle", "dot", "double-circle", "filled", "none", "open", "sesame", "triangle"]},\n    "text-indent":                 {"values": ["inherit"]},\n    "text-overflow":               {"values": ["clip", "ellipsis", "inherit"]},\n    "text-shadow":                 {"values": []},\n    "text-rendering":              {"values": ["auto", "geometricPrecision", "optimizeLegibility", "optimizeSpeed"]},\n    "text-transform":              {"values": ["capitalize", "full-width", "lowercase", "none", "uppercase", "inherit"]},\n    "text-underline-position":     {"values": ["alphabetic", "auto", "below", "left", "right"]},\n    "top":                         {"values": ["auto", "inherit"]},\n    "transform":                   {"values": ["matrix()", "matrix3d()", "none", "perspective()", "rotate()", "rotate3d()", "rotateX()", "rotateY()", "rotateZ()", "scale()", "scale3d()", "scaleX()", "scaleY()", "scaleZ()", "skewX()", "skewY()", "translate()", "translate3d()", "translateX()", "translateY()", "translateZ()"]},\n    "transform-origin":            {"values": ["bottom", "center", "left", "right", "top"]},\n    "transform-style":             {"values": ["flat", "preserve-3d"]},\n    "transition":                  {"values": []},\n    "transition-delay":            {"values": []},\n    "transition-duration":         {"values": []},\n    "transition-property":         {"values": ["all", "none"]},\n    "transition-timing-function":  {"values": ["cubic-bezier()", "ease", "ease-in", "ease-in-out", "ease-out", "linear", "step-end", "step-start", "steps()"]},\n    "unicode-bidi":                {"values": ["bidi-override", "embed", "normal", "inherit"]},\n    "unicode-range":               {"values": []},\n    "vertical-align":              {"values": ["baseline", "bottom", "middle", "sub", "super", "text-bottom", "text-top", "top", "inherit"]},\n    "visibility":                  {"values": ["collapse", "hidden", "visible", "inherit"]},\n    "white-space":                 {"values": ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "inherit"]},\n    "widows":                      {"values": ["inherit"]},\n    "width":                       {"values": ["auto", "inherit"]},\n    "will-change":                 {"values": ["auto", "contents", "opacity", "scroll-position", "transform", "inherit", "initial", "unset"]},\n    "word-break":                  {"values": ["normal", "break-all", "keep-all"]},\n    "word-spacing":                {"values": ["normal", "inherit"]},\n    "word-wrap":                   {"values": ["break-word", "normal"]},\n    "z-index":                     {"values": ["auto", "inherit"]}\n}\n'}),define("main",["require","exports","module","text!CSSProperties.json"],function(e,n,t){"use strict";function i(){this.primaryTriggerKeys="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-()",this.secondaryTriggerKeys=":",this.exclusion=null}function o(e,n){var t=e.some(function(e){return e.color});return v.basicMatchSort(e),e.map(function(e){var n=$("<span>").addClass("brackets-css-hints");return e.stringRanges?e.stringRanges.forEach(function(e){e.matched?n.append($("<span>").text(e.text).addClass("matched-hint")):n.append(e.text)}):n.text(e.value),t&&(n=p.formatColorHint(n,e.color)),n})}var a=brackets.getModule("utils/AppInit"),r=brackets.getModule("utils/ExtensionUtils"),s=brackets.getModule("editor/CodeHintManager"),l=brackets.getModule("language/CSSUtils"),u=brackets.getModule("language/HTMLUtils"),d=brackets.getModule("language/LanguageManager"),c=brackets.getModule("preferences/PreferencesManager"),h=brackets.getModule("utils/TokenUtils"),v=brackets.getModule("utils/StringMatch"),p=brackets.getModule("utils/ColorUtils"),g=brackets.getModule("strings"),f=e("text!CSSProperties.json"),m=JSON.parse(f);c.definePreference("codehint.CssPropHints","boolean",!0,{description:g.DESCRIPTION_CSS_PROP_HINTS});var b,x={preferPrefixMatches:!0};i.prototype.getCssStyleText=function(){if("html"===d.getLanguageForPath(this.editor.document.file.fullPath).getId()){var e="",n=u.findBlocks(this.editor,"css");return n.forEach(function(n){e+=n.text}),e}return this.editor.document.getText()},i.prototype.getNamedFlows=function(){return this.namedFlowsCache&&this.namedFlowsCache.cursor.line!==this.cursor.line&&(this.namedFlowsCache=null),this.namedFlowsCache||(this.namedFlowsCache={},this.namedFlowsCache.flows=l.extractAllNamedFlows(this.getCssStyleText()),this.namedFlowsCache.cursor={line:this.cursor.line,ch:this.cursor.ch}),this.namedFlowsCache.flows},i.prototype.updateExclusion=function(e){var n;this.exclusion&&this.info&&(this.info.context===l.PROP_NAME?n=this.info.name.substr(this.info.offset):e||this.info.context!==l.PROP_VALUE||(n=this.info.value.substr(this.info.offset)),s.hasValidExclusion(this.exclusion,n)||(this.exclusion=null))},i.prototype.hasHints=function(e,n){this.editor=e;var t=this.editor.getCursorPos();return b=null,this.info=l.getInfoAtPos(e,t),this.info.context!==l.PROP_NAME&&this.info.context!==l.PROP_VALUE?!1:n?(this.updateExclusion(!1),this.info.context===l.PROP_NAME&&(this.exclusion||1!==this.info.offset||n!==this.info.name[0]||(this.exclusion=this.info.name.substr(this.info.offset))),-1!==this.primaryTriggerKeys.indexOf(n)||-1!==this.secondaryTriggerKeys.indexOf(n)):(this.info.context===l.PROP_NAME&&(0===this.info.offset?this.exclusion=this.info.name:this.updateExclusion(!0)),!0)},i.prototype.getHints=function(e){this.cursor=this.editor.getCursorPos(),this.info=l.getInfoAtPos(this.editor,this.cursor);var n,t,i,a,r=this.info.name,s="",u=this.info.context,d=!1;return this.updateExclusion(!0),u===l.PROP_VALUE?(d=!0,"("===e?!0:b===l.PROP_NAME?!0:(b=l.PROP_VALUE,m[r]?(this.info.isNewItem||-1===this.info.index||(s=this.info.values[this.info.index].trim(),s=s.substr(0,this.info.offset)),n=m[r].values,t=m[r].type,"named-flow"===t?(i=this.getNamedFlows(),s.length===this.info.offset&&-1!==i.indexOf(s)&&i.splice(i.indexOf(s),1),n=n.concat(i)):"color"===t&&(n=n.concat(p.COLOR_NAMES.map(function(e){return{text:e,color:e}})),n.push("transparent","currentColor")),a=$.map(n,function(e){var n=v.stringMatch(e.text||e,s,x);return n?(e.color&&(n.color=e.color),n):void 0}),{hints:o(a,s),match:null,selectInitial:d}):null)):u===l.PROP_NAME?((-1!==this.primaryTriggerKeys.indexOf(e)||""!==r)&&(d=!0),b===l.PROP_VALUE?null:(b=l.PROP_NAME,r=r.substr(0,this.info.offset),a=$.map(m,function(e,n){var t=v.stringMatch(n,r,x);return t?t:void 0}),{hints:o(a,r),match:null,selectInitial:d,handleWideResults:!1})):null},i.prototype.insertHint=function(e){var n,t,i=this.info.offset,o=this.editor.getCursorPos(),a={line:-1,ch:-1},r={line:-1,ch:-1},u=!1,d=!1;if(e.jquery&&(e=e.text()),this.info.context!==l.PROP_NAME&&this.info.context!==l.PROP_VALUE)return!1;if(a.line=r.line=o.line,a.ch=o.ch-i,this.info.context===l.PROP_NAME){u=!0;var c=this.info.name.substr(this.info.offset);0===this.info.name.length||s.hasValidExclusion(this.exclusion,c)?(e+=": ",r.ch=a.ch,r.ch+=i,this.exclusion&&(e+=" ",d=!0,n={line:o.line,ch:a.ch+e.length-1},this.exclusion=null)):(r.ch=a.ch+this.info.name.length,t=h.getInitialContext(this.editor._codeMirror,o),t.token.string.length>0&&!/\S/.test(t.token.string)&&h.moveNextToken(t),h.moveSkippingWhitespace(h.moveNextToken,t)&&":"===t.token.string?(d=!0,n={line:o.line,ch:o.ch+(e.length-this.info.name.length)},h.moveNextToken(t)&&t.token.string.length>0&&!/\S/.test(t.token.string)&&(n.ch+=t.token.string.length)):e+=": ")}else{this.info.isNewItem||-1===this.info.index?r.ch=a.ch:r.ch=a.ch+this.info.values[this.info.index].length;var v=e.match(/\(.*?\)/);v&&(d=!0,n={line:o.line,ch:a.ch+v.index+1},u=!0)}return this.editor._codeMirror.replaceRange(e,a,r),d&&this.editor.setCursorPos(n),u},a.appReady(function(){var e=new i;s.registerHintProvider(e,["css","scss","less"],0),r.loadStyleSheet(t,"styles/brackets-css-hints.css"),n.cssPropHintProvider=e})});