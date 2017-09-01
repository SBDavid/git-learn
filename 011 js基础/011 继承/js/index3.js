var extend = function(protoProps, classProps) {
    return inherits(this, protoProps, classProps);
};

var inherits = function(parent, protoProps, staticProps) {
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
        child = protoProps.constructor;
    } else {
        child = function() {
            parent.apply(this, arguments);
        };
    }

    // Inherit class (static) properties from parent.
    _.extend(child, parent);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    ctor = function() {}
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

var Model = function() {
    this.model = 'm';
    this.setModel = function(str){
        this.model = str;
    }
};

Model.prototype.getModel = function() {
    return this.model;
}

Model.extend = extend;



var c = Model.extend({
    prop: 'prop',
    fun: function() {
        console.info(this.prop);
    }
})

var c1 = new c();
c1.fun();

var cc = c.extend({
    propc: 'propc',
    func: function() {
        console.info(this.propc);
    }
})

var cc1 = new cc();

cc1.fun();
cc1.func();

console.info('getModel', cc1.getModel());
cc1.setModel('11');
console.info('getModel', cc1.getModel());
