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
            console.info('beforeSend')
            jqXHR.urlKey = settings.url;

            // 如果指定了jsonpCallback
            if (settings['jsonpCallback'] != undefined && settings['url'] != undefined) {
                // 如果url从未出现过，则直接写入cbObj
                if (!self.cbObj[settings.url]) {
                    self.cbObj[settings.url] = {
                        cb: settings['jsonpCallback'] + (++self.cbCount),
                        completed: false
                    };
                    settings['jsonpCallback'] = self.cbObj[settings.url].cb;
                } 
                // 如果url已经出现过，则判断之前的req是否完成，
                // 如果已经完成则直接发送req,
                // 如果未完成则推入jsonpReqQueue，等待上一个req完成后再发送
                else {
                    var previousReq = self.cbObj[settings.url];
                    if (previousReq.completed) {
                        settings['jsonpCallback'] = previousReq.cb;
                        previousReq.completed = false;
                    } else {
                        var queue = self.jsonpReqQueue[settings.url] ? self.jsonpReqQueue[settings.url] : self.jsonpReqQueue[settings.url] = [];
                        queue.push(settings);
                        // 终止当前请求
                        console.info('发现并发性的jsonp请求', settings);
                        return false;
                    }
                }
            } 
            // 如果没有指定jsonpCallback，则使用随机数
            else {
                settings['jsonpCallback'] = 'callback' + Math.floor(Math.random() * 100).toString();
            }
        },
        complete: function(jqXHR, textStatus) {
            console.info('complete', textStatus)
            var urlKey = jqXHR.urlKey;
            self.cbObj[urlKey].completed = true;
            // 如果queue中有等待的请求，则取出一个并发送。
            if (self.jsonpReqQueue[urlKey].length > 0) {
                var reqSetting = self.jsonpReqQueue[urlKey].shift();
                self.JSONP(reqSetting);
            }
        }
    }
    this.cbCount = 0;
}
JqXHR.prototype.AJAX = function(options) {
    return jQuery.ajax(options);
}
JqXHR.prototype.JSONP = function(options) {
    var opt = {};
    if (!options.orignalOption) {
        opt = jQuery.extend({}, this.jsonpOptions, options);
        opt.orignalOption = options;
    } else {
        opt = options.orignalOption;
        opt = jQuery.extend({}, this.jsonpOptions, opt);
    }
    return jQuery.ajax(opt);
}

var myXHR = new JqXHR();

function test() {
     myXHR.JSONP({
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
    }).
    then(function(res) {

        console.info('then', arguments, this)
    })
}

test();
test();

console.info('test complete')
