var $ = require('jquery');

module.exports = {
    /**
    * @method 获取播放列表信息
    **/ 
    getList: function(ids, episode) {
        return $.ppXHR.JSONP({
            url: 'http://api2.v.pptv.com/api/openapi/channel.js',
            type: 'GET',
            jsonp: 'cb',
            data: {
                id: ids.join(','),
                episode: episode || 10
            }
        });
    }
}