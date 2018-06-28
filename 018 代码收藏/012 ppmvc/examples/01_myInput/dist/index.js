/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// ppmvc.js 1.0.0

(function (factory) {

    // Establish the root object, `window` (`self`) in the browser, or `global` on the server.
    // We use `self` instead of `window` for `WebWorker` support.
    var root = (typeof self == 'object' && self.self === self && self) ||
        (typeof global == 'object' && global.global === global && global);

    // Set up ppmvc appropriately for the environment. Start with AMD.
    if (true /* && define.amd */) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(6), __webpack_require__(1), exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_, $, exports) {
            // Export global even in AMD case in case this script is loaded with
            // others that may still expect a global ppmvc.
            root.ppmvc = factory(root, exports, _, $);
        }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

        // Next for Node.js or CommonJS. jQuery may not be needed as a module.
    } else if (typeof exports !== 'undefined') {
        var _ = require('underscore'), $;
        try { $ = require('jquery'); } catch (e) { }
        factory(root, exports, _, $);

        // Finally, as a browser global.
    } else {
        root.ppmvc = factory(root, {}, root._, (root.jQuery || root.$));
    }

})(function (root, ppmvc, _, $) {
    // Initial Setup
    // -------------

    // Save the previous value of the `Backbone` variable, so that it can be
    // restored later on, if `noConflict` is used.
    var previousPPmvc = root.ppmvc;

    // Create a local reference to a common array method we'll want to use later.
    var slice = Array.prototype.slice;

    // Current version of the library. Keep in sync with `package.json`.
    ppmvc.VERSION = '1.0.0';

    // For Backbone's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
    // the `$` variable.
    ppmvc.$ = $;

    // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
    // to its previous owner. Returns a reference to this Backbone object.
    ppmvc.noConflict = function () {
        root.ppmvc = previousPPmvc;
        return this;
    };

    var Events = ppmvc.Events = {

        // Bind an event to a `callback` function. Passing `"all"` will bind
        // the callback to all events fired.
        on: function (name, callback, context) {
            if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
            this._events || (this._events = {});
            var events = this._events[name] || (this._events[name] = []);
            events.push({ callback: callback, context: context, ctx: context || this });
            return this;
        },

        // Bind an event to only be triggered a single time. After the first time
        // the callback is invoked, it will be removed.
        once: function (name, callback, context) {
            if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
            var self = this;
            var once = _.once(function () {
                self.off(name, once);
                callback.apply(this, arguments);
            });
            once._callback = callback;
            return this.on(name, once, context);
        },

        // Remove one or many callbacks. If `context` is null, removes all
        // callbacks with that function. If `callback` is null, removes all
        // callbacks for the event. If `name` is null, removes all bound
        // callbacks for all events.
        off: function (name, callback, context) {
            if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;

            // Remove all callbacks for all events.
            if (!name && !callback && !context) {
                this._events = void 0;
                return this;
            }

            var names = name ? [name] : _.keys(this._events);
            for (var i = 0, length = names.length; i < length; i++) {
                name = names[i];

                // Bail out if there are no events stored.
                var events = this._events[name];
                if (!events) continue;

                // Remove all callbacks for this event.
                if (!callback && !context) {
                    delete this._events[name];
                    continue;
                }

                // Find any remaining events.
                var remaining = [];
                for (var j = 0, k = events.length; j < k; j++) {
                    var event = events[j];
                    if (
                        callback && callback !== event.callback &&
                        callback !== event.callback._callback ||
                        context && context !== event.context
                    ) {
                        remaining.push(event);
                    }
                }

                // Replace events if there are any remaining.  Otherwise, clean up.
                if (remaining.length) {
                    this._events[name] = remaining;
                } else {
                    delete this._events[name];
                }
            }

            return this;
        },

        // Trigger one or many events, firing all bound callbacks. Callbacks are
        // passed the same arguments as `trigger` is, apart from the event name
        // (unless you're listening on `"all"`, which will cause your callback to
        // receive the true name of the event as the first argument).
        trigger: function (name) {
            if (!this._events) return this;
            var args = Array.prototype.slice.call(arguments, 1);
            if (!eventsApi(this, 'trigger', name, args)) return this;
            var events = this._events[name];
            var allEvents = this._events.all;
            if (events) triggerEvents(events, args);
            if (allEvents) triggerEvents(allEvents, arguments);
            return this;
        },

        // Inversion-of-control versions of `on` and `once`. Tell *this* object to
        // listen to an event in another object ... keeping track of what it's
        // listening to.
        listenTo: function (obj, name, callback) {
            var listeningTo = this._listeningTo || (this._listeningTo = {});
            var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
            listeningTo[id] = obj;
            if (!callback && typeof name === 'object') callback = this;
            obj.on(name, callback, this);
            return this;
        },

        listenToOnce: function (obj, name, callback) {
            if (typeof name === 'object') {
                for (var event in name) this.listenToOnce(obj, event, name[event]);
                return this;
            }
            if (eventSplitter.test(name)) {
                var names = name.split(eventSplitter);
                for (var i = 0, length = names.length; i < length; i++) {
                    this.listenToOnce(obj, names[i], callback);
                }
                return this;
            }
            if (!callback) return this;
            var once = _.once(function () {
                this.stopListening(obj, name, once);
                callback.apply(this, arguments);
            });
            once._callback = callback;
            return this.listenTo(obj, name, once);
        },

        // Tell this object to stop listening to either specific events ... or
        // to every object it's currently listening to.
        stopListening: function (obj, name, callback) {
            var listeningTo = this._listeningTo;
            if (!listeningTo) return this;
            var remove = !name && !callback;
            if (!callback && typeof name === 'object') callback = this;
            if (obj) (listeningTo = {})[obj._listenId] = obj;
            for (var id in listeningTo) {
                obj = listeningTo[id];
                obj.off(name, callback, this);
                if (remove || _.isEmpty(obj._events)) delete this._listeningTo[id];
            }
            return this;
        }

    };

    // Regular expression used to split event strings.
    var eventSplitter = /\s+/;

    // Implement fancy features of the Events API such as multiple event
    // names `"change blur"` and jQuery-style event maps `{change: action}`
    // in terms of the existing API.
    var eventsApi = function (obj, action, name, rest) {
        if (!name) return true;

        // Handle event maps.
        if (typeof name === 'object') {
            for (var key in name) {
                obj[action].apply(obj, [key, name[key]].concat(rest));
            }
            return false;
        }

        // Handle space separated event names.
        if (eventSplitter.test(name)) {
            var names = name.split(eventSplitter);
            for (var i = 0, length = names.length; i < length; i++) {
                obj[action].apply(obj, [names[i]].concat(rest));
            }
            return false;
        }

        return true;
    };

    // A difficult-to-believe, but optimized internal dispatch function for
    // triggering events. Tries to keep the usual cases speedy (most internal
    // Backbone events have 3 arguments).
    var triggerEvents = function (events, args) {
        var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
        switch (args.length) {
            case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
            case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
            case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
            case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
            default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
        }
    };

    // ppmvc.Model
    var Model = ppmvc.Model = function (attributes, options) {
        var attrs = attributes || {};
        options || (options = {});
        this.preinitialize.apply(this, arguments);
        this.attributes = {};
        var defaults = _.result(this, 'defaults');
        attrs = _.defaults(_.extend({}, defaults, attrs), defaults);
        this.set(attrs);
        this.initialize.apply(this, arguments);
    };

    _.extend(Model.prototype, Events, {
        // preinitialize is an empty function by default. You can override it with a function
        // or object.  preinitialize will run before any instantiation logic is run in the Model.
        preinitialize: function () { },

        // Initialize is an empty function by default. Override it with your own
        // initialization logic.
        initialize: function () { },
        get: function () {
            return this.attributes;
        },
        set: function (data) {
            this.attributes = data;
        },
        getAttr: function(attr) {
            return this.attributes[attr];
        },
        setAttr: function(key, value) {
            if (key == null) return this;
            this.attributes[key] = value;
        }
    });

    // ppmvc.View
    var View = ppmvc.View = function (options) {
        this.cid = _.uniqueId('view');
        this.preinitialize.apply(this, arguments);
        _.extend(this, _.pick(options, viewOptions));
        this._ensureElement();
        this.initialize.apply(this, arguments);
    };

    // Cached regex to split keys for `delegate`.
    var delegateEventSplitter = /^(\S+)\s*(.*)$/;

    // List of view options to be set as properties.
    var viewOptions = ['model', 'data', 'el', 'attributes', 'className', 'tagName', 'events'];

    _.extend(View.prototype, Events, {
        // The default `tagName` of a View's element is `"div"`.
        tagName: 'div',

        // jQuery delegate for element lookup, scoped to DOM elements within the
        // current view. This should be preferred to global lookups where possible.
        $: function (selector) {
            return this.$el.find(selector);
        },

        // preinitialize is an empty function by default. You can override it with a function
        // or object.  preinitialize will run before any instantiation logic is run in the View
        preinitialize: function () { },

        // Initialize is an empty function by default. Override it with your own
        // initialization logic.
        initialize: function () { },

        // **render** is the core function that your view should override, in order
        // to populate its element (`this.el`), with the appropriate HTML. The
        // convention is for **render** to always return `this`.
        render: function () {

            this.clean();

            if (this.model) {
                this.$el.html(this.template(this.model.attributes));
            } else if(this.data) {
                this.$el.html(this.template(this.data));
            } else {
                this.$el.html(this.template());
            }
            
            if (this.afterRender || typeof this.afterRender === 'function') {
                this.afterRender(this.$el);
            }

            return this;
        },

        clean: function() {
            this.$el.children().remove();
        },

        // Remove this view by taking the element out of the DOM, and removing any
        // applicable Backbone.Events listeners.
        remove: function () {
            this._removeElement();
            this.stopListening();
            return this;
        },

        // Remove this view's element from the document and all event listeners
        // attached to it. Exposed for subclasses using an alternative DOM
        // manipulation API.
        _removeElement: function () {
            this.$el.remove();
        },

        // Change the view's element (`this.el` property) and re-delegate the
        // view's events on the new element.
        setElement: function (element) {
            this.undelegateEvents();
            this._setElement(element);
            this.delegateEvents();
            return this;
        },

        // Creates the `this.el` and `this.$el` references for this view using the
        // given `el`. `el` can be a CSS selector or an HTML string, a jQuery
        // context or an element. Subclasses can override this to utilize an
        // alternative DOM manipulation API and are only required to set the
        // `this.el` property.
        _setElement: function (el) {
            this.$el = el instanceof ppmvc.$ ? el : ppmvc.$(el);
            this.el = this.$el[0];
        },

        // Set callbacks, where `this.events` is a hash of
        //
        // *{"event selector": "callback"}*
        //
        //     {
        //       'mousedown .title':  'edit',
        //       'click .button':     'save',
        //       'click .open':       function(e) { ... }
        //     }
        //
        // pairs. Callbacks will be bound to the view, with `this` set properly.
        // Uses event delegation for efficiency.
        // Omitting the selector binds the event to `this.el`.
        delegateEvents: function (events) {
            events || (events = _.result(this, 'events'));
            if (!events) return this;
            this.undelegateEvents();
            for (var key in events) {
                var method = events[key];
                if (!_.isFunction(method)) method = this[method];
                if (!method) continue;
                var match = key.match(delegateEventSplitter);
                this.delegate(match[1], match[2], _.bind(method, this));
            }
            return this;
        },

        // Add a single event listener to the view's element (or a child element
        // using `selector`). This only works for delegate-able events: not `focus`,
        // `blur`, and not `change`, `submit`, and `reset` in Internet Explorer.
        delegate: function (eventName, selector, listener) {
            this.$el.on(eventName + '.delegateEvents' + this.cid, selector, listener);
            return this;
        },

        // Clears all callbacks previously bound to the view by `delegateEvents`.
        // You usually don't need to use this, but may wish to if you have multiple
        // Backbone views attached to the same DOM element.
        undelegateEvents: function () {
            if (this.$el) this.$el.off('.delegateEvents' + this.cid);
            return this;
        },

        // A finer-grained `undelegateEvents` for removing a single delegated event.
        // `selector` and `listener` are both optional.
        undelegate: function (eventName, selector, listener) {
            this.$el.off(eventName + '.delegateEvents' + this.cid, selector, listener);
            return this;
        },

        // Produces a DOM element to be assigned to your view. Exposed for
        // subclasses using an alternative DOM manipulation API.
        _createElement: function (tagName) {
            return document.createElement(tagName);
        },

        // Ensure that the View has a DOM element to render into.
        // If `this.el` is a string, pass it through `$()`, take the first
        // matching element, and re-assign it to `el`. Otherwise, create
        // an element from the `id`, `className` and `tagName` properties.
        _ensureElement: function () {
            if (!this.el) {
                var attrs = _.extend({}, _.result(this, 'attributes'));
                if (this.id) attrs.id = _.result(this, 'id');
                if (this.className) attrs['class'] = _.result(this, 'className');
                this.setElement(this._createElement(_.result(this, 'tagName')));
                this._setAttributes(attrs);
            } else {
                this.setElement(_.result(this, 'el'));
            }
        },

        // Set attributes from a hash on this view's element.  Exposed for
        // subclasses using an alternative DOM manipulation API.
        _setAttributes: function (attributes) {
            this.$el.attr(attributes);
        }
    });

    
    // ActionTypes
    var ActionTypes = function() {
        this.types = [];
    }

    _.extend(ActionTypes.prototype, {
        set: function(types) {
            var self = this;
            this.types = [];
            for(var index in types) {
                self.types.push({
                    NAME: index,
                    MODEL: types[index].MODEL
                })
            }
        },
        add: function(name, model) {
            this.types.push({
                NAME: name,
                MODEL: model
            })
        },
        get: function(name) {
            if(name === null)
                return null;
            return _.find(this.types, function(type) {
                return type.NAME === name;
            }).MODEL
        },
        remove: function(name) {
            // TODO
        }
    });

    ppmvc.ActionTypes = new ActionTypes();

    // ppmvc.Store
    var Store = function() {
        this.models = {};
    }

    _.extend(Store.prototype, Events, {
        /**
         * 静动态创建model对象 并放入models模型里
         * @param type 类型
         * @param cb 返回值
         * @param options 配置参数 如果有data代表外部数据导入，如果有url表示异步请求
         */
        load: function(type, cb, options) {
            if (typeof type === "string" && typeof cb === "function") {
                if (typeof options !== "undefined") {
                    this.on(type, cb);
                    if (options.hasOwnProperty('url')) {
                        this._asynLoad(type, cb, options);
                    } else if (options.hasOwnProperty('data')) {
                        this.models[type] = this._createModel(type, options['data']);
                        this.trigger(type, { "model": this.models[type] });
                    }
                }
            }
        },
        /**
         * 获取具体模型对象
         */
        getModel: function(name) {
            if (typeof name === "string" && this.models.hasOwnProperty(name)) {
                return this.models[name];
            } else {
                return null;
            }
        },
        /**
         * 创建不同的model
         * @param type 类型
         * @param data 数据内容
         * @return 返回model
         */
        _createModel: function(type, data) {
            var model;
        
            var ActionType = ppmvc.ActionTypes.get(type);
        
            if (ActionType) {
                model = new ActionType(data);
            } else {
                model = new Model(data);
            }
        
            return model;
        },
        /**
         * 异步请求远端数据
         * @param type 类型
         * @param cb 回调函数
         * @param options 参数
         */
        _asynLoad: function(type, cb, options) {
            var self = this;
            var lp = function() {
                var loadDeferred = $.Deferred();
                var loadPromise = loadDeferred.promise();
                ppmvc.ajax(options).done(function(data) {
                    loadDeferred.resolve(data);
                }).fail(function() {
                    loadDeferred.resolve({ 'errorCode': '500' });
                });
                return loadDeferred;
            }
            lp().then(function(data) {
                self.models[type] = self._createModel(type, data);
                self.trigger(type, { "model": self.models[type] })
            });
        }
    });

    ppmvc.Store = new Store();

    // ajax
    ppmvc.ajax = function() {
        if ($.ppXHR) {
            return ppmvc.$.ppXHR.JSONP.apply(ppmvc.$, arguments);
        }
        return ppmvc.$.ajax.apply(ppmvc.$, arguments);
    };


    // 继承模块
    var extend = function (protoProps, classProps) {
        return inherits(this, protoProps, classProps);
    };

    var inherits = function (parent, protoProps, staticProps) {
        var child;

        // The constructor function for the new subclass is either defined by you
        // (the "constructor" property in your `extend` definition), or defaulted
        // by us to simply call the parent's constructor.
        if (protoProps && protoProps.hasOwnProperty('constructor')) {
            child = protoProps.constructor;
        } else {
            child = function () {
                parent.apply(this, arguments);
            };
        }

        // Inherit class (static) properties from parent.
        _.extend(child, parent);

        // Set the prototype chain to inherit from `parent`, without calling
        // `parent`'s constructor function.
        var ctor = function () { }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();

        // Add prototype properties (instance properties) to the subclass,
        // if supplied.
        if (protoProps) _.extend(child.prototype, protoProps);

        // Add static properties to the constructor function, if supplied.
        if (staticProps) _.extend(child, staticProps);

        // Correctly set child's `prototype.constructor`.
        child.prototype.constructor = child;

        // Set a convenience property in case the parent's prototype is needed later.
        child.__super__ = parent.prototype;

        return child;
    };

    // 添加继承模块
    Model.extend = View.extend = extend;

    return ppmvc;
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var myInput = __webpack_require__(3);


var myName = new myInput('我的名字', '铁柱');

window.onload = function() {
    document.getElementById('container').appendChild(myName.getView().el)
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var model = __webpack_require__(4),
    view = __webpack_require__(7);

__webpack_require__(9);

function myInput(title, placeholder) {
    this.init(title, placeholder)
}

myInput.prototype.init = function(title, placeholder) {
    this._model = new model({
        title: title,
        placeholder: placeholder,
        value: ""
    });

    this._view = new view({
        model: this._model
    });

    this._view.render();

    this._view.on('valuechange', function(event) {
        console.info(event);
    });
}

myInput.prototype.setTitle = function(title) {
    this._model.set('title', title);
}

myInput.prototype.getView = function() {
    return this._view;
}

module.exports = myInput;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var ppmvc = __webpack_require__(0);

var model = ppmvc.Model.extend({
    defaults: function () {
        return {
            title: "title",
            placeholder: "placeholder",
            value: ""
        };
    },
});

module.exports = model;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = _;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var ppmvc = __webpack_require__(0),
    $ = __webpack_require__(1);

var tpl = __webpack_require__(8)

var view = ppmvc.View.extend({
    className: 'input-module',
    template: tpl,
    initialize: function() {
        
    },
    events: {
        'keyup .my-input': 'valuechange'
    },
    valuechange: function(event) {
        var newValue = event.currentTarget.value;
        this.model.set('value', newValue);
        this.$el.find('.value').html(newValue);
        this.trigger('valuechange', {
            newVal: newValue
        })
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
        if (this.model.get('value') != '') {
            this.$el.find('input').attr('value', this.model.getAttr('value'));
        }
        return this;
    }
});

module.exports = view;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='\n<!-- src\\modules\\myInput\\tpl.htm -->\n\r\n<h3>'+
((__t=(title))==null?'':__t)+
'</h3>\r\n<div>\r\n    <strong>输入：</strong><input class="my-input" type="text" name="firstname" placeholder='+
((__t=(placeholder))==null?'':__t)+
' />\r\n</div>\r\n<div>\r\n    <strong>显示：</strong><span class=\'value\'>'+
((__t=(value))==null?'':__t)+
'</span>\r\n</div>';
}
return __p;
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(10);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(12)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../../node_modules/.0.28.9@css-loader/index.js??ref--1-1!../../../node_modules/.4.0.5@less-loader/dist/cjs.js??ref--1-2!./index.less", function() {
		var newContent = require("!!../../../node_modules/.0.28.9@css-loader/index.js??ref--1-1!../../../node_modules/.4.0.5@less-loader/dist/cjs.js??ref--1-2!./index.less");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(false);
// imports


// module
exports.push([module.i, ".input-module {\n  font-family: 'Microsoft YaHei';\n}\nstrong {\n  color: gray;\n}\n", ""]);

// exports


/***/ }),
/* 11 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target) {
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(13);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 13 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ })
/******/ ]);