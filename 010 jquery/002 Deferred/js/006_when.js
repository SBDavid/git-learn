var dtd = $.Deferred(); // 新建一个deferred对象
　　var wait = function (dtd) {
    var tasks = function () {
        alert("执行完毕！");
        dtd.resolve(); // 改变deferred对象的执行状态
    };
    setTimeout(tasks, 5000);
    return dtd;
　　};

$.when(wait(dtd))
    .done(function () { alert("哈哈，成功了！"); })
    .fail(function () { alert("出错啦！"); });