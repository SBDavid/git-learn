function myCrate(obj) {
    var F = function(){};
    F.prototype = obj;
    return new F();
}

var t1 = {
    a: 1
}

var t2 = myCrate(t1);

t2.a = 2;


console.info(t1, t2);