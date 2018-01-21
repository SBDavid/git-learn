/**
 * @author Jiawei Tang
 * @email  davidtangjw.pptv.com
 * @create date 2017-09-15
 * @modify date 2017-09-15
 * @desc 播放列表
 */

var modelbase = require('./modelBase');
var playListApi = require('../api/playlist').getList;

var playlistModel = modelbase.extend({
});

function playListFormat(item, index) {
    var itemFormated = {};
    itemFormated.title = item.titleen;
    itemFormated.id = item.id;
    itemFormated.surface = item.picture;
    if (item.episodes !== undefined) {
        itemFormated.episodes = item.episodes;
        $.each(itemFormated.episodes, function(index, item){
            item.episodeTitle = index + 1;
        });
    }
    // 首个默认是打开状态
    if (index === 0) {
        itemFormated.active = true;
    }
    return itemFormated;
}

playlistModel.prototype.init = function() {
    var self = this;
    // 获取cid
    this.playlist = playlist.list;
    // 获取播放列表信息
    playListApi(this.playlist)
    .then(function(data){
        if (data.err === 0) {
            self.playlist.formatList = $.map($.grep(data.data, function(item){return item !== null}), playListFormat);
            self.playlist.formatList.title = self.playlist.formatList[0].title;
            self.trigger('loaded', self.playlist.formatList);
        }
    }, function(error) {
        console.log(error);
    });
    // 连续播放
    player.onRegister('nextvideo', function () {
        var episodes = self.playlist.formatList[self.currentVideo.index].episodes;
        if (episodes === undefined) {
            return;
        } 
        // 点击首个大图
        else if (self.playlist.formatList[self.currentVideo.index].id === self.currentVideo.cid){
            self.play(self.currentVideo.index, episodes[0].id);
            self.trigger('nextVideo', self.currentVideo);
        }
        // 点击列表
        else {
            var index = $.inArray(self.currentVideo.cid, $.map(episodes, function(item){ return item.id+'' }));
            if (index === -1 || index === episodes.lengtn - 1) {
                return;
            }
            self.play(self.currentVideo.index, episodes[index+1].id);
            self.trigger('nextVideo', self.currentVideo);
        }
    })
}

playlistModel.prototype.play = function(index, cid) {
    this.currentVideo = {index: index, cid: cid+''};
    player.playVideo({cid: cid+''});
}

module.exports = playlistModel;