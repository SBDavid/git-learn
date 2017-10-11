Function.prototype.uncurrying = function () {
    console.info('uncurrying', arguments);
    var arg = arguments;
    var self = this;
    return function () {
        console.info('function', arguments);
        console.info('function arg', arg);
        var obj = Array.prototype.shift.call(arguments); return self.apply(obj, arguments);
    };
};

var push = Array.prototype.push.uncurrying('test');

var a = [1];

console.info('a', push(a, 2) && a);