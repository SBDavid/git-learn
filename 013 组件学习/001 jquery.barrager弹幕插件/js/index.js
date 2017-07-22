window.onload = function () {
    var item = {
        /* img: 'static/heisenberg.png', //图片  */
        info: '弹幕文字信息', //文字 
        href: 'http://www.yaseng.org', //链接 
        close: true, //显示关闭按钮 
        speed: 60, //延迟,单位秒,默认8
        bottom: 0, //距离底部高度,单位px,默认随机 
        color: '#fff', //颜色,默认白色 
        old_ie_color: '#000000', //ie低版兼容色,不能与网页背景相同,默认黑色 
    }
    $('#danmu').barrager(item);

    var span = document.createElement('span');
    console.info('span width: ', span.offsetWidth);
    span.innerText = 'test';
    document.getElementById('danmu').appendChild(span);
    console.info('span width: ', span.offsetWidth);
}