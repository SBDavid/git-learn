/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import $ from 'jquery';
import puremvc from "puremvc";
import Global from "manager/Global";
import CTXQuery from "manager/CTXQuery";
import { PLDecode } from "crypto/PLDecode";
import H5Notification from "common/H5Notification";
import H5PlayerEvent from "common/H5PlayerEvent";
import { H5Common } from "common/H5Common";
import VIPPrivilege from 'common/VIPPrivilege';
import { H5CommonUtils } from "common/H5CommonUtils";
import { CommonUI } from "view/component/CommonUI";
import { H5StartupCommand } from "controller/H5StartupCommand";

export class H5AppFacade extends puremvc.Facade {

    static NAME = 'h5app_facade';
		
    static getInstance(multitonKey) {
        let instanceMap = puremvc.Facade.instanceMap;
        let instance = instanceMap[multitonKey];
        if (instance) return instance;
        return instanceMap[multitonKey] = new H5AppFacade(multitonKey);
    }

    startup(cfg, pid) {
        //获取承载容器
        if (pid != 'pplive-player') {
            let conid = 'pplive-player';
            if ($('#' + conid).length == 0) {
                $('#' + pid).empty();
                $('<div/>', {
                    'id' : conid,
                    'class' : conid
                }).appendTo($('#' + pid));
            }
            Global.getInstance().pbox = $('#' + conid);
        } else {
            Global.getInstance().pbox = $('#' + pid);
        }
        Global.debug('启动播放器 v' + H5Common.version() + ' 所需承载容器 ===>>> ', pid, ' 配置信息 : ', cfg);
        //合并对象至puremvc域下
        $.extend(true, Global.getInstance(), H5Common.defaultCFG, cfg);
        Global.getInstance().cid = Global.getInstance().id;
        delete Global.getInstance().id;
        Global.getInstance().videoType = Global.getInstance().videoType == 'vod' ? 1 : 10;
        //
        this.setCtx(Global.getInstance().ctx);
        Global.getInstance().islumia = navigator.userAgent.match(/Windows Phone/i); //lumia不支持ts
        Global.getInstance().loadType = Global.getInstance().isMobile ? ((Global.getInstance().islumia || H5CommonUtils.getQueryString('debug') == 'ikan') ? 'mpptv.wp' : 'mpptv') : 'mhpptv';
        if (Global.getInstance().isMobile) {
            Global.getInstance().adConfig.plat = 'mbs';
        }
        //播放限时白名单
        Global.getInstance().whitelist = window.whitelist || [];
        if (!Global.getInstance().cid || Global.getInstance().pbox.length == 0) {
            CommonUI.initError();
            return;
        }
        Global.debug('Global.getInstance().adConfig 对象挂载相关属性 ===>>> ', Global.getInstance().adConfig);
        //Startup播放器
        if (!this.initialized) {
            this.initialized = true;
            Global.debug('正式启动播放器 ......');
            Global.postMessage(H5PlayerEvent.VIDEO_ONINIT);
            setTimeout(()=>{
                if (CTXQuery.contain('stime')) H5Common.stime = Number(CTXQuery.getAttr('stime'));
                if (CTXQuery.contain('etime')) H5Common.etime = Number(CTXQuery.getAttr('etime'));
                Global.postMessage(H5PlayerEvent.VIDEO_ONPLAYSTATE_CHANGED, '1');
                this.registerCommand(H5Notification.START_UP, H5StartupCommand);
                this.sendNotification(H5Notification.START_UP);
            }, 0);
        }
    }

    setUserInfo() {
        this.sendNotification(H5Notification.VIDEO_USERINFO);
        if (H5Common.playJson) {
            if (Global.getInstance().pt == 1) {
                if (this.inter) clearTimeout(this.inter);
                this.inter = setTimeout(() => {
                    this.sendNotification(H5Notification.VIDEO_TOGGLE, Global.getInstance().pObj);
                }, 10);
            }
            if (VIPPrivilege.isVip) {
                VIPPrivilege.isNoad = true;
                this.sendNotification(H5Notification.ADV_ROLL_DELETE);
            }
        }
    }
    
    setCtx(ctx) {
        // 若querystring 整体encode过，则要先行decode
        if (!ctx.match(/[^\&?]+=[^\&?]+/g)) ctx = decodeURIComponent(ctx);
        CTXQuery.setCTX(ctx);
        if (CTXQuery.contain('stime')) H5Common.stime = Number(CTXQuery.getAttr('stime'));
        if (CTXQuery.contain('etime')) H5Common.etime = Number(CTXQuery.getAttr('etime'));
        CTXQuery.setAttr('pageUrl', encodeURIComponent(Global.getInstance().pageUrl ? decodeURIComponent(Global.getInstance().pageUrl) : window.top.location.href));
        CTXQuery.setAttr('referrer', encodeURIComponent(Global.getInstance().pageRefer ? decodeURIComponent(Global.getInstance().pageRefer) : document.referrer));
        Global.getInstance().adConfig.ctx = CTXQuery.cctx;
        Global.getInstance().adConfig.sid = Global.getInstance().cid;
        Global.getInstance().adConfig.chid = Global.getInstance().cid;
        //序列化为ctx对象
        Global.getInstance().ctx = H5CommonUtils.queryToObject(CTXQuery.cctx) || {};
        if (!Global.getInstance().ctx.o) Global.getInstance().ctx.o = -1;
        Global.getInstance().pageRefer= Global.getInstance().ctx.referrer;
        Global.getInstance().isSkin = Global.getInstance().ctx.isSkin ? Boolean(parseInt(Global.getInstance().ctx.isSkin)) : true;
        Global.getInstance().isVipMovie = Global.getInstance().ctx.isVipMovie ? Boolean(parseInt(Global.getInstance().ctx.isVipMovie)) : false;
        Global.getInstance().ss = Global.getInstance().ctx.msiteSourceSite && Global.getInstance().ctx.msiteSourceSite.length > 0 ? Global.getInstance().ctx.msiteSourceSite : -1;
        //封面图支持外部ctx中的poster设置
        Global.getInstance().poster = Global.getInstance().ctx.poster != undefined && Global.getInstance().ctx.poster.length > 0 ? Global.getInstance().ctx.poster : Global.getInstance().poster.replace(/\[CHANNELID\]/g, Global.getInstance().cid);
        Global.getInstance().autoplay = Global.getInstance().ctx.autoplay != undefined ? Global.getInstance().ctx.autoplay : 0;
        //封面图和视频支持满屏或等比例缩放
        Global.getInstance().isfull = Global.getInstance().ctx.isfull != undefined ? Number(Global.getInstance().ctx.isfull) : 0;
        //视频真实时长
        Global.getInstance().totalDuration = Global.getInstance().ctx.duration != undefined ? Global.getInstance().ctx.duration : 0;
    }

    playVideo(obj) {
    	this.sendNotification(H5Notification.VIDEO_TOGGLE, obj);
    }

    pauseVideo() {
        this.sendNotification(H5Notification.VIDEO_TOGGLE);
    }

    stopVideo() {
        this.sendNotification(H5Notification.VIDEO_STOP);
    }

    seekVideo(time) {
        this.sendNotification(H5Notification.VIDEO_SEEK, {
            'seektime': time
        });
    }

    switchVideo(ft) {
        this.sendNotification(H5Notification.VIDEO_SWITCH, {
            'ft': ft
        });
    }

    manualPlay() {
        this.sendNotification(H5Notification.VIDEO_STANDBY);
    }

    set expandMode(mode) {
        this.sendNotification(H5Notification.VIDEO_EXPAND, {
            'mode': mode
        });
    }

    set volume(vol) {
        this.sendNotification(H5Notification.VIDEO_VOLUME, {
            'volume': vol
        });
    }

    get volume() {
        return H5Common.currVolume;
    }

    get playTime() {
        return Global.getInstance().posiTime;
    }

    get duration() {
        return Global.getInstance().playData['duration'];
    }

    get version() {
        return H5Common.version();
    }

    get playState() {
        return Global.getInstance().playstate;
    }
}