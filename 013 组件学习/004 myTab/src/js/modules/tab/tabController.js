 /* ie8兼容 */
 if(Object.seal) {
    Object.seal = function(obj) {
        return obj;
    }
}

var controllerBase = require('./controllerBase');

var tabController = controllerBase.extend({});

tabController.prototype.init = function(config) {
    this.cfg = $.extend({
        tabSelector: 'tabs',
        tabEvent: 'click',
        tabCurClass: 'cur',
        contentSelector: 'content',
        contentCurClass: 'cur'
    }, config);
}

//实例化
var instance;
module.exports = {
    'getInstance': function () {
        return instance || (instance = new indexController());
    }
};