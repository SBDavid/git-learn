// 异步方法，返回Promise
const asyncCall = (num) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(num + 1);
        }, 1000);
    });
}

// 获取迭代器
const getIt = function* (parm){
    // 3. 迭代器执行第一次yield
    console.info('start');
    // 4. 执行asyncCall，获得一个promise
    // 5. 交出执行权
    // 10. 再次得到执行权，res0 = 1
    const res0 = yield asyncCall(parm);
    // 11. 输出res0 = 1
    console.info('res0', res0);
    // 12. 执行asyncCall，获得一个promise
    // 13. 交出执行权
    // 18. 再次得到执行权，res1 = 2
    const res1 = yield asyncCall(res0);
    // 19. 打印结果
    console.info('res1', res1);
    console.info('end');
}

// 1. 创建了迭代器
const it = getIt(0);
// 2. 迭代器运行到第一个yield，暂停执行
// 6. next()获得了执行权，返回了{value: promise, done: false}
const r1 = it.next();
// 7. 等待promise获取结果
r1.value.then((res) => {
    // 8. promise被resolve，res = 1
    // 9. 执行权交还给迭代器，并且向迭代器传入参数1
    // 14. 获得执行权，返回{value: promise, done: false}
    return it.next(res).value;
})
// 15. 等待promise返回结果
.then((res1) => {
    // 16. Promise被resolve，res1 = 2
    // 17. 执行权交还给迭代器，并且向迭代器传入参数2
    it.next(res1);
})