var compBase = require('./compBase');

var playListTemp = require("./playList");
var scrollBar = require('../utils/scrollernew');

var playlistComp = compBase.extend({
});

/**
 * 初始化右侧栏
 */
playlistComp.prototype.init = function(rootSelector) {
    this.root = $(rootSelector).eq(0);
}

/**
 * 渲染右侧栏
 */
playlistComp.prototype.render = function(playList) {
    var innerHTML = playListTemp({
        data:playList
    });

    $(this.root).html(innerHTML);
    this.initEvent();
}

/**
 * 右侧栏
 */
playlistComp.prototype.initEvent = function() {
    var self= this;
    // 面板的展开和收起
    $(this.root).on('click', '.play-list-item', function(event) {
        if (!$(event.currentTarget).hasClass('active')) {
            $(self.root).find('.play-list-item.active').removeClass('active');
            $(event.currentTarget).addClass('active');

            $(self.root).find('.pp-scroller').remove();

            $(self.root).find('.plist1').ppScrollernew({
                maxHeight: 368
            }).scroll();
        }
    });
    // 加载a标签激活态
    $(this.root).on('click', '.play-list-item a', function(event) {
        if (!$(event.currentTarget).hasClass('active')) {
            $(event.currentTarget)
                .parents('.plist1')
                .find('a.active')
                .removeClass('active');
            $(this).addClass('active');
            // 播放视屏
            self.trigger('play', { index: $(event.currentTarget).parents('.play-list-item')[0].dataset.index, 
                id: event.currentTarget.dataset.id});
            $(self.root).find('.pro-title').text(event.currentTarget.dataset.title);
        }
    });
    //
    $(this.root).find('.plist1').ppScrollernew({
        maxHeight: 368
    }).scroll();
}

playlistComp.prototype.play = function(index, cid) {
    $(this.root).find('.play-list-item.active a.active').removeClass('active');
    $(this.root).find('.play-list-item.active').removeClass('active');
    $(this.root).find('.play-list-item')
    .eq(index)
    .addClass('active');
    $(this.root).find('.play-list-item')
    .eq(index)
    .find('a[data-id=\'' + cid + '\']')
    .addClass('active');
}

module.exports = playlistComp;