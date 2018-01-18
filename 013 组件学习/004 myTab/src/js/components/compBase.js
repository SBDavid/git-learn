/**
 * @author Jiawei Tang
 * @email  davidtangjw.pptv.com
 * @create date 2017-09-12
 * @modify date 2017-09-12
 * @desc component基类
 */

var extendBase = require('../utils/extendBase');
var events = require('../utils/events');

var compBase = extendBase.extend({
});

_.extend(compBase.prototype, events);

module.exports = compBase;