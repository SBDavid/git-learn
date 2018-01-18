/**
 * @author Jiawei Tang
 * @email  davidtangjw.pptv.com
 * @create date 2017-09-12
 * @modify date 2017-09-12
 * @desc model基类
 */

var extendBase = require('../utils/extendBase');
var events = require('../utils/events');

var modelBase = extendBase.extend({
});

_.extend(modelBase.prototype, events);

module.exports = modelBase;