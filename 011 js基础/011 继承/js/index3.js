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
            // 如果不适用apply那么parent中创建的实例不会存在于child的实例内
            parent.apply(this, arguments);
        };
    }

    // Inherit class (static) properties from parent.
    _.extend(child, parent);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    // 使用中间对象避免child的原型对象上存在parent实例属性；
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

var Base = function() {
    console.info('this is the constructor of base')
};

Base.extend = extend;

// 方法一：通过调用父类的构造方法
var parentModel1 = Base.extend({
	// 对象中的方法将被添加到子类的prototype上
    funA: function() {
        console.info('this is a function');
    }
}, {
	// 这个方法将被添加到子类的构造器上
	staticFun: function() {
		console.info('this is a static function');
	}
});

var p1 = new parentModel1();
p1.funA();
parentModel1.staticFun();

// 方法二：子类自己定义构造方法
var parentModel2 = Base.extend({
    constructor: function(){
        console.info('this is the constructor of parentModel2')
    },
	// 对象中的方法将被添加到子类的prototype上
    funA: function() {
        console.info('this is a function');
    }
}, {
	// 这个方法将被添加到子类的构造器上
	staticFun: function() {
		console.info('this is a static function');
	}
});

var p2 = new parentModel2();
p2.funA();
parentModel2.staticFun();