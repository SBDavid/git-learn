function runAsync1(){
    var def = $.Deferred();
    //做一些异步操作
    setTimeout(function(){
        console.log('执行完成');

        def.resolve('test1');
    }, 500);
    return def.promise();
}

function runAsync2(){
    var def = $.Deferred();
    //做一些异步操作
    setTimeout(function(){
        console.log('执行完成');

        def.resolve('test2');
    }, 500);
    return def.promise();
}

runAsync1()
.done(function(data){
    console.log('done1: ', data);
})
.fail(function(err){
    console.log('err: ', err);
})
.always(function(a){
    console.log('always: ', a);
})
.done(function(data){
    console.log('done2: ', data);
})