/**
 * @author Jiawei Tang
 * @email  davidtangjw.pptv.com
 * @create date 2017-09-12
 * @modify date 2017-09-12
 * @desc controller基类
 */

var $ = require('jquery');
var extendBase = require('../utils/extendBase'),
    event = require('../utils/events');

var controllerBase = extendBase.extend(event);

controllerBase.asyncInit = function(fun, context) {
    return function() {
        setTimeout(function() {
            fun.call(context, arguments);
        }, 0);
    }
}

module.exports = controllerBase;