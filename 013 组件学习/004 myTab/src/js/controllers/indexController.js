/**
 * @author Jiawei Tang
 * @email  davidtangjw.pptv.com
 * @create date 2017-09-12
 * @modify date 2017-09-12
 * @desc 聚合页controller
 */

 /* ie8兼容 */
if(Object.seal) {
    Object.seal = function(obj) {
        return obj;
    }
}

var $ = require('jquery');
var controllerBase = require('./controllerBase');

var indexController = controllerBase.extend({});

indexController.prototype.init = function (options) {
    
}


//实例化
var instance;
module.exports = {
    'getInstance': function () {
        return instance || (instance = new indexController());
    }
};