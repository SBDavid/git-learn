/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

try {
    document.domain = 'pptv.com';
} catch (e) {};

import $ from 'jquery';
import Global from "manager/Global";
import FastClick from "../lib/fastclick";
import { H5Common } from "common/H5Common";
import { H5AppFacade } from "./H5AppFacade";

import './css/style-player.less';
(function($, win){
    var elems = $([]),
    jq_resize = $.resize = $.extend( $.resize, {} ),
    timeout_id,
    str_setTimeout = 'setTimeout',
    str_resize = 'resize',
    str_data = str_resize + '-special-event',
    str_delay = 'delay',
    str_throttle = 'throttleWindow';
    jq_resize[ str_delay ] = 250;
    jq_resize[ str_throttle ] = true;
    $.event.special[ str_resize ] = {
        setup: function() {
            if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }
            var elem = $(this);
            elems = elems.add( elem );
            $.data( this, str_data, { w: elem.width(), h: elem.height() } );
            if ( elems.length === 1 ) {
                loopy();
            }
        },
        teardown: function() {
            if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }
            var elem = $(this);
            elems = elems.not( elem );
            elem.removeData( str_data );
            if ( !elems.length ) {
                clearTimeout( timeout_id );
            }
        },
        add: function( handleObj ) {
            if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }
            var old_handler;
            function new_handler( e, w, h ) {
                var elem = $(this);
                $.data( this, str_data, { w: w ? w : elem.width(), h: h ? h : elem.height() } );
                old_handler.apply( this, arguments );
            };
            if ( $.isFunction( handleObj ) ) {
                old_handler = handleObj;
                return new_handler;
            } else {
                old_handler = handleObj.handler;
                handleObj.handler = new_handler;
            }
        }
    }

    function loopy() {
        timeout_id = window[ str_setTimeout ](function(){
        elems.each(function(){
            var elem = $(this),
            width = elem.width(),
            height = elem.height(),
            data = $.data( this, str_data );
            if ( width !== data['w'] || height !== data['h'] ) {
                elem.trigger( str_resize, [ data['w'] = width, data['h'] = height ] );
            }
        });
        loopy();
        }, jq_resize[ str_delay ] );
    }

})($, window);

class H5Player {

    constructor(cfg, pid) {
        let defaultcfg = {
            "ap": 1, // 是否自动播放，默认自动播放,
            "w": '100%', //默认100%
            "h": '100%' //默认100%
        };
        $.extend(cfg, defaultcfg);
        Global.getInstance().isMobile = H5Common.mobileRegExp.test(navigator.userAgent);
        if (Global.getInstance().isMobile) this.rem();
        this.player = H5AppFacade.getInstance(H5AppFacade.NAME);
        this.player.startup(cfg, pid);
    }

    rem() {
        //新增CSS rem支持
        (function(designW, G) {
            let docEl = document.documentElement;
            G.recalc = function() {
                let clientWidth = docEl.clientWidth;
                if (!clientWidth) return;
                docEl.style.fontSize = 100 * (clientWidth / designW) + 'px';
                FastClick.attach(document.body);
            }
            recalc();
            document.addEventListener('DOMContentLoaded', recalc, false);
        })(750, window);
    }

    setCtx(ctx) {
        Global.debug('接口 setCtx 被执行 ==>> ', ctx);
        this.player.setCtx(ctx);
    }

    setCallback(type, obj) {
        Global.debug('接口 setCallback 被执行 ==>> ', arguments);
        if (type == 'theatre') {
            this.player.expandMode = obj['body']['data']['mode'];
        } else if (type == 'userinfo') {
            this.player.setUserInfo();
        }
    }

    playVideo(obj) {
        Global.debug('接口 playVideo 被执行 ==>> ', obj);
        this.player.playVideo(obj);
    }

    pauseVideo() {
        Global.debug('接口 pauseVideo 被执行 ==>>');
        this.player.pauseVideo();
    }

    stopVideo() {
        Global.debug('接口 stopVideo 被执行 ==>>');
        H5Common.isHandoff = 1;
        this.player.stopVideo();
    }

    seekVideo(time) {
        Global.debug('接口 seekVideo 被执行 ==>> ', time);
        this.player.seekVideo(time);
    }

    switchVideo(ft) {
        Global.debug('接口 switchVideo 被执行 ==>> ', ft);
        this.player.switchVideo(ft);
    }

    manualPlay() {
        Global.debug('接口 manualPlay 被执行 ==>> ');
        this.player.manualPlay();
    }

    set volume(vol) {
        Global.debug('设置音量被执行 ==>> ', vol);
        this.player.volume = vol;
    }

    get volume() {
        Global.debug('接口 volume 被执行 ==>>');
        return this.player.volume;
    }

    get playTime() {
        return this.player.playTime;
    }

    get duration() {
        return this.player.duration;
    }

    get version() {
        Global.debug('接口 version 被执行 ==>>');
        return this.player.version;
    }

    get playState() {
        Global.debug('接口 playState 被执行 ==>>');
        return this.player.playState;
    }

    get shareDisable() {
        Global.debug('接口 shareDisable 被执行 ==>>');
        return H5Common.shareDisable;
    }

    set isSport(value) {
        Global.debug('接口 isSport 被执行 ==>> ',value);
        H5Common.isSport = value;
    }
}

if (!window.ppliveplayer) window.ppliveplayer = {};
window.ppliveplayer.H5Player = H5Player;

export function WinH5Player() {
    return ppliveplayer.H5Player;
}