function runAsync(){
    var def = $.Deferred();
    //做一些异步操作
    setTimeout(function(){
        console.log('执行完成');

        def.reject('reject');
    }, 500);
    return def.promise();
}


runAsync()
.done(function(data){
    console.log(data)
})
.fail(function(){
    console.log('执行失败');
});;