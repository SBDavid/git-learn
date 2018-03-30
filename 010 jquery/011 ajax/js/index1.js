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
            console.info('beforeSend', settings);
            jqXHR.id = settings.id;
            jqXHR.jsonpkey = settings.jsonpkey;
            // 如果指定了jsonpCallback
            if (settings['jsonpCallback'] != undefined && settings['url'] != undefined) {
                // 如果url从未出现过，则直接写入cbObj
                if (!self.cbObj[settings.jsonpkey]) {
                    self.cbObj[settings.jsonpkey] = {
                        cb: settings['jsonpCallback'] + (++self.cbCount),
                        completed: false
                    };
                    settings['jsonpCallback'] = self.cbObj[settings.jsonpkey].cb;
                }
                // 如果url已经出现过，则判断之前的req是否完成，
                // 如果已经完成则直接发送req,
                // 如果未完成则取消发送
                else {
                    var previousReq = self.cbObj[settings.jsonpkey];
                    if (previousReq.completed) {
                        settings['jsonpCallback'] = previousReq.cb;
                        previousReq.completed = false;
                    } else {
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
            console.info('complete', textStatus, jqXHR);
            // this.cbObj标记为完成状态
            self.cbObj[jqXHR.jsonpkey].completed = true;
            // 触发dfd.then error
            var jsonpReq = self.jsonpReqQueue[jqXHR.jsonpkey].shift();
            jqXHR.then(function(){
                jsonpReq.dfd.resolveWith(this, arguments);
            }).catch(function() {
                jsonpReq.dfd.rejectWith(this, arguments);
            });
            // 如果队列里有排队的请求，测取出一个进行发送
            if (self.jsonpReqQueue[jqXHR.jsonpkey].length > 0) {
                var nextReq = self.jsonpReqQueue[jqXHR.jsonpkey][0];
                self.cleanJsonpQueue(nextReq.options);
            }
        }
    }
    this.cbCount = 0;
    this.idCount = 0;
}
JqXHR.prototype.AJAX = function(options) {
    return jQuery.ajax(options);
}

JqXHR.prototype.cleanJsonpQueue = function(options) {
    var settings = $.extend({}, this.jsonpOptions, options);
    $.ajax(settings);
}

JqXHR.prototype.JSONP = function(options) {
    var jsonpkey = md5(JSON.stringify(options));
    var dfd = $.Deferred();
    var id = this.idCount++;
    var completed = false;

    options.id = id;
    options.jsonpkey = jsonpkey;

    var queue = this.jsonpReqQueue[jsonpkey] ? this.jsonpReqQueue[jsonpkey] : this.jsonpReqQueue[jsonpkey] = [];
    queue.push({
        dfd: dfd,
        options: options
    });

    var settings = $.extend({}, this.jsonpOptions, options);
    $.ajax(settings);

    return dfd;
}

var test = new JqXHR();

function send(name, src, jsonpCallback) {
    test.JSONP({
        url: '//api.v.pptv.com/api/pg_recommend',
        data: {
            from: 'web',
            version: 1,
            format: 'jsonp',
            appplt: 'ik',
            appid: 'pptv.web',
            src: src, //客户端63 网站71
            appver: '1',
            num: '18',
            ppi: 12344,
            userLevel: '0',
            vipUser: '0',
            uid: 123123123,
            extraFields: 'all'
        },
        cache: true,
        dataType: 'jsonp',
        jsonp: 'cb',
        jsonpCallback: jsonpCallback,
        success: function() {
    
        }
    })
    .then(function() {
        console.info(name+ 'outter then', arguments);
    })
    .catch(function() {
        console.info(name +'outter catch', arguments);
    })
}

send(1, '63', 'pgrecommend');
send(2, '63', 'pgrecommend');