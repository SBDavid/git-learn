import Global from "manager/Global";
(function(){
    var AdvPlayer = function() {
        this.config = {
            w: 0,
            h: 0,
            cid: 0,
            dom: 0
        }
    }
    AdvPlayer.prototype = {
        setConfig(opt) {
            //this.config = {
            //    w: opt.w || 0,
            //    h: opt.h || 0,
            //    cid: opt.cid || 0,
            //    dom: opt.dom || 0
            //}
            //if(this.config.w && this.config.h && this.config.cid && this.config.dom) {
            //    console.log('构建宽：',this.config.w,'，高：',this.config.h)
            //} else {
            //    console.log('缺少初始化参数')
            //}
        },
        syncVideoPlayerTime(time) {
            //console.log(time);
        },
        showAd(id) {
            Global.debug('广告 ',id,' 已展示')
            //switch(id) {
            //    case 1:
                    //setTimeout(() => {
                        this.hideAd(id);
                        this.fire('preRollEnd')
                    //},0);
            //        break;
            //    case 2:
            //        break;
            //    case 3:
            //        break;
            //}
        },
        hideAd(id) {
            Global.debug('广告 ',id,' 已隐藏')
        },
        setAdVolume(volume) {
            Global.debug('音量：',volume);
        },
        setViewport(w,h) {
            Global.debug('宽：',w,'，高：',h);
        },
        //事件
        handler: {
            'preRollEnd': [], //前贴片播放结束
            'preRollError': [], //前贴片播放异常
            'preRollStart': [], //前贴片播放开始通知
            'backPostStart': [],  //后贴片播放结束
            'backPostEnd': [],  //通知视频继续播放
            'backPostError': [],   //通知视频暂停播放
            'videoResume': [],    //抛出登陆会员/会员免广告
            'videoPause': [],  //抛出了解详情
            'progLock': [],  //通知视频继续播放
            'progUnlock': [],   //通知视频暂停播放
            'adVip': [],    //抛出登陆会员/会员免广告
            'adClickDetail': [],  //抛出了解详情
            'adNotification': [],  //抛出了解详情
        },
        //添加事件监听
        on(type,func) {
            //检测type是否存在
            if(this.handler[type]){
                //检测事件是否存在，不存在则添加
                if(this.handler[type].indexOf(func) === -1){
                    this.handler[type].push(func);
                }
            }else{
                this.handler[type]=[func];
            }
        },
        //移除事件
        off(type,func) {
            try{
                let target = this.handler[type];
                let index = target.indexOf(func);
                if(index === -1)throw error;
                target.splice(index,1);
            }catch (e){
                console.error('别老想搞什么飞机，删除我有的东西！');
            }
        },
        //触发事件
        fire(type) {
            try{
                let target = this.handler[type];
                let count = target.length;
                for (var i = 0; i < count; i++) {
                    //加()使立即执行
                    target[i]();
                }

            }catch (e){
                console.error('别老总想搞事情！');
            }
        },
        //触发一次事件并移除
        once(type,func) {
            this.fire(type);
            this.off(type,func);
        }
    }
    window.AdvPlayer = AdvPlayer;
})()