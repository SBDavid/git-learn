function *getIt () {
    console.info('start');
    const res1 = yield 'y1';
    console.info('res1', res1);
    const res2 = yield 'y2';
    console.info('res2', res2);
    console.info('end');
}

const it = getIt();
const out1 = it.next('n1');
console.info(out1);
const out2 = it.next('n2');
console.info(out2);
const out3 = it.next('n3');
console.info(out3);