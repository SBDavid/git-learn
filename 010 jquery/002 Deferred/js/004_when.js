function runAsync(data){
    var def = $.Deferred();
    //做一些异步操作
    setTimeout(function(){
        def.resolve(data);
    }, 500);
    return def.promise();
}

function runAsync1(data){
    var def = $.Deferred();
    //做一些异步操作
    setTimeout(function(){
        def.reject(data);
    }, 600);
    return def.promise();
}

$.when(runAsync(1), runAsync1(2))
.then(function(data1, data2){
    console.info(data1, data2);
}, function(err1,){
    console.info('err1: ', err1);
})

