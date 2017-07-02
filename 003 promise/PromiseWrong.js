var wrongPromiseOuter =
    new Promise(function (resolve) {
        // 注意到了吗？这里在一个promise的内部创建了另一个promise
        setTimeout(function () {
            // 这里在promise的回调函数中又增加了一个回调函数 TT
            var wrongPromiseInner = new Promise(function (resolve) {
                setTimeout(function () {
                    resolve('innerResponse');
                }, 1000);
            })
            wrongPromiseInner.then(Response => {
                resolve('outerResponse');
            })
        }, 1000);
    })

wrongPromiseOuter.then(Response => {
    console.log(Response);
})

var rightPromiseOuter =
    new Promise(function (resolve) {
        setTimeout(function () {
            resolve('outerResponse');
        }, 1000);
    });

rightPromiseOuter
.then(Response => {
    console.log(Response);
    return new Promise(function (resolve) {
                setTimeout(function () {
                    resolve('innerResponse');
                }, 1000);
            })
})
.then(Response => {
    console.log(Response);
})    