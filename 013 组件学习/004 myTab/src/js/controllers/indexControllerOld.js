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
var controllerBase = require('./controllerBase'),
    playlistModel = require('../models/playlistModel'),
    playlistComp = require('../components/playlistComp'),
    ipBlock = require('../utils/ipBlock');

var indexController = controllerBase.extend({});

indexController.prototype.init = function (options) {
    // 调用父类同名方法
    indexController.__super__.init(options);
    indexController.asyncInit(this.ipBlock, this)();
    indexController.asyncInit(this.playlistInit, this)();
}

// ipblock
indexController.prototype.ipBlock = function() {
    var iptable = webcfg.iptable;
    ipBlock(iptable.ipList, iptable.blockUrl, 'white');
}

// 播放器初始化
indexController.prototype.playlistInit = function () {
    var self = this;
    this.playlistM = new playlistModel();
    this.playlistC = new playlistComp();
    this.playlistM.on('loaded', function(event) {
        self.playlistC.render(event);
    });
    this.playlistM.on('nextVideo', function(e) {
        console.info(e);
        self.playlistC.play(e.index, e.cid);
    });
    this.playlistM.init();
    this.playlistC.init('.program');
    this.playlistC.on('play', function(e) {
        self.playlistM.play(e.index, e.id)
    });
}

//实例化
var instance;
module.exports = {
    'getInstance': function () {
        return instance || (instance = new indexController());
    }
};