// 这里是Object.create的学习

// 参数一：proto 新创建对象的原型对象。
// 参数二：propertiesObject 则是要添加到新创建对象的可枚举属性

var shape = {
    x: 'x1'
};

const retangle = Object.create(shape);