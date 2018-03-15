
// https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/

console.log('start');

setTimeout(function () { 
    console.log('setTimeout') 
}, 0); 

async function testAsync(arg) {
    console.info('testAsync', arg);
    return Promise.resolve("hello async" + arg);
}

async function test() {
    console.info('test');
    const v1 = await testAsync(1);
    console.log(v1);
    const v2 = await testAsync(2);
    console.log(v2);
}
test();

new Promise(function (resolve) { 
    console.log(1, 'Promise') 
    for (var i = 0; i < 10000; i++) { 
        i == 9999 && resolve() 
    } 
    console.log(2, 'Promise') 
})
.then(function () {
    console.log(2, 'Promise then') 
}); 

console.log('end');