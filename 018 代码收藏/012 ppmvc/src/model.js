var _ = require('underscore'),
    extend = require('./extend'),
    Events = require('./events')

var Model = function (attributes, options) {
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

Model.extend = extend;

module.exports = Model;