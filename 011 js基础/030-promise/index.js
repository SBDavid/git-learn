const p1 = new Promise((resolve) => {
    setTimeout(() => { resolve('p1') }, 1000);
});

const p2 = new Promise((resolve) => {
    setTimeout(() => { resolve('p2') }, 2000);
});

const e = new Promise((resolve, reject) => {
    reject({
        err: 'err'
    });
});

function test() {
    return Promise.race([p1, e]).then((res) => {
        return res;
    }).catch((err) => {
        return err;
    });
}

console.info(test().then((res) => {
    console.info('test', res);
}));