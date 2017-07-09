(function (global) {

    //
    // export if necessary
    //

    if (typeof exports !== 'undefined' && exports) {
        // node.js
        exports.EventUtil = EventUtil;
    }
    else {
        // AMD
        if (typeof define == 'function' && define.amd) {
            define(function () {
                return EventUtil;
            });
        }
        else {
            // in browser add to global
            global['EventUtil'] = EventUtil;
        }
    }

    var EventUtil = {
        addHandler: function (element, type, handler) {
            if (element.addEventListener) {
                element.addEventListener(type, handler, false);
            } else if (element.attachEvent) {
                element.attachEvent("on" + type, handler);
            } else {
                element["on" + type] = handler;
            }
        },
        removeHandler: function (element, type, handler) {
            if (element.removeEventListener) {
                element.removeEventListener(type, handler, false);
            } else if (element.detachEvent) {
                element.detachEvent("on" + type, handler);
            } else {
                element["on" + type] = null;
            }
        }
    };

})(typeof window != 'undefined' ? window : typeof global != 'undefined' ? global : typeof self != 'undefined' ? self : this);