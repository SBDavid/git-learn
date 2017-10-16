function runAsync(){
    var def = $.Deferred();
    //做一些异步操作
    setTimeout(function(){
        def.resolve(1);
    }, 500);
    return def.promise();
}

function runAsync1(){
    var def = $.Deferred();
    //做一些异步操作
    setTimeout(function(){
        def.resolve(2);
    }, 600);
    return def.promise();
}


runAsync()
.then(function(data){
    console.info(data);
    return runAsync1();
})
.then(function(data){
    console.info(data);
})

