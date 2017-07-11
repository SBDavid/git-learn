var EventUtil = {
    addHandler: function(element,type,handler) {
        if(element.addEventListener) {
            element.addEventListener(type,handler,false);
        }else if(element.attachEvent) {
            element.attachEvent("on"+type,handler);
        }else {
            element["on" +type] = handler;
        }
    },
    removeHandler: function(element,type,handler){
        if(element.removeEventListener) {
            element.removeEventListener(type,handler,false);
        }else if(element.detachEvent) {
            element.detachEvent("on"+type,handler);
        }else {
            element["on" +type] = null;
        }
    }
};

window.onload = function () {
    var btn = document.getElementById('btn');
    EventUtil.addHandler(btn, 'click', function() {
        console.info('click: ', (new Date()).getTime());
    });

    EventUtil.addHandler(btn, 'touchstart', function(e) {
        console.info('touchstart: ', (new Date()).getTime());
        e.preventDefault();
    });
}