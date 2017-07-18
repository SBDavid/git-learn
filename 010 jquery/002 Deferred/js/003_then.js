function runAsync1(data){
    var def = $.Deferred();
    //做一些异步操作
    setTimeout(function(){
        def.resolve('test1');
    }, 500);
    return def.promise();
}

runAsync1('run1')
.then(function(res){
    console.info('resolve: ', res);
}, function(err){
    console.info('reject: ', err);
})
.always([function() {
    console.info('always: 1');
}, function() {
    console.info('always: 2');
}])

