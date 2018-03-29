var JqXHR = function() {
    var self = this;
    // 存储jsonpCallBack
    this.cbObj = {};
    // 存储阻塞的jsonp请求
    this.jsonpReqQueue = {};
    this.jsonpOptions = {
        type: 'GET',
        dataType: 'jsonp',
        cache: true,
        jsonp: 'cb',
        beforeSend: function(jqXHR, settings ) {
        },
        complete: function(jqXHR, textStatus) {
            
        }
    }
    this.cbCount = 0;
}
JqXHR.prototype.AJAX = function(options) {
    return jQuery.ajax(options);
}
JqXHR.prototype.JSONP = function(options) {
    var jsonkey = JSON.stringify(options);
    console.info(jsonkey);
}

var test = new JqXHR();

test.JSONP({
    url: '//api.v.pptv.com/api/pg_recommend',
    data: {
        from: 'web',
        version: 1,
        format: 'jsonp',
        appplt: 'ik',
        appid: 'pptv.web',
        src: '71', //客户端63 网站71
        appver: '1',
        num: '18',
        ppi: 12344,
        userLevel: '0',
        vipUser: '0',
        uid: 123123123,
        extraFields: 'all'
    },
    dataType: 'jsonp',
    jsonp: 'cb',
    jsonpCallback: 'pgrecommend'
})