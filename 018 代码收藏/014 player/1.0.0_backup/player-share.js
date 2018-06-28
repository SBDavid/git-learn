/**
 * require -> jquery
 * returns FlashPlayer and H5Player
 *
 * 调用方法及API设计
 *
 * var playConfig = {
 *     id : 17121456,
 *     title : "xxx",
 *     videoSrc : "xxx.m3u8",
 *     duration : "30 * 60",
 *     ctx : "o=0",
 *     autoplay : 1,
 *     poster : "http://static9.pplive.cn/pptv/index/v_201202141528/images/no.gif",
 *     playerConfig : {
 *         poster : "xxx.jpg",
 *         maxduration : 65 * 1000, //广告异常处理
 *         src : "http://data.vod.itc.cn/?new=/195/40/kxB84eClxBjoQp1KnvFCG6.mp4&ch=v&cateCode=112;112101;112103&plat=17&mkey=scetvfPX4Od5gejRRSdg5aDT7AB2K482",
 *     },
 *     skin : {
 *         captionBar : true,
 *         controlBar : true
 *     },
 *     adConfig : {
 *         xxx...
 *     }
 * }
 *
 * var h5Player = new ppliveplayer.H5Player({
 *     id : 17121456
 * });
 * h5Player.init(); -> 调用广告播放器
 * h5Player.goToPlay(); -> 广告结束调用播放
 * h5Player.play();
 * h5Player.pause();
 * h5Player.stop();
 *
 *
 * 广告播放器调用方式1：
 * var AdplayConfig = {
 *     plt : 'web',
 *     pos : '1',
 *     chid : '',
 *     clid : '',
 *     sid : '',
 *     vlen : '',
 *     vvid : '',
 *     ctx : '',
 * }
 * player.init(playerObject);
 * player.playerControl.startPlayer(AdplayConfig, playbox);
 *
 * 广告播放器调用方式2：
 * SRC http://player.as.pptv.com/html5/player.html#
 * IFRAME 方式 http://player.as.pptv.com/html5/player.html#plat=clt&pos=1&vvid=57cfb5be-a122-4925-a562-ce17e5333453&chid=&clid=&sid=&vlen=3000&o=&ctx=x423&pageUrl=http%3A%2F%2Fclouds.pptv.com%2Fbaidu%2Fdemo%2Fplayer%2Fplaybox%2F&api=ppliveplayer.h5player
 *
 */

try{
    document.domain = 'pptv.com';
}catch(e){}

if(!this.jQuery){
    alert('Requires jQuery!');
}

jQuery(function(){

;(function(global, undefined){

    if(!global.ppliveplayer){
        global.ppliveplayer = {};
    }

    var ParentProxy = { _proxy : function(){} };
    // var whitelist = window.whitelist || [];
    var listNoads = window.adConfig || ['clouds.test.com', 'sale.suning.com', 'm.ijiasu.com', 'www.coca-cola.com.cn'];
    var encode = encodeURIComponent,
        decode = decodeURIComponent,
        DomBody = $('body'),
        videoHeaderH,
        videoControlH,
        maxpercentage,
        isDebug = window.location.href.indexOf('debug=1') > 0 ? true : false
    ;

    // if(isDebug){
    //     var stri = null;
    //     try{
    //         var location = top.window.location.href.split('?')[0];
    //         stri = location.match(/(.*\/)(.*)/)[2].replace(/\./,'-'); // + '-' + parseInt(Math.random()*100 + 1, 10) ;
    //     }catch(e){}
    //     new Image().src = "http://clouds.pptv.com/wwwroot/server/set.php?filename=" + stri + '&agent=' + encode(navigator.userAgent.replace(/[\/\+\*@\(\)\,]/g, ""));
    // }

    function throttle(method, context) {
        clearTimeout(method.tId);
        method.tId = setTimeout(function() {
            method.call(context);
        }, 150);
    }

    function log(o){
        if(isDebug){
            var s = '', args = [].slice.call(arguments);
            try {
                for(var i = 0, l = args.length; i < l; i++) {
                    if(isObj(args[i])){
                        s += objectToQuery(args[i]) + ' | ';
                    }else{
                        s += args[i] + ' | ';
                    }
                }
                console.log(args);
                //new Image().src = "http://clouds.pptv.com/wwwroot/server/get.php?log=" + s;
            } catch(e) {}
        }
    }

    function isObj(v){
        return Object.prototype.toString.call(v) === '[object Object]';
    }

    function queryToObject(str){
        if(!str || str === '') return {};
        var o = {},list = str.split('&'),i=0,item;
        while(list[i]){
            item = list[i].split('=');
            o[item[0]] = item[1];
            i++;
        }
        return o;
    }

    function objectToQuery(o){
        var set = [];
        for(var i in o){
            if(isObj(o[i])){
                set.push(i+'=' + encode(objectToQuery(o[i])) + '');
            }else{
                set.push(i+'='+encode(o[i]));
            }
        }
        return set.join('&');
    }

    function timeFormat(seconds){
        var m = Math.floor(seconds/60)<10 ? "0"+Math.floor(seconds/60) : Math.floor(seconds/60);
        var s = Math.floor(seconds-(m*60))<10 ? "0"+Math.floor(seconds-(m*60)) : Math.floor(seconds-(m*60));
        return m+":"+s;
    }

    function generateVVID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x7|0x8)).toString(16);
        });
        return uuid;
    }

    function loadAppleType() {
        var agent = global.navigator.userAgent;
        var node = /(iPhone|iPad|iPod)/i.exec(agent);
        switch(node?node[0].toLowerCase():'ipad'){
            case 'ipad' :
                return 'm3u8.web.pad';
            case 'iphone' :
                return 'm3u8.web.phone';
            case 'ipod' :
                return 'm3u8.web.pod';
            //default :
        }
    }

    function getSwfObject(){
        return document[id] ? document[id] : window[id] ? (window[id][0] || window[id]) : document.getElementById(id);
    }

    function getCookie(name) {
        var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
        if(arr !== null) return decode(arr[2]); return null;
    }

    var Cookie = {
        set: function (name, value, expires) {
            var text = encodeURIComponent(value), MILLISECONDS_OF_DAY = 24 * 60 * 60 * 1000;
            if(typeof expires === 'number'){
                var date = expires;
                date = new Date();
                date.setTime(date.getTime() + expires * MILLISECONDS_OF_DAY);
                if(expires){ text += '; expires=' + date.toUTCString(); }
            }
            document.cookie = name + '=' + text;
        },
        get: function (name) {
            var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
            if(arr !== null) return decodeURIComponent(arr[2]); return null;
        }
    };


    /**
     * Html5 Player
     * @param {[type]} opts  [配置参数]
     * @param {[type]} plbox [DOM - 播放器ID]
     */
    function H5Player(opts, plbox){
        var self = this; this.vvid = generateVVID();
        this.islumia = navigator.userAgent.match(/Windows Phone/i); //lumia不支持ts
        var PLAYER_CONFIG = {
            //id : "454", //必填 - 视频播放ID
            //title : "xxx", //视频标题
            //videoSrc : "", //视频播放地址
            //duration : '', //视频时长
            videoType : '', //1-vod | 10-live | 20-live回看
            ctx : "o=0", //可选
            //autoplay : 0,  //可选 - 是否自动播放，默认自动播放
            poster : "http://s1.pplive.cn/v/cap/"+ opts.id +"/w640.jpg?v01",
            skin : {
                canResize : true,
                captionBar : true,
                controlBar : true
            },
            adConfig : {
                plat : "ik", //平台 | ikan 传ik | mpptv 传mbs
                pos : 1, //广告位
                vvid : this.vvid, //视频曝光id
                chid : "", //频道id -> 合集或剧集id
                clid : "", //分类id
                sid : "", //单集id -> 频道id
                vlen : "", //播放时长
                //slen : "", //上次广告播放完毕到现在的观看视频时长
                //o : "", //渠道   可以不传
                ctx : "", //拓展参数 可以不传
                //ctype : "", //请求策略渠道标识 可以不传
                pageUrl : "" //页面地址

                //预览相关参数 都可以不传
                //cs = 0;
                //duration = 0;
                //url = '';
            }
        };

        this.playerbox = $('#' + plbox);
        $.extend(true, this, PLAYER_CONFIG, opts);
        this.pageUrl = decode(this.pageUrl) || window.location.href.split('#')[0];
        this.pageRefer = decode(this.pageRefer) || document.referrer;
        this.adConfig.ctx = this.ctx;
        this.CTX = queryToObject(this.ctx) || {};
        this.adConfig.sid = this.id;
        this.adConfig.api = this.api;
        this.adConfig.pageUrl = this.pageUrl;
        this.hasStoped = false;
        this.isMpptv = this.pageUrl.indexOf('m.pptv.com') > -1 ? true : false;
        if(this.isMpptv){
            this.adConfig.plat = 'mbs';
        }
        if(!this.id || !this.playerbox.length){
            return;
        }

        try{
            this.pageDomain = this.pageUrl.toLowerCase().match(/\:\/\/([0-9a-z\-\_\.{}]+).*/i)[1] || '';
        }catch(e){}

        this.init();
    }

    H5Player.prototype = {
        constructor: H5Player,
        //delayTime : 65 * 1000,
        init : function(){
            var self = this;
            //获取pptv相关参数
            try{
                this.key = this.CTX.kk || '';
                // this.limitForPlay = true; //是否限制10分钟播放
                //this.segment = this.CTX.segment; //去掉segment
                this.loadType =  this.isMpptv ? (this.islumia ? 'mpptv.wp' : 'mpptv') : loadAppleType();
                this.guid = Cookie.get('PUID');
                this.PPName = function(){
                    var uid = Cookie.get('PPName') || '';
                    if(uid){
                        return uid.split('$')[0];
                    }
                    return uid;
                }();
                this.UDI = Cookie.get('UDI');
                this.isvip = this.UDI && this.UDI.split('$')[17] || 0;

                //渠道策略 - 绕过播放限制
                // for(var i = 0, len = whitelist.length; i < len; i++){
                //     if(this.CTX.o && whitelist[i] && whitelist[i] == this.CTX.o){
                //         this.limitForPlay = null;
                //     }
                // }

            }catch(e){}
            this.create();

            try{
                ParentProxy = parent && parent.ppliveplayer;
                //proxy. 获取当前播放时间
                ParentProxy._proxy('getPlayTime', function(){
                    return parseInt(self.playTime, 10) || 0;
                });
            }catch(e){ log('Same-origin policy error!'); }

            // $(window).on('resize', function(){
            //     throttle(ResizePlayer);
            // });
            // function ResizePlayer(){
            //     self.resize();
            // }
        },
        makeHTML : function(){
            //this.resize();
            var htmlStr = [
                //'<div class="tip"><p>本视频提供10分钟预览</p><a href="###" title="" class="viewall">点击观看完整版</a><a href="###" title="" class="close">&times;</a></div>',
                //'<div class="tip tip2"><img src="http://static9.pplive.cn/mobile/v_1/css/logo3.png" alt="" /><dl><dt>使用PPTV客户端</dt><dd>看视频更高清更流畅</dd></dl><a href="###" title="" class="viewall">用客户端观看</a><a href="###" title="" class="close">&times;</a></div>',
                '<div class="p-video-tip3"><p>预览结束<br />请下载PPTV客户端观看完整版</p><div class="btns"><a href="javascript:void(0);" title="">观看完整版</a><a href="javascript:void(0);" title="" class="know">我知道了</a></div></div>',
                '<div class="p-video-vastad"></div><div class="p-video">',
                    '<video class="p-video-player" width="', this.w ,'" height="', this.h ,'" preload="none" webkit-playsinline>您的浏览器不支持HTML5，无法观看我们提供的视频！建议使用高版本浏览器观看，谢谢！</video>',
                    '<div class="p-video-poster"><img src="', this.poster ,'" alt="" /></div>',
                    '<div class="p-video-loading"></div>',
                    '<div class="p-video-button go">',
                        '<div class="btn"></div>',
                    '</div>',
                '</div>',
                '<div class="caption">{title}</div>',
                '<div class="dashboard"><div class="control">',
                    '<div class="progress">',
                        '<div class="bufferBar"></div>',
                        '<div class="timeBar"><div class="seekhander"></div></div>',
                    '</div>',
                    '<div class="status">',
                        '<div class="p-playPause-button p-go"></div>',
                        '<div class="time">',
                            '<span class="current">--</span>/<span class="total">--</span>',
                        '</div>',
                        '<div class="zoom"></div>',
                    '</div>',
                '</div></div>'
            ].join('');
            return htmlStr;
        },
        create : function(){
            var self = this, playbox = this.playerbox;
            var noAdFlag = false;

            if(this.player) return;
            this.logService = this.logService();

            this.playerbox.html(this.makeHTML());
            this.video = this.playerbox.find('video');
            if(!this.video.length) return;
            this.player = this.video[0];
            this.player.removeAttribute("controls");
            if(Number(this.autoplay) !== 0){
                this.player.setAttribute('autoplay', 'autoplay');
            }

            this.vastAdBox = this.playerbox.find('.p-video-vastad');
            if(!this.skin.captionBar){
                this.playerbox.find('.caption').remove();
            }
            if(!this.skin.controlBar){
                this.playerbox.find('.control').remove();
            }

            this.UI = {
                playTips : playbox.find('.p-video-tip3'),
                playUIPoster : playbox.find('.p-video-poster'),
                playUILoading : playbox.find('.p-video-loading'),
                playUIButton : playbox.find('.p-video-button'),
                playUIPlayButton : playbox.find('.p-playPause-button'),
                playUIHeader : playbox.find('.caption'),
                playUIControl : playbox.find('.control'),
                playUIZoom : playbox.find('.control .zoom'),
                playUICurrentTime : playbox.find('.control .current'),
                playUITotalTime : playbox.find('.control .total'),
                playUIProsser : playbox.find('.control .progress'),
                playUIBufferBar : playbox.find('.control .bufferBar'),
                playUITimBar : playbox.find('.control .timeBar'),
                playUIBar : playbox.find('.control .seekhander')
            };

            videoHeaderH = this.UI.playUIHeader.outerHeight();
            videoControlH = this.UI.playUIControl.outerHeight() + (this.UI.playUIBar.outerHeight() / 2) + 2;
            maxpercentage = 100 * (1 - (this.UI.playUIBar.outerWidth() / this.UI.playUIControl.outerWidth()));

            this.loadIpadStr(this.id, function(config){
                $.extend(self, config);
                self.adConfig.vlen = self.duration;
                log('AD CONFIG >> <font color=red> src </font> ', self.adConfig);
                self.UI.playUIHeader.text(config.title);
                for(var i = 0, l = listNoads.length; i < l; i++){
                    if(self.CTX.o == listNoads[i]){
                        noAdFlag = true;
                    }
                }
                try{
                    if(noAdFlag || self.PPName && self.UDI && Number(self.isvip)){
                        self.goToPlay(10); //PPTV会员登录
                        log('PPTV登录会员，跳过广告!', noAdFlag, self.CTX.o);
                    }else{
                        self.createAdIframe('http://player.as.pptv.com/html5/player.html#');
                    }
                }catch(e){
                    log('Error >> ', e);
                    self.goToPlay("adplayer error.");
                }
            });
        },
        goToPlay : function(status, videoSrc){
            /**
             * status :
             *     -1(没有广告)，
             *     -2(有广告，但一个都没有播放)
             *     0(所有广告都正常播放完成) - 在暂停广告时也表示手动关闭广告
             *     1(有部分广告没有播放出来)
             *     10(登录会员跳广告)
             *     11(广告iframe加载出错)
             */
            log("Create Player... ", status, this.videoSrc,  videoSrc);
            this.vastAdBox.remove();
            this.video.show();
            if(this.hasInited){ return; }
            this.playTime = 0;
            this.playCode = status;
            this.logService.ikanPageView();
            this.logService.ikanPlayBfr();
            //this.PreVideoInfo = this.logService.getPrevCookie();

            this.player.src = videoSrc || this.videoSrc;
            this.hasInited = true;
            this.player.load();
            this.bindEvent();
        },
        bindEvent : function(){
            var self = this,
                video = this.video,
                setBfrInterval = null,
                maxduration = this.duration
            ;

            self.UI.playUICurrentTime.text(timeFormat(0));
            self.UI.playUITotalTime.text(timeFormat(maxduration));

            //以下函数用于计算加载延时，记录流入bip ikan表中
            video.on('loadedmetadata', function() {
                self.vds = +new Date();
                //self.UI.playUILoading.hide();
                //self.UI.playUIButton.show();
                setTimeout(startBuffer, 150);

                // if(self.videoType != 10 && self.PreVideoInfo && self.PreVideoInfo.cid == self.id && self.PreVideoInfo.vt){
                //     try{self.player.currentTime = self.PreVideoInfo.vt / 1000;}catch(e){}
                //     log('<font color=red>go to the last play time...</font>', self.PreVideoInfo.vt / 1000);
                // }

                self.playerbox.on('touchstart', function(e) {
                    hoverState();
                });

                if(self.videoType == 10){
                    self.UI.playUIControl.find('.time').html('--/--');
                    return;
                } //直播

                self.UI.playUIProsser[0].addEventListener('click', function(e){
                    e.preventDefault();
                    updatebar(e.clientX);
                    self.play();
                }, false);

                self.UI.playUIBar[0].addEventListener('touchstart', function(e){
                    e.preventDefault();
                    if(e.targetTouches.length == 1){
                        var touch = e.targetTouches[0];
                        self.pause();
                        self.isTouching = true;
                        self.startX = touch.clientX;
                    }
                }, false);

                self.UI.playUIBar[0].addEventListener('touchmove', function(e){
                    e.preventDefault();
                    if(self.isTouching && e.targetTouches.length == 1){
                        var touch = e.targetTouches[0];
                        self.currentX = touch.clientX;
                        updatebar(touch.clientX);
                    }
                }, false);

                self.UI.playUIBar[0].addEventListener('touchend', function(e){
                    e.preventDefault();
                    self.startX = self.currentX;
                    self.isTouching = false;
                    self.play();
                }, false);
            });

            video.on('timeupdate', function() {
                var currentPos = self.player.currentTime;
                var perc = 100 * currentPos / maxduration;
                self.UI.playUILoading.hide();
                self.playTime = currentPos;
                if(currentPos >= 0.8){ self.UI.playUIPoster.hide(); }

                sendPostMessage(currentPos);
                //complete=1，表示该节目不是被截取节目，属于完整视频，播放结束不提示任何弹窗
                //complete=0，表示该节目是被截取节目，播放完成时提示“预览结束，请下载PPTV客户端观看完整版”
                // log('complete ==> ', self.CTX.complete, self.limitForPlay, currentPos);
                // if(self.videoType == 1 && self.CTX.complete === '0' && self.limitForPlay && currentPos >= 5 * 60){
                //     self.stop();
                //     log('segment stop...', currentPos);
                //     self.UI.playTips.show();
                // }
                if(perc >= maxpercentage){ perc = maxpercentage;}
                log('timeupdate ==> ', perc, maxpercentage, timeFormat(currentPos), currentPos);
                self.UI.playUITimBar.css('width',perc+'%');
                self.UI.playUICurrentTime.text(timeFormat(currentPos));
            });

            video.on('pause', function(){
                //self.UI.playUIButton.show();
                self.UI.playUIPlayButton.removeClass('p-pause').addClass('p-go');
            });

            video.on('seeking waiting', function(){
                self.UI.playUILoading.show();
            });

            video.on('playing', function(){
                self.UI.playUIPlayButton.removeClass('p-go').addClass('p-pause');
            });

            video.on('canplay', function() {
                self.vde = +new Date();
                if(!self.hasSent){
                    self.hasSent = true;
                    self.logService.ikanStartDelay();
                    self.logService.mobileAction('pds');
                }
                if(setBfrInterval) clearInterval(setBfrInterval);
                setBfrInterval = setInterval(function(){
                    self.logService.ikanCookie();
                }, 5 * 1000);
            });

            //video.on('click', playVideo);
            self.UI.playUIButton.on('click', playVideo);
        
            self.UI.playUIPlayButton.on('click', playVideo);

            video.on('abort error', function(e){
                self.logService.mobileAction('pderr', e.type);
                self.logService.ikanPlayError(e.type);
            });

            video.on('stalled', function(e){
                log("<font color=red>stalled</font>");
            });

            video.on('ended', function(){
                log('video ended >> <font color=red>The End!...</font>');
                if(setBfrInterval) clearInterval(setBfrInterval);
                if(self.videoType == 10){
                    self.UI.playTips.show();
                }
                sendPostMessage(-1);
            });

            //fullscreen button clicked
            this.UI.playUIZoom.on('click', function() {
                if($.isFunction(self.player.webkitEnterFullscreen)) {
                    self.player.webkitEnterFullscreen();
                } else if ($.isFunction(self.player.mozRequestFullScreen)) {
                    self.player.mozRequestFullScreen();
                } else {
                    alert('Your browsers doesn\'t support fullscreen');
                }
            });

            this.UI.playTips.find('a').on('click', function(e){
                var cls = e.target.className;
                if(cls == 'know'){
                    self.replay();
                    self.UI.playTips.hide();
                }else{
                    var plt = null, url = '';
                    if(navigator.userAgent.match(/iPad/i)){
                        plt = 1; //ipad
                    }else if (navigator.userAgent.match(/(iPhone|iPod);?/i)) {
                        plt = 2; //ios
                    }else if (navigator.userAgent.match(/android/i)) {
                        plt = 3; //android
                    }else if(navigator.userAgent.match(/Windows Phone/i)){
                        plt = 4; //windows phone
                    }
                    url = 'http://m.pptv.com/startapp/'+ plt +'-'+ self.vt +'-'+ self.adConfig.chid +'-'+ self.id +'-'+ self.playTime +'.html';
                    log('iframe url >> ', url);
                    top.window.open(url, '_blank');
                }
                return false;
            });
            
            function playVideo(x){
                   if(self.hasStoped == true){
                        self.hasStoped = false;
                       self.replay();
                       playpause(2); 
                   } else {
                        playpause(1); 
                   }
                   self.UI.playUIButton.hide();
                   return false;
            }
            //结束了传递postMessage出去告知结束了。
            function sendPostMessage (currentPos){
                if(self.hasStoped) return;
                if((self.videoType == 1 && currentPos >= self.duration - 0.5)){
                    log('timeupdate >> <font color=red>The End!...</font>');
                    self.stop();
                    
                    try{
                         window.parent.postMessage("chid="+self.adConfig.chid,'*');
                    } catch (e){
                       log('postMessage error'); 
                    }
                    return;
                }
                if(currentPos == -1){
                    self.stop();
                    return;
                }
            }

            function startBuffer() {
                var currentBuffer = self.player.buffered.end(0);
                var perc = 100 * currentBuffer / maxduration;
                self.UI.playUIBufferBar.css('width',perc+'%');

                if(perc >= 99.9){ return;}
                if(currentBuffer < maxduration) {
                    setTimeout(startBuffer, 500);
                }
            }

            function hoverState(){
                self.UI.playUIHeader.show().stop().animate({'top':0}, 500);
                self.UI.playUIControl.show().stop().animate({'bottom':0}, 500);
            }

            function unhoverState(){
                self.UI.playUIHeader.stop().animate({'top':-videoHeaderH}, 500).hide();
                self.UI.playUIControl.stop().animate({'bottom':-videoControlH}, 500).hide();
            }

            function playpause(a) {
                if(self.player.paused) {
                    self.UI.playUIPlayButton.removeClass('p-pause').addClass('p-go');
                    unhoverState();
                    self.play();
                } else {
                    self.UI.playUIPlayButton.removeClass('p-go').addClass('p-pause');
                    hoverState();
                    self.pause();
                }
            }

            function updatebar(x) {
                var playUIProsser = self.UI.playUIProsser;
                var position = x - playUIProsser.offset().left;
                var percentage = 100 * position / playUIProsser.width();
                percentage = (percentage >= 0) ? function (){
                    if(percentage >= maxpercentage) {
                        return maxpercentage;
                    }
                    return percentage;
                }() : 0;
                self.playTime = maxduration * percentage / 100;
                self.UI.playUILoading.show();
                self.UI.playUITimBar.css('width', percentage + '%');
                self.UI.playUICurrentTime.text(timeFormat(self.playTime));
                log('updatebar >> ', self.playTime, self.player.currentTime, percentage);
            }
        },
        resize : function(){
            var w = DomBody.width(), h = Math.floor(w * 9 / 16);
            if(Number(this.CTX.resize) === 0) return;
            if(Number(this.CTX.o) === 0 || Number(this.CTX.resize) === 1){
                this.playerbox.css({ 'width' : w, 'height' : h});
            }
        },
        play : function(time){
            try{
                this.player.currentTime = this.playTime || 0;
            }catch(e){log('<font color=red>play error...</font>', this.playTime, this.player.currentTime);}
            this.video.show();
            this.player.play();
            this.logService.mobileAction('pd');
            log('play...', this.playTime, this.player.currentTime); //, this.PreVideoInfo.vt
        },
        pause : function(){
            log('pause...', this.playTime, this.player.currentTime);
            this.player.pause();
            this.logService.mobileAction('pdp');
            // try{
            //     this.player.currentTime = this.playTime;
            // }catch(e){ log('<font color=red>pause error...</font>', this.playTime, this.player.currentTime); }
        },
        stop : function(){
            log('stop...' , this.playTime, this.player.currentTime);
            this.UI.playUITimBar.css('width', '0%');
            this.UI.playUICurrentTime.text(timeFormat(0));
            //if(this.hasStoped) return;
            this.hasStoped = true;
            //this.player.pause();
            this.video.hide();
            this.UI.playUICurrentTime.text(timeFormat(0));
            this.UI.playUIPlayButton.removeClass('p-pause').addClass('p-go');
            this.UI.playUIButton.show();
            this.logService.mobileAction('pde');
        },
        replay : function(){
            log('replay...' , this.videoSrc);
            this.playTime = 0;
            this.video.show();
             this.player.src = this.videoSrc;
            this.player.load();
            this.UI.playUITimBar.css('width', '0%');
            this.UI.playUICurrentTime.text(timeFormat(0));
        },
        seekTo : function(time){
            try {
                this.player.currentTime = time;
            } catch (e) {
                log('seekTo error >>> ', e, time);
                this.video.addEventListener("canplay", function() {
                    self.video.currentTime = time;
                });
            }
        },
        switchFullScreen: function() {
            try {
                this.player().switchFullScreen();
            } catch (e) {}
        },
        quryToString : function(adConfig){
            if(!adConfig || $.isEmptyObject(adConfig)){
                return;
            }
            return $.param(adConfig);
        },
        createAdIframe : function(src){
            if(!src) return;
            src += this.quryToString(this.adConfig);
            this.vastAdBox.html('<iframe id="adiframe" name="adiframe" src="'+ src +'" width="100%" height="100%"  scrolling="no" frameborder="0"></iframe>');
            this.vastAdBox.find('iframe')[0].onerror = function(){
                self.goToPlay(11);
            };
        },
        loadIpadStr : function(id, callback){
            var self = this, _ctx = this.CTX, queryString = '';
            _ctx.rcc_id = _ctx.o;
            //_ctx.o = this.pageDomain; //修复统计错误
            queryString = '&' + $.param(_ctx);
            self.ftps = +new Date();
            log('loadIpadStr src ', id, self.loadType, self.key);

            //直播 - ?(标题，时长，ip等)
            if(this.videoType == 'live'){
                this.videoType = 10;
                callback({
                    title : self.title || '',
                    duration : 0,
                    videoSrc : "http://web-play.pptv.com/web-m3u8-" + id + ".m3u8?type=" + self.loadType + "&playback=0" + queryString, // + "&o=" + (self.pageDomain || ''),
                    ip : 0
                });
                return;
            }

            $.ajax({
                dataType : 'jsonp',
                type : 'GET',
                cache : true,
                jsonpCallback : 'getPlayEncode',
                url : 'http://web-play.pptv.com/webplay3-0-' + id + '.xml?version=4&type=' + self.loadType + queryString, // + "&o=" + (self.pageDomain || ''),
                jsonp : 'cb',
                success : function(data){
                    self.stps = +new Date();
                    //
                    // ft -- current stream type.
                    // rid -- resource id. For vod, it could be "***.mp4"
                    // sh -- server ip.
                    // key -- security key. could be none.
                    // url -- player url
                    //
                    var ft, rid, sh, key, url, title, duration, begin, end, vt;
                    for ( var i in data.childNodes) {
                        var node = data.childNodes[i];
                        if (node.tagName === 'channel') {
                            title = node.nm;
                            vt = node.vt;
                            duration = node.dur;
                            for ( var j in node.childNodes) {
                                var file = node.childNodes[j];
                                if(file.tagName === 'live'){
                                    begin = file.start;
                                    end = file.end;
                                }
                                if (file.tagName === 'file' || file.tagName === 'stream') {
                                    // file for vod, stream for live; cur for vod, cfg for live. interesting right?
                                    var cft = file.tagName === 'file' ? file.cur : file.cft;
                                    for ( var k in file.childNodes) {
                                        var item = file.childNodes[k];
                                        if (item.ft === cft) {
                                            ft = cft;
                                            rid = item.rid;
                                            break;
                                        }
                                    }
                                }
                                if (ft) {
                                    break;
                                }
                            }
                        } else if (node.tagName === 'dt' && (node.ft == ft || !node.ft)) {
                            for ( var s in node.childNodes) {
                                var subnode = node.childNodes[s];
                                if (subnode.tagName === 'sh') {
                                    sh = subnode.childNodes[0];
                                } else if (subnode.tagName === 'key') {
                                    key = subnode.childNodes[0];
                                }
                            }
                        }
                    }

                    //VT=0:直播,3:点播,4:二代直播,21:剧集,22:合集,23:榜单,5:伪点播
                    if (ft !== undefined && rid && sh) {
                        rid = rid.replace('.mp4', '');
                        self.vt = vt;
                        if(vt == 5){   //伪点播
                            self.videoType = 20;
                            url = 'http://' + sh + '/live/5/60/' + rid + '.m3u8?type=' + self.loadType + '&begin=' + begin + '&end=' + end;
                        }else{
                            self.videoType = 1;
                            url = 'http://' + sh + (self.islumia ? '/w/' : '/') + rid + '.m3u8?type=' + self.loadType;
                            url = self.islumia ? url.replace('m3u8', 'mp4') : url;
                        }
                        url += key ? '&k=' + key : '';
                        log('<font color=red>video src：</font>', url);
                        if(callback) callback({
                            title : title,
                            duration : duration,
                            videoSrc : url,
                            ip : sh,
                            ft : ft
                        });
                    } else {
                        alert("非常抱歉,我们暂无此视频资源！");
                        self.logService.ikanPlayError(12);
                    }
                }
            });
        },
        logService : function(){
            var self = this, h5key = 'h5playerbfr';
            var logService = {};
            if(!window.btoa) {
                window.btoa  = function(text) {
                    if (/([^\u0000-\u00ff])/.test(text)) return;
                    var table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
                        i = 0,
                        cur, prev, byteNum,
                        result=[];

                    while(i < text.length){
                        cur = text.charCodeAt(i);
                        byteNum = (i+1) % 3;

                        switch(byteNum){
                            case 1:
                                result.push(table.charAt(cur >> 2));
                                break;
                            case 2:
                                result.push(table.charAt((prev & 3) << 4 | (cur >> 4)));
                                break;
                            case 0:
                                result.push(table.charAt((prev & 0x0f) << 2 | (cur >> 6)));
                                result.push(table.charAt(cur & 0x3f));
                                break;
                        }
                        prev = cur;
                        i++;
                    }
                    if (byteNum == 1){
                        result.push(table.charAt((prev & 3) << 4));
                        result.push("==");
                    } else if (byteNum == 2){
                        result.push(table.charAt((prev & 0x0f) << 2));
                        result.push("=");
                    }
                    return result.join("");
                };
            }

            logService.enlog = function(logstr, key) {
                var logstr_len = logstr.length;
                var key_len = key.length;
                var en_str = "";
                for (var i=0; i<logstr_len; i++) {
                    en_str += String.fromCharCode(logstr.charAt(i).charCodeAt(0) + key.charAt(i%key_len).charCodeAt(0));
                }
                return btoa(en_str);
            };

            var ikanString = function(type, obj){
                var logArr = [], params = obj || {}, logStr;
                logArr.push("dt=" + type);
                logArr.push("guid=" + self.guid);
                logArr.push("uid=" + self.PPName);
                logArr.push("s=" + self.videoType);
                logArr.push("pid=88888888");
                logArr.push("cid=" + self.id); //频道id - 播放页传单集
                logArr.push("clid=" + self.adConfig.clid); //分类id
                logArr.push("chid=" + self.adConfig.chid); //剧集id
                logArr.push("vvid=" + self.vvid);
                logArr.push("v=v1.0.1");
                logArr.push("o=" + self.CTX.o);
                logArr.push("m=7");
                for(var i in params){
                    if(params.hasOwnProperty(i)){
                        logArr.push(i + '=' + params[i]);
                    }
                }
                logArr.push("referrer=" + self.pageRefer);
                logArr.push("pageUrl=" + self.pageUrl);
                logArr.push("apptype=" + self.loadType);
                logArr.push("rnd=" + (+new Date()));
                logStr = logArr.join('&');
                return logStr;
            };

            function DacIkanReport(type, param){
                var logStr = '';
                if(!type || !param) return;
                if(type == 'bfr' || typeof(param) == 'string'){
                    logStr = param;
                }else{
                    logStr = ikanString(type, param);
                }
                log('DacIkanReport >> <font color=red>', type, '</font>',logStr);
                logStr = logService.enlog(logStr, "pplive");
                log('<font color=red>DacIkanReport Encrypted logStr >></font> ', logStr);
                new Image().src = "http://ik.synacast.com/1.html?" + logStr;
            }

            function DacMobileReport(at, msg){
                var mobileLogArr = [], logStr;
                if(self.adConfig.plat != 'mbs'){ return; }
                mobileLogArr.push('at=' + at);
                mobileLogArr.push('vl=m');
                mobileLogArr.push('ver=v1.0.1');
                mobileLogArr.push('ot=' + self.videoType == 10 ? 'zb' : 'db');
                mobileLogArr.push("uid=" + self.guid); //bug fix - 和主站定义不一致
                mobileLogArr.push("frurl=" + self.pageRefer);
                mobileLogArr.push("url=" + self.pageUrl);
                mobileLogArr.push("cid=" + self.id); //频道id
                mobileLogArr.push("clid=" + self.adConfig.clid);    //catid
                mobileLogArr.push('sid=' + self.adConfig.sid); //sid
                mobileLogArr.push('chid=' + self.adConfig.chid); //剧集id
                mobileLogArr.push("vvid=" + self.vvid);
                mobileLogArr.push("o=" + self.CTX.o);
                mobileLogArr.push('nt=');
                if(msg !== undefined){ mobileLogArr.push('er=' + msg); }
                mobileLogArr.push('scr=' + (window.screen.width + "*" + window.screen.height));
                mobileLogArr.push("rnd=" + (+new Date()));
                logStr = mobileLogArr.join('&');
                logStr = logService.enlog(logStr, "mobile");
                new Image().src = "http://mobile.synacast.com/act/1.html?" + logStr;
            }

            logService.ikanPageView =function(){
                DacIkanReport('pv', {
                    playCode : self.playCode
                });
            };

            logService.ikanStartDelay = function(){
                /**
                 * ftps  web-play start
                 * sstp  web-play stop
                 * vds   video start
                 * vde   video end
                 */
                logService.ikanCookie();
                if(self.adConfig.plat != 'ik') return;
                DacIkanReport('sd', {
                    h : self.ip,
                    n : encode(self.title),
                    tds : self.vde - self.ftps, //(time delay start)时延，单位：毫秒
                    ftps : self.ftps, //请求起始点（first webplay start）
                    stps : self.stps - self.ftps, //表示webplay (web-play.pptv.com) 请求结束点
                    vds : self.vds - self.stps, //表示 video 请求起始点
                    vde : self.vde - self.ftps, //表示 video 请求结束点
                    url : self.videoSrc
                });
            };

            logService.ikanCookie = function(){
                var ck = ikanString('bfr', {
                    h : self.ip || 0,
                    n : encode(self.title) || self.title,
                    du : self.duration * 1000 || 0, //视频时长毫秒数，对直播该值为0
                    vt : parseInt(self.playTime, 10) * 1000, //观看时长毫秒数
                    now : self.vde, //当前播放时间
                    bwtype : self.ft || 1, //多码流
                    np : '1'
                });
                Cookie.set(h5key, ck);
            };

            logService.getPrevCookie = function(){
                var str = Cookie.get(h5key) || '', params = {};
                if(str){
                    params = queryToObject(str);
                }
                log('getPrevCookie ==> ', params);
                return params;
            };

            logService.ikanPlayError = function(errorcode){
                /**
                 * errcode
                 * 100 - web-play error
                 * 110 - video error
                 * 120 - video abort
                 */
                DacIkanReport('er', {
                    er : errorcode
                });
            };

            logService.ikanPlayBfr = function(){
                var str = Cookie.get(h5key) || '';
                log('DacIkanReport Ikan-Bfr getCookie >> ', str);
                if(!str || str == 'null'){
                    log('No Ikan-Bfr Report...');
                    return;
                }
                DacIkanReport('bfr', str);
            };

            logService.mobileAction = function(type, errmsg){
                DacMobileReport(type, errmsg);
            };
            return logService;
        }
    };

    //export
    global.ppliveplayer.H5Player = H5Player;

})(window);

});