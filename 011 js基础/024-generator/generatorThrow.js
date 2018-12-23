var g = function* () {
    while(true) {
        try {
            console.info('yield 1')
            yield 1;
        } catch (e) {
            console.log('内部捕获', e);
            break;
        }
        yield 2;
    }
};

var i = g();
console.info(i.next());

try {
    console.info('throw', i.throw('a'));
    i.throw('b');
} catch (e) {
    console.log('外部捕获', e);
}