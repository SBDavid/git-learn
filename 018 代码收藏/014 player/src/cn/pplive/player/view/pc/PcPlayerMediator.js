/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import puremvc from "puremvc";
import Global from "manager/Global";
import { PLDecode } from "crypto/PLDecode";
import { H5Common } from "common/H5Common";
import H5PlayerEvent from "common/H5PlayerEvent";
import H5Notification from "common/H5Notification";
import { H5CommonUtils } from "common/H5CommonUtils";
import { H5Crypto as pptvH5Crypto } from "crypto/H5Crypto";
import { PcPlayerComponent } from "./component/PcPlayerComponent";
import H5ComponentEvent from "../event/H5ComponentEvent";
import DownloadManager from "manager/DownloadManager";
import { PcSkinMediator } from "./PcSkinMediator";
import { H5RecomProxy } from "model/H5RecomProxy";
import { PcAdvMediator } from "./PcAdvMediator";
import { H5PlayProxy } from "model/H5PlayProxy";
import VIPPrivilege from "common/VIPPrivilege";

export class PcPlayerMediator extends puremvc.Mediator {

    static NAME = 'pc_player_mediator';

    onRegister() {
        this.setViewComponent(new PcPlayerComponent());
        this.viewComponent.target = this.viewComponent.video;
        //
        this.viewComponent.addEventListener(H5ComponentEvent.WEB_PLAY, this);
        this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_START, this);
        this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_UPDATE, this);
        this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_STATE, this);
        this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_BUFFER_FULL, this);
        this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_FAILED, this);
        this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_TITLE, this);
        this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_SCREEN, this);
        this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_ONAIR, this);
        this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_MOUSEMOVE, this);
        this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_VOLUME_STATE, this);
        this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_BUFFER_TIP, this);
        this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_SKIP, this);
        this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_PAY, this);
        this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_POST, this);
        //
        this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_BIP, this);
        this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_STORAGE, this);
        this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_ONLINE, this);
        this.viewComponent.addEventListener(H5ComponentEvent.START_RECORD, this);
        this.viewComponent.addEventListener(H5ComponentEvent.STOP_RECORD, this);
        this.viewComponent.addEventListener(H5ComponentEvent.ADD_VALUE, this);
        this.viewComponent.execute();
    }

    handleEvent(event, data) {
        let self = event.data.self;
        let skin = self.facade.retrieveMediator(PcSkinMediator.NAME);
        switch (event.type) {
            case H5ComponentEvent.WEB_PLAY:
                skin.viewComponent.reset();
                let playProxy = self.facade.retrieveProxy(H5PlayProxy.NAME);
                playProxy.dindex = 0;
                playProxy.loadData();
                break;
            case H5ComponentEvent.VIDEO_ONAIR:
                skin.viewComponent.enable = !(data && data['errorcode']);
                skin.viewComponent.showError(data?data['errorcode']:null);
                break;
            case H5ComponentEvent.VIDEO_SCREEN:
                skin.viewComponent.displayScreenState = data['zoom'];
                break;
            case H5ComponentEvent.VIDEO_TITLE:
                self.sendNotification(H5Notification.VIDEO_TITLE, data);
                break;
            case H5ComponentEvent.VIDEO_UPDATE:
                self.sendNotification(H5Notification.VIDEO_UPDATE, data);
                break;
            case H5ComponentEvent.VIDEO_STATE:
                Global.debug('播放器当前状态 ===>>> ', data['playstate']);
                self.sendNotification(H5Notification.VIDEO_STATE, data);
                break;
            case H5ComponentEvent.VIDEO_BUFFER_FULL:
                
                break;
            case H5ComponentEvent.VIDEO_FAILED:
                self.sendNotification(H5Notification.PLAY_FAILED, data);
                break;
            case H5ComponentEvent.VIDEO_START:
                self.sendNotification(H5Notification.VIDEO_START);
                break;
            case H5ComponentEvent.VIDEO_BUFFER_TIP:
                self.sendNotification(H5Notification.VIDEO_BUFFER_TIP);
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
            case H5ComponentEvent.VIDEO_MOUSEMOVE:
                self.sendNotification(H5Notification.VIDEO_MOUSEMOVE, data);
                break;
            case H5ComponentEvent.VIDEO_VOLUME_STATE:
                skin.viewComponent.volumeState = data['volume'];
                break;
            case H5ComponentEvent.VIDEO_PAY:
                skin.viewComponent.guideToPay(H5Common.paydata);
                break;
            case H5ComponentEvent.VIDEO_SKIP:
                skin.viewComponent.generalTip(
                    `即将为您跳过片尾，<a class="w-setup" href="javascript:void(0);">设置</a>`,
                    'skip-end',
                    30
                );
                break;
            case H5ComponentEvent.VIDEO_POST:
                self.sendNotification(H5Notification.VIDEO_POST);
                break;
        }
    }

    /**
     * 获取播放数据对象
     * @param {*} obj 
     * @param {*} ft 
     */
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
            'timestamp': new Date().valueOf(),
            'delay'    : obj['delay'],
            'interval' : obj['interval'],
            'width'    : Global.getInstance().stream[ft]['width'],
            'height'   : Global.getInstance().stream[ft]['height'],
            'lang'     : obj['info']['lang'],
            'point'    : obj['info']['point']
        }
        if (obj['info']['vt'] == 3) {
            Global.getInstance().videoType = 1; // 点播
        } else if (obj['info']['vt'] == 4) {
            Global.getInstance().videoType = 10;// 直播
        } else if (obj['info']['vt'] == 5) {
            Global.getInstance().videoType = 20;// 伪点播
        }
        
        data['ip'] = Global.getInstance().stream[ft]['dt']['sh'];
        data['kernal'] = {
            'host'     : Global.getInstance().stream[ft]['dt']['sh'],
            'backhost' : Global.getInstance().stream[ft]['dt']['bh'],
            'rid'      : Global.getInstance().stream[ft]['rid'],
            'bitrate'  : Global.getInstance().stream[ft]['bitrate'],
            'variables': `k=${key}&type=${Global.getInstance().loadType}&vvid=${Global.getInstance().bip.vvid}`,
            'bwtype'   : Global.getInstance().stream[ft]['dt']['bwt'],
            'segments' : Global.getInstance().stream[ft]['drag'],
        }
        return data;
    }
    
    /**
     * 获取可播放的码流
     * @param {*} stream 
     * @param {*} cft 
     */
    getCurrFt(stream, cft) {
        let tempStream = [];
        for (let item of stream) {
            if (item) tempStream.push(item);
        }
        if (tempStream.length == 1){
            return tempStream[0].ft;
        }
        let currFt = Global.getInstance().bip.getValue('ft') ? Number(Global.getInstance().bip.getValue('ft')) : cft;
        if (!stream[currFt]) {
            for (let i = 0; i < stream.length; i++) {
                if (stream[i]) {
                    currFt = i;
                    break;
                }
            }
        }
        return currFt;
    }

    /**
     * @override
     */
    listNotificationInterests() {
        return [
            H5Notification.PLAY_SUCCESS,
            H5Notification.PLAY_FAILED,
            H5Notification.VIDEO_SCREEN,
            H5Notification.VIDEO_SEEK,
            H5Notification.VIDEO_VOLUME,
            H5Notification.VIDEO_TOGGLE,
            H5Notification.VIDEO_SWITCH,
            H5Notification.VIDEO_NEXT,
            H5Notification.VIDEO_STOP,
            H5Notification.VIDEO_COUNTDOWN,
            H5Notification.VIDEO_USERINFO,
            H5Notification.VIDEO_SHOW,
            H5Notification.VIDEO_PLAY
        ];
    }

    /**
     * @override
     */
    handleNotification(note) {
        let skin = this.facade.retrieveMediator(PcSkinMediator.NAME);
        let afp = this.facade.retrieveMediator(PcAdvMediator.NAME);
        switch (note.getName()) {
            case H5Notification.PLAY_SUCCESS:
                H5Common.tempT = NaN;
                Global.getInstance().isAllAdvClear = false;
                Global.getInstance().originTime = new Date().valueOf();
                Global.debug('播放数据信息  >>>>>  ', note.getBody());
                this.playObj = note.getBody();
                Global.getInstance().stream = this.playObj['stream'];
                // 获取 localstorage 中的存储值
                H5Common.isSkip = Global.getInstance().bip.getValue('skip') ? Number(Global.getInstance().bip.getValue('skip')) : H5Common.isSkip;
                Global.getInstance().bip.setValue('skip', H5Common.isSkip, false);
                H5Common.ft = this.getCurrFt(Global.getInstance().stream, this.playObj['cft']);
                Global.getInstance().bip.setValue('ft', H5Common.ft, false);
                //
                Global.getInstance().playData = this.videoData(this.playObj, H5Common.ft);
                Global.getInstance().title = Global.getInstance().playData.title;
                Global.getInstance().ip = Global.getInstance().playData.ip;
                Global.getInstance().serverTime = this.playObj['serverTime'];
                Global.getInstance().startTime = Global.getInstance().serverTime;
                Global.getInstance().posiTime = Global.getInstance().serverTime;
                //
                if (this.playObj['info']['begin'] && this.playObj['info']['end']) {
                    this.pObj['isVod'] = H5Common.isVod = 1;
                    this.pObj['stime'] = H5Common.stime = this.playObj['info']['begin'];
                    this.pObj['etime'] = H5Common.etime = this.playObj['info']['end'];
                }
                Global.getInstance().pObj = this.pObj;
                skin.viewComponent.initChangeUI();
                this.viewComponent.playVideo();
                this.sendNotification(H5Notification.ADV_SETUP);
                //测试中使用
                /* let recomProxy = this.facade.retrieveProxy(H5RecomProxy.NAME);
				recomProxy.loadData(); */
                break;
            case H5Notification.VIDEO_TOGGLE:
                H5Common.isHandoff = 0;
                if (note.getBody()) {
                    afp.viewComponent.delAFP();
                    skin.viewComponent.reset();
                    if (Global.getInstance().playstate != 'stopped') {
                        this.viewComponent.stopVideo();
                    }
                    Global.getInstance().cid = note.getBody()['pl'] && PLDecode.getCid(note.getBody()['pl']) ? PLDecode.getCid(note.getBody()['pl']) : note.getBody()['cid'];
                    if (note.getBody()['isVod'] != undefined) {
                        H5Common.isVod = note.getBody()['isVod'];
                        if (H5Common.isVod) {
                            H5Common.stime = note.getBody()['stime'] || H5Common.stime;
                            H5Common.etime = note.getBody()['etime'] || H5Common.etime;
                        }
                    }
                    if (note.getBody()['link']) Global.getInstance().link = note.getBody()['link'];
                    if (note.getBody()['swf']) Global.getInstance().swf = note.getBody()['swf'];
                    this.pObj = {
                        'isVod': H5Common.isVod,
                        'stime': H5Common.stime,
                        'etime': H5Common.etime,
                        'cid'  : Global.getInstance().cid,
                        'swf'  : Global.getInstance().swf,
                        'link' : Global.getInstance().link,
                        'pl'   : note.getBody()['pl']
                    };
                    this.viewComponent.playVideo(this.pObj);
                } else {
                    this.viewComponent.toggleVideo();
                }
                break;
            case H5Notification.VIDEO_NEXT:
                this.viewComponent.videoAutoPlayNext = false;
                Global.debug('播放主动结束，进入下一段节目 ===>>>');
                this.viewComponent.nextExecute();
                break;
            case H5Notification.VIDEO_STOP:
                afp.viewComponent.delAFP();
                this.viewComponent.stopVideo();
                this.sendNotification(H5Notification.VIDEO_BIP, {
                                                                    'dt' : 'livestop'
                                                                });
                break;
            case H5Notification.PLAY_FAILED:
                Global.debug('异常错误代码  >>>>>  ', note.getBody());
                this.sendNotification(H5Notification.ERROR, H5Common.callCode.video[1]);
            	this.sendNotification(H5Notification.VIDEO_BIP, {
																		'dt' : 'er',
																		'data' : note.getBody()
																	});
                Global.postMessage(H5PlayerEvent.VIDEO_ONERROR, note.getBody());
                skin.viewComponent.showError(note.getBody()['errorcode']);
                break;
            case H5Notification.VIDEO_SWITCH:
                let tempFt = note.getBody()['ft'];
                if (tempFt == H5Common.ft) {
                    Global.debug('当前正播放此码流 ft  >>>>>  ', H5Common.ft, ' 无需切换...');
                    return;
                }
                // 非vip切换蓝光码流，需登录影视会员
                if (Global.getInstance().stream[tempFt]['vip'] == 1 && !VIPPrivilege.isVip) {
                    if (this.viewComponent.isFullscreen) this.viewComponent.fullscreenVideo(false);
                    Global.postMessage(H5PlayerEvent.VIDEO_ONNOTIFICATION, { 
                                                                                'header' : {
                                                                                    'type' : 'buyVip'
                                                                                },
                                                                                'body' : {
                                                                                    'data' : {
                                                                                        'cid' : Global.getInstance().cid,
                                                                                        'sectionId' : H5Common.sectionId,
                                                                                        'cp' : H5Common.sectionCp,
                                                                                        'aid': H5Common.NEW_1080P
                                                                                    }
                                                                                }
                                                                            });
                    return;
                }
                Global.getInstance().playData = this.videoData(this.playObj, tempFt);
                Global.getInstance().title = Global.getInstance().playData.title;
                H5Common.ft = tempFt;
                Global.getInstance().ip = Global.getInstance().playData.ip;
                Global.getInstance().bip.setValue('ft', H5Common.ft, false);
                Global.debug('正在切换码流 ft  >>>>>  ', H5Common.ft);
                Global.postMessage(H5PlayerEvent.VIDEO_ONSTREAM_CHANGED, {
                    'ft'     : H5Common.ft,
                    'rid'    : Global.getInstance().playData['kernal'].rid,
                    'bitrate': Global.getInstance().playData['kernal'].bitrate
                });
                this.viewComponent.switchVideo();
                skin.viewComponent.setFt();
                this.sendNotification(H5Notification.VIDEO_BIP, {
																		'dt' : 'livestop'
																	});
                break;
            case H5Notification.VIDEO_SCREEN:
                this.viewComponent.fullscreenVideo(note.getBody()['zoom']);
                break;
            case H5Notification.VIDEO_SEEK:
                //外部调用seekVideo接口判断处理
                if (note.getBody() && note.getBody()['seektime'] != undefined) {
                    this.viewComponent.seekVideo(Number(note.getBody()['seektime']));
                }
                break;
            case H5Notification.VIDEO_VOLUME:
                this.viewComponent.volume = note.getBody()['volume'];
                break;
            case H5Notification.VIDEO_COUNTDOWN:
                this.viewComponent.showCountdown(note.getBody());
                break;
            case H5Notification.VIDEO_USERINFO:
                this.viewComponent.setUserInfo();
                break;
            case H5Notification.VIDEO_PLAY:
                this.viewComponent.toggleVideo();
                break;
            case H5Notification.VIDEO_SHOW:
                // 当中插获取到数据时，仅锁定control，仍显示视频
                if (!(note.getBody()['event'] && note.getBody()['event'] == 'roll_lock')) {
                    this.viewComponent.enable = note.getBody()['enable'];
                }
                skin.viewComponent.enable = note.getBody()['enable'];
                H5Common.isSpaceKey = note.getBody()['enable'];
                if (note.getBody()['enable']) {
                    if (note.getBody()['type'] == 'pre-roll') {
                        skin.viewComponent.setFt();
                        skin.viewComponent.setPointAndTips();
                        if (H5Common.isVod || Global.getInstance().videoType == 1) {
                            this.viewComponent.playVideo();
                        }
                    } else if (note.getBody()['type'] == 'post-roll') {
                        skin.viewComponent.enable = false;
                        let recomProxy = this.facade.retrieveProxy(H5RecomProxy.NAME);
				        recomProxy.loadData();
                    } else if (note.getBody()['type'] == 'mid-roll') {
                        if (Global.getInstance().playstate == 'paused') {
                            this.viewComponent.playVideo();
                        }
                    }
                }
                break;
        }
    }
}