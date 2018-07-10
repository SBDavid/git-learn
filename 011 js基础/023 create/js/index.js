// 这里是Object.create的学习

// 参数一：proto 新创建对象的原型对象。
// 参数二：propertiesObject 则是要添加到新创建对象的可枚举属性

var shape = {
    x: 'x1',
    print: function () {
        console.info(this.x)
    }
};

// retangle.__proto__ 指向 shape对象
const retangle = Object.create(shape);

// 使用构造方法实现继承
function parent() {
    this.name = 'parent';
    console.info('parent()');
}

parent.prototype.print = function () {
    console.info('print: ' + this.name)
}

function chlid() {
    parent.call(this);
}

chlid.prototype = Object.create(parent.prototype, {
    foo: {
        enumerable: false,
        writable: true,
        configurable: true,
        value: "hello"
    }
});

chlid.prototype.constructor = chlid;

var c1 = new chlid();

