var lazyFun = function() {

}

lazyFun.prototype.addEvent = function (elem, type, handler) {
    if (window.addEventListener) {
        console.info('loading fun');
        this.addEvent = function (elem, type, handler) {
            elem.addEventListener(type, handler, false);
        }
    } else if (window.attachEvent) {
        this.addEvent = function (elem, type, handler) {
            elem.attachEvent('on' + type, handler);
        }
    }
    this.addEvent(elem, type, handler);
};

module.exports = lazyFun;