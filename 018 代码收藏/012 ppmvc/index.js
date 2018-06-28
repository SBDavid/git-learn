// ppmvc入口文件

var $ = require('jquery'),
    Events = require('./src/events'),
    Model = require('./src/model'),
    View = require('./src/view'),
    ActionTypes = require('./src/actionTypes'),
    Store = require('./src/store');

var ppmvc = {};

// 版本号
ppmvc.VERSION = '1.0.1';

ppmvc.$ = $;

ppmvc.Events = Events;
ppmvc.Model = Model;
ppmvc.View = View;
ppmvc.ActionTypes = ActionTypes;
ppmvc.Store = Store;

module.exports = ppmvc;
