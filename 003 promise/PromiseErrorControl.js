/*var promiseStart = new Promise(function(resolve, reject){
    reject('promise is rejected');
});

promiseStart
.then(function(response) {
    console.log('resolved');
    return new Promise(function(resolve, reject){
        resolve('promise is resolved');
    });
},function (error){
    console.log('rejected:', error);
    // 如果这里不抛出error，这个error将被吞掉，catch无法捕获异常
    // 但是如果抛出error，这个error会被下一个then的reject回调处理，这不是我们想要的
    throw(error); 
})
.then(function (response){
    console.log('resolved:', response);
},function (error){
    console.log('rejected:', error);
    throw(error);
})
.catch(function(error) {
    console.log('catched:', error);
})*/

/* 
 输出：
 rejected: promise is rejected
 rejected: promise is rejected
 catched: promise is rejected
 */

var promiseStart = new Promise(function(resolve, reject){
    reject('promise is rejected');
});

promiseStart
.then(function(response) {
    console.log('resolved');
    return new Promise(function(resolve, reject){
        resolve('promise is resolved');
    });
})
.then(function (response){
    console.log('resolved:', response);
})
.catch(function(error) {
    console.log('catched:', error);
})

/* 
 输出：
 catched: promise is rejected
 */