// extend潜复制

var t1 = {
    a1: 1
}

var t2 = {
    a2: 2
}

$.extend(t1, t2);

console.info('潜复制', t1);

t1 = {
    a1: {
        a11: 1
    }
}

t2 = {
    a1: {
        a12: 1
    }
}

$.extend(t1, t2);

console.info('潜复制，引用类型', t1, t2);

t1 = {
    a1: {
        a11: 1
    }
}

t2 = {
    a1: {
        a12: 1
    }
}

$.extend(true ,t1, t2);

console.info('深复制，引用类型', t1, t2);

t1 = {
    f1: function() {
        return 1;
    }
}

t2 = {
    f1: function() {
        return 2;
    }
}

$.extend(true ,t1, t2); 

/* t2.f1 = function() {
    return 3;
} */

console.info('浅复制，函数类型', t1.f1(), t2.f1());
console.info('浅复制，t1.f1 == t2.f1', t1.f1 == t2.f1);

// 数组测试

t1 = {
    a1: [0]
}

t2 = {
    a1: [0,1]
}

$.extend(t1, t2); 

console.info('浅复制，数组类型', t1.a1, t2.a1);
console.info('浅复制，数组类型，t1.a1 == t2.a1', t1.a1 == t2.a1);
t2.a1.push(2);
console.info('浅复制，数组类型, push', t1.a1, t2.a1);

t1 = {
    a1: [0]
}

t2 = {
    a1: [0,1]
}

$.extend(true, t1, t2); 

console.info('深复制，数组类型', t1.a1, t2.a1);
console.info('深复制，数组类型，t1.a1 == t2.a1', t1.a1 == t2.a1);
t2.a1.push(2);
console.info('深复制，数组类型, push', t1.a1, t2.a1);
