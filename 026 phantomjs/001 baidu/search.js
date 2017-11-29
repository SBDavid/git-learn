phantom.outputEncoding="gb2312";
function printArgs() {
    var i, ilen;
    for (i = 0, ilen = arguments.length; i < ilen; ++i) {
        console.log("    arguments[" + i + "] = " + JSON.stringify(arguments[i]));
    }
    console.log("");
}

var page = require('webpage').create();

page.viewportSize = {
    width: 800,
    height: 600
};

page.open('http://www.baidu.com', onOpen);

function onOpen(status) {
    // 打开后截图
    console.log("Status: " + status);
    if (status === "success") {
        page.render('001_onopen.png');
    }

    var textInputed = page.evaluate(function () {
        
        // 输入字符
        var searchInput = document.getElementById('kw');
        var evObj = document.createEvent('MouseEvents');
        evObj.initEvent( 'click', true, false );
        searchInput.dispatchEvent(evObj);

        searchInput.setAttribute('value', '搞笑图片')
        return searchInput.value;
    });
    
    setTimeout(function() {
        page.render('002_inputText.png');
        console.log('textInputed', textInputed);

        page.evaluate(function () {
            
            var searchEnter = document.getElementById('su');
            var evObj = document.createEvent('MouseEvents');
            evObj.initEvent( 'click', true, false );
            searchEnter.dispatchEvent(evObj);
        });
    }, 3000);


    setTimeout(function() {
        page.render('003_click.png');
        
        // 点击网页
        var res = page.evaluate(function() {
            var res = document.querySelectorAll('div.c-container');
            for (var i=0; i<res.length; i++) {
                var f13 = res[i].getElementsByClassName('f13');
                if (f13.length === 0) {
                    continue;
                }
                var a = f13[0].getElementsByTagName('a');
                if (a.length === 0) {
                    continue;
                }

                if (a[0].innerText.indexOf('pengfu.com') !== -1) {

                    var link = res[i].querySelector('a.c-img6');
                    var evObj = document.createEvent('MouseEvents');
                    evObj.initEvent( 'click', true, false );
                    link.dispatchEvent(evObj);

                    return decodeURIComponent(link.href);
                }
            }
            return res;
        });
        console.log('search res:', res)
    }, 6000);

    setTimeout(function() {
        page.render('004_gotoTarget.png');
        phantom.exit();
    }, 9000)
}

page.onUrlChanged = function() {
    console.log("page.onUrlChanged");
    printArgs.apply(this, arguments);
};