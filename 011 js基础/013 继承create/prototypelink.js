function myCrate(obj) {
    var F = function(){};
    F.prototype = obj;
    return new F();
}

var base = {
    baseInfo: 'baseInfo',
    displayBase: function() {
        console.info(this);
    }
};

base.displayBase();

var child = myCrate(base);

child.displayBase();

console.info('child', child.baseInfo)