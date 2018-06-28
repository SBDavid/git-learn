/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import puremvc from "puremvc";
import Global from "manager/Global";
import BIPCommon from "bip/BIPCommon";
import { PLDecode } from "crypto/PLDecode";
import { H5Common } from "common/H5Common";
import { H5Crypto as pptvH5Crypto } from "crypto/H5Crypto";
import DownloadManager from "manager/DownloadManager";
import { H5CommonUtils } from "common/H5CommonUtils";
import H5Notification from "common/H5Notification";
import H5PlayerEvent from "common/H5PlayerEvent";
import { H5PlayProxy } from "model/H5PlayProxy";
import H5ComponentEvent from "../event/H5ComponentEvent";
import { MobileSkinMediator } from "./MobileSkinMediator";
import { MobilePlayerComponent } from "./component/MobilePlayerComponent";

export class MobilePlayerMediator extends puremvc.Mediator {

    static NAME = 'mobile_player_mediator';

    onRegister() {
        this.setViewComponent(new MobilePlayerComponent());
        this.viewComponent.target = this.viewComponent.video;
        //
        this.viewComponent.addEventListener(H5ComponentEvent.ADS_STATUS, this);
        this.viewComponent.addEventListener(H5ComponentEvent.WEB_PLAY, this);
        this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_UPDATE, this);
        this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_FD_COUNTDOWN, this); 
        this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_STATE, this);
        this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_BUFFER, this);
        this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_FAILED, this);
        this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_TITLE, this);
        this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_SCREEN, this);
        this.viewComponent.addEventListener(H5ComponentEvent.CONTROL_STATE, this);
        this.viewComponent.addEventListener(H5ComponentEvent.SKIN_TIPS, this);
        this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_BIP, this);
        this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_STORAGE, this);
        this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_ONLINE, this);
        this.viewComponent.addEventListener(H5ComponentEvent.START_RECORD, this);
        this.viewComponent.addEventListener(H5ComponentEvent.STOP_RECORD, this);
        this.viewComponent.addEventListener(H5ComponentEvent.ADD_VALUE, this);
        this.viewComponent.addEventListener(H5ComponentEvent.ADV_EVENT, this);
        this.viewComponent.execute();
    }

    handleEvent(event, data) {
        let self = event.data.self;
        let skin = self.facade.retrieveMediator(MobileSkinMediator.NAME);
        switch (event.type) {
            case H5ComponentEvent.VIDEO_SCREEN:
                try {
                    skin.getViewComponent().displayScreenState(data['zoom']);
                } catch (e) {};
                break;
            case H5ComponentEvent.ADS_STATUS:
                self.sendNotification(H5Notification.ADS_STATUS, data);
                break;
            case H5ComponentEvent.WEB_PLAY:
                let playProxy = self.facade.retrieveProxy(H5PlayProxy.NAME);
                playProxy.dindex = 0;
                playProxy.loadData();
                break;
            case H5ComponentEvent.CONTROL_STATE:
                self.sendNotification(H5Notification.CONTROL_STATE, data);
                break;
            case H5ComponentEvent.VIDEO_TITLE:
                self.sendNotification(H5Notification.VIDEO_TITLE, data);
                break;
            case H5ComponentEvent.VIDEO_UPDATE:
                self.sendNotification(H5Notification.VIDEO_UPDATE, data);
                break;
             case H5ComponentEvent.VIDEO_FD_COUNTDOWN:
                self.sendNotification(H5Notification.VIDEO_FD_COUNTDOWN, data);
                break;
            case H5ComponentEvent.VIDEO_STATE:
                self.sendNotification(H5Notification.VIDEO_STATE, data);
                break;
            case H5ComponentEvent.VIDEO_BUFFER:
                try {
                    skin.getViewComponent().showBuffer();
                } catch (e) {};
                break;
            case H5ComponentEvent.VIDEO_FAILED:
                self.sendNotification(H5Notification.PLAY_FAILED, data);
                break;
            case H5ComponentEvent.SKIN_TIPS:
                try {
                    skin.getViewComponent().showTip(data['bool']);
                } catch (e) {};
                break;
            case H5ComponentEvent.VIDEO_BIP:
                self.sendNotification(H5Notification.VIDEO_BIP, data);
                break;
            case H5ComponentEvent.START_RECORD:
                self.sendNotification(H5Notification.START_RECORD, data);
                break;
            case H5ComponentEvent.STOP_RECORD:
                self.sendNotification(H5Notification.STOP_RECORD, data);
                break;
            case H5ComponentEvent.ADD_VALUE:
                self.sendNotification(H5Notification.ADD_VALUE, data);
                break;
            case H5ComponentEvent.VIDEO_STORAGE:
                self.sendNotification(H5Notification.VIDEO_STORAGE, data);
                break;
            case H5ComponentEvent.VIDEO_ONLINE:
                self.sendNotification(H5Notification.VIDEO_ONLINE, data);
                break;
            case H5ComponentEvent.ADV_EVENT:
                self.sendNotification(H5Notification.ADV_EVENT, data);
                break;
        }
    }

    videoData(obj, ft) {
        if (!Global.getInstance().stream[ft]) {
            Global.debug('播放 ft ==>> ', ft, ' 不存在，无法 播放 || 切换 该码流...');
            return null;
        }
        var key = Global.getInstance().stream[ft]['dt']['key'],
            cipher_text, plain_text, random_hex;
        try {
            if (key) {
                var arr = key.split("|");
                if (arr.length > 0) {
                    if (arr[0] == 0) {
                        random_hex = arr[1];
                        cipher_text = arr[2];
                        plain_text = pptvH5Crypto.secure_key_decrypt(pptvH5Crypto.SC_KEY, cipher_text, random_hex);
                    }
                }
            }
        } catch (e) {}
        Global.debug('加密key ', key);
        Global.debug('解密key ', plain_text);
        if (plain_text) key = plain_text;
        //
        let data = {
            'vt'       : obj['info']['vt'],
            'title'    : obj['info']['title'],
            'duration' : obj['info']['duration'],
            'pno'      : obj['info']['pno'],
            'mark'     : obj['mark'],
            'fd' 	   : obj['info']['fd'],
            'timestamp': new Date().valueOf()
        }
        Global.getInstance().stream[ft]['rid'] = Global.getInstance().stream[ft]['rid'].replace('.mp4', '');
        //VT=0:直播,3:点播,4:二代直播,5:伪点播,21:剧集,22:合集,23:榜单
        Global.debug('播放类型 vt ==>> ', obj['info']['vt']);

        if (obj['info']['vt'] == 3) {
            Global.getInstance().videoType = 1;
            data['videoSrc'] = '//' + Global.getInstance().stream[ft]['dt']['sh'] + ((Global.getInstance().islumia || H5CommonUtils.getQueryString('debug') == 'ikan') ? '/w/' : '/') + Global.getInstance().stream[ft]['rid'] + '.m3u8?type=' + Global.getInstance().loadType + '&k=' + key;
            data['videoSrc'] = (Global.getInstance().islumia || H5CommonUtils.getQueryString('debug') == 'ikan') ? data['videoSrc'].replace('m3u8', 'mp4') : data['videoSrc'];
        } else if (obj['info']['vt'] == 4) {
            Global.getInstance().videoType = 10;
            data['videoSrc'] = `//${Global.getInstance().stream[ft]['dt']['sh']}/live/5/60/${Global.getInstance().stream[ft]['rid']}.m3u8?type=${Global.getInstance().loadType}&k=${key}&playback=0`;
        } else if (obj['info']['vt'] == 5) {
            Global.getInstance().videoType = 20;
            data['videoSrc'] = `//${Global.getInstance().stream[ft]['dt']['sh']}/live/5/60/${Global.getInstance().stream[ft]['rid']}.m3u8?type=${Global.getInstance().loadType}&k=${key}&begin=${obj['info']['begin']}&end=${obj['info']['end']}`;
        }
        data['st'] = Global.getInstance().stream[ft]['dt']['st'];
        data['ip'] = Global.getInstance().stream[ft]['dt']['sh'];
        if (Global.getInstance().stream[ft]['dt']['bh']) data['backip'] = Global.getInstance().stream[ft]['dt']['bh']; //备用ip
        data['videoSrc'] += '&vvid=' + Global.getInstance().bip.vvid;
        return data;
    }

    showPlayBtn() {
        let skin = this.facade.retrieveMediator(MobileSkinMediator.NAME);
        skin.viewComponent.playUIBigPlay.show();
        Global.debug('播放器初始化完毕 ...');
        if (!Global.getInstance().isSkin) {
            skin.viewComponent.playUIBigPlay.remove();
            skin.viewComponent.playUIControl.hide();
        }
        Global.postMessage(H5PlayerEvent.VIDEO_ONREADY);
        if (Global.getInstance().autoplay != 0 && DownloadManager.getInstance().isIos(navigator.userAgent)) {
            debug('可能满足自动播放的条件 ==>>【autoplay非0，iphone|ipad|ipod|ios】...');
            this.viewComponent.toggleVideo();
        }
    }

    /**
     * @override
     */
    listNotificationInterests() {
        return [
            H5Notification.PLAY_SUCCESS,
            H5Notification.PLAY_FAILED,
            H5Notification.VIDEO_SCREEN,
            H5Notification.VIDEO_PLAY,
            H5Notification.VIDEO_SEEK,
            H5Notification.VIDEO_REPLAY,
            H5Notification.VIDEO_VOLUME,
            H5Notification.VIDEO_TOGGLE,
            H5Notification.VIDEO_STOP,
            H5Notification.VIDEO_SWITCH,
            H5Notification.ADV_PLAY,
            H5Notification.ADV_OVER,
            H5Notification.ADV_CONNECT,
            H5Notification.VIDEO_COUNTDOWN,
            H5Notification.VIDEO_STANDBY
        ];
    }

    /**
     * @override
     */
    handleNotification(note) {
        let skin = this.facade.retrieveMediator(MobileSkinMediator.NAME);
        switch (note.getName()) {
            case H5Notification.PLAY_SUCCESS:
                Global.getInstance().originTime = new Date().valueOf();
                Global.debug('播放数据信息  >>>>>  ', note.getBody());
                this.playObj = note.getBody();
                Global.getInstance().stream = this.playObj['stream'];
                H5Common.ft = this.playObj['cft'];
                Global.getInstance().playData = this.videoData(this.playObj, H5Common.ft);
                if (Global.getInstance().playData) {
                    Global.getInstance().totalDuration = Global.getInstance().playData.duration;
                    Global.getInstance().title = Global.getInstance().playData.title;
                    Global.getInstance().ip = Global.getInstance().playData.ip;
                    Global.getInstance().st = Global.getInstance().playData.st;
                }
                if (this.viewComponent.firstPlay) {
                    if (Global.getInstance().advConnect) {
                        this.showPlayBtn();
                    } else {
                        this.connectAdvTimeOut = setTimeout(() => {
                            if (this.connectAdvTimeOut > 0) {
                                this.showPlayBtn();
                            }
                            this.connectAdvTimeOut = -1;
                        }, 1 * 1000)
                    }
                } else {
                    this.viewComponent.playVideo();
                }
                break;
            case H5Notification.PLAY_FAILED:
                Global.debug('异常错误代码  >>>>>  ', note.getBody());
                Global.postMessage(H5PlayerEvent.VIDEO_ONERROR, note.getBody());
                skin.viewComponent.showError(note.getBody()['errorcode']);
                break;
            case H5Notification.VIDEO_SCREEN:
                this.viewComponent.screenVideo(note.getBody());
                break;
            case H5Notification.VIDEO_PLAY:
                this.viewComponent.toggleVideo();
                break;
            case H5Notification.VIDEO_SEEK:
                //外部调用seekVideo接口判断处理
                if (Global.getInstance().videoType != 10 && note.getBody() && note.getBody()['seektime'] != undefined) {
                    var $seektime = Number(note.getBody()['seektime']);
                    if ($seektime > 0 && $seektime < Global.getInstance().duration) {
                        this.viewComponent.seekVideo($seektime);
                        return;
                    }
                }
                this.viewComponent.seekVideo();
                break;
            case H5Notification.VIDEO_REPLAY:
                this.sendNotification(H5Notification.VIDEO_SESSION_UPDATE);
                try {
                    [{
                        'key': BIPCommon.GUID,
                        'value': Global.getInstance().userInfo.guid
                    }, {
                        'key': BIPCommon.UID,
                        'value': Global.getInstance().userInfo.uid
                    }, {
                        'key': BIPCommon.CID,
                        'value': Global.getInstance().cid
                    }].forEach((item) => {
                        this.sendNotification(H5Notification.VIDEO_STORAGE, item);
                    });
                } catch (e) {};
                Global.getInstance().ss = 'mplayer_seeAgain';
                this.viewComponent.replay();
                break;
            case H5Notification.VIDEO_SWITCH:
                var tempFt = note.getBody()['ft'];
                if (tempFt == H5Common.ft) {
                    Global.debug('当前正播放此码流 ft  >>>>>  ', H5Common.ft, ' 无需切换...');
                    return;
                }
                Global.getInstance().playData = this.videoData(this.playObj, tempFt);
                if (Global.getInstance().playData) {
                    H5Common.ft = tempFt;
                    Global.getInstance().totalDuration = Global.getInstance().playData.duration;
                    Global.getInstance().title = Global.getInstance().playData.title;
                    Global.getInstance().ip = Global.getInstance().playData.ip;
                    Global.getInstance().st = Global.getInstance().playData.st;
                    Global.debug('正在切换码流 ft  >>>>>  ', H5Common.ft);
                    this.viewComponent.replay(Global.getInstance().playData);
                }
                break;
            case H5Notification.VIDEO_VOLUME:
                this.viewComponent.volume = note.getBody()['volume'];
                break;
            case H5Notification.VIDEO_TOGGLE:
                H5Common.isHandoff = 0;
                if (note.getBody()) {
                    Global.getInstance().cid = note.getBody()['pl'] ? PLDecode.getCid(note.getBody()['pl']) : note.getBody()['cid'];
                    Global.getInstance().isReload = false;
                    this.viewComponent.firstPlay = false;
                    this.viewComponent.isRequestPlay = false;
                    skin.viewComponent.reset();
                    if (Global.getInstance().playstate != 'stopped') {
                        this.viewComponent.stopVideo();
                    }
                    this.viewComponent.playVideo();
                } else {
                    this.viewComponent.toggleVideo();
                }
                break;
            case H5Notification.VIDEO_STOP:
                this.viewComponent.stopVideo();
                break;
            case H5Notification.ADV_PLAY:
                this.viewComponent.setAdvSrc(note.getBody()['src']);
                break;
            case H5Notification.ADV_OVER:
                if (this.viewComponent.isPlayClick) {
                    Global.getInstance().playstate = 'stopped';
                    this.viewComponent.playVideo();
                    this.viewComponent.playAdv = false;
                }
                break;
            case H5Notification.ADV_CONNECT:
                Global.getInstance().advConnect = true;
                if (this.connectAdvTimeOut && this.connectAdvTimeOut > 0) {
                    this.showPlayBtn();
                }
                this.connectAdvTimeOut = -1;
                break;
            case H5Notification.VIDEO_COUNTDOWN:
                this.viewComponent.showCountdown(note.getBody());
                break;
            case H5Notification.VIDEO_STANDBY:
                this.viewComponent.toggleVideo();
                break;
        }
    }
}