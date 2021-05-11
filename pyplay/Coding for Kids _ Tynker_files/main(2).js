define("main",["require","exports","module"],function(e,t,r){"use strict";function i(){}var n=brackets.getModule("utils/AppInit"),o=brackets.getModule("editor/CodeHintManager"),s=["print","range","False","None","True","and","as","assert","break","class","continue","def","del","elif","else","except","finally","for","from","global","if","import","in","is","lambda","nonlocal","not","or","pass","raise","return","try","while","with","yield"],l=["degrees","radians","position","pos","towards","distance","heading","xcor","ycor","forward","undo","undobufferentries","setundobuffer","backward","setpos","setposition","setx","sety","home","right","left","setheading","circle","penup","pendown","isdown","speed","pencolor","fillcolor","color","fill","begin_fill","end_fill","stamp","dot","write","pensize","showturtle","hideturtle","isvisible","shape","window_width","window_height","tracer","update","kelay","reset","clear","onclick","onrelease","ondrag","mainloop","done","getscreen","clone","getturtle","setup","register_shape","getshapes","tracer","delay","setworldcoordinates","clear","clearscreen","update","reset","resetscreen","window_width","window_height","turtles","bgcolor","mainloop","bye","exitonclick","listen","onkey","onscreenclick","ontimer"];i.prototype.hasHints=function(e,t){var r=e.getCursorPos();e._codeMirror.getTokenAt(r);return this.editor=e,!0},i.prototype.getHints=function(e){var t=this.editor.getCursorPos(),r=this.editor._codeMirror.getTokenAt(t);if(this.filter=r.string,this.token=r,!this.filter)return null;var i;return i="property"===r.state.lastToken?l.filter(function(e){return 0===e.indexOf(r.string)?e:void 0}).sort():s.filter(function(e){return 0===e.indexOf(r.string)?e:void 0}).sort(),{hints:i,match:this.filter,selectInitial:!0,defaultDescriptionWidth:!0,handleWideResults:!1}},i.prototype.insertHint=function(e){var t=this.editor.getCursorPos();return this.editor.document.replaceRange(e,{line:t.line,ch:this.token.start},{line:t.line,ch:this.token.end}),!1},n.appReady(function(){var e=new i;o.registerHintProvider(e,["py"],0),t.restrictedBlockHints=e})});