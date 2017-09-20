/**
 * @author [pelexiang]
 * @email [pelexiang@pptv.com]
 * @create date 2017-09-11 01:43:17
 * @modify date 2017-09-11 01:43:17
 * @desc [description]
 */
var EventMouseWheel = function() {
    // 鼠标中键
    (function($) {
        var types = ['DOMMouseScroll', 'mousewheel'];
        $.event.special.mousewheel = {
            setup: function() {
                if (this.addEventListener) {
                    for (var i = types.length; i;) {
                        this.addEventListener(types[--i], handler, false);
                    }
                } else {
                    this.onmousewheel = handler;
                }
            },
            teardown: function() {
                if (this.removeEventListener) {
                    for (var i = types.length; i;) {
                        this.removeEventListener(types[--i], handler, false);
                    }
                } else {
                    this.onmousewheel = null;
                }
            }
        };
        $.fn.extend({
            mousewheel: function(fn) {
                return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
            },
            unmousewheel: function(fn) {
                return this.unbind("mousewheel", fn);
            }
        });

        function handler(event) {
            var orgEvent = event || window.event,
                args = [].slice.call(arguments, 1),
                delta = 0,
                returnValue = true,
                deltaX = 0,
                deltaY = 0;
            event = $.event.fix(orgEvent);
            event.type = "mousewheel";
            // Old school scrollwheel delta
            if (event.originalEvent.wheelDelta) { delta = event.originalEvent.wheelDelta / 120; }
            if (event.originalEvent.detail) { delta = -event.originalEvent.detail / 3; }
            // New school multidimensional scroll (touchpads) deltas
            deltaY = delta;
            // Gecko
            if (orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS) {
                deltaY = 0;
                deltaX = -1 * delta;
            }
            // Webkit
            if (orgEvent.wheelDeltaY !== undefined) { deltaY = orgEvent.wheelDeltaY / 120; }
            if (orgEvent.wheelDeltaX !== undefined) { deltaX = -1 * orgEvent.wheelDeltaX / 120; }
            // Add event and delta to the front of the arguments
            args.unshift(event, delta, deltaX, deltaY);
            return $.event.dispatch.apply(this, args);
        }
    })($);
}

//实例化
var instance;
module.exports = function() {
    if (!instance) {
        instance = new EventMouseWheel();
        return instance;
    } else {
        return instance;
    }
}();