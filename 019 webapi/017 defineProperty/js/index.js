// 浅层次属性监听

let target = {
    prop: {}
};

const p = Object.getOwnPropertyDescriptor(target, 'prop');

Object.defineProperty(target, "prop", {
    configurable: true,
    enumerable: true,
    get: function() {
        console.info('get');
        return this._prop;
    },
    set: function(newValue) {
        console.info('set');
        this._prop = newValue;
    }
});

console.log('浅层次属性监听');
console.info('target.prop默认值', target.prop);
target.prop = 'haha';
console.info('target.prop 赋值', target.prop);
target.prop.a = 'a';
console.info('target.prop.a 赋值', target.prop.a);
