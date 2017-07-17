function runAsync(){
    var def = $.Deferred();
    //做一些异步操作
    setTimeout(function(){
        console.log('执行完成');
        def.resolve('随便什么数据');
    }, 2000);
    return def;
}
runAsync().then(function(data){
    console.log(data)
});