/**
 * ...
 * @author chunbolv@pptv.com
 */

'use strict';

try {
    document.domain = 'pptv.com';
} catch (e) {};

import $ from 'jquery';
import {ShowBarrage} from "barrage/showBarrage";
import {BarrageWebsocket} from 'barrage/barrageWebsocket';


window.$ = $;

const win = window;

class Barrage {

    constructor() {
        this.ws = null;
        this.showBarrage = null;
        this.option = {};
    }

    init(opt) {
        let domStr = `<canvas width=${opt.width} height=${opt.height} id="canvas_danmu"></canvas>`;
        let self = this;
        this.option = opt;
        $(opt.dom).append(domStr);
        this.showBarrage = new ShowBarrage();
        this.showBarrage.init({
            speed: 1,
            fontSize: opt.fontSize || '30px',
            fontFamily: opt.fontFamily || 'serif',
            dom: $("#canvas_danmu"),
            txt: 'content'
        });
        switch(opt.type) {
            case 'live':
                this.ws = new BarrageWebsocket({
                    sub: opt.sub,
                    postUrl: opt.postUrl,
                    onReady:function () {
                        console.log('Ready');
                        this.open(opt.sub);
                    },
                    onopen:function () {
                        console.log('连接成功');
                    },
                    onmessage:function (message) {
                        console.log('返回消息  ',message);
                        if(message.msg) {
                            let arr = [message.msg[0]];
                            console.log(arr)
                            self.showBarrage.reload(arr);
                        }
                    },
                    onclose:function () {
                        console.log('连接关闭');
                        this.ws = null;
                    }
                });
                //this.ws.open(this.ws.subscribe(opt.sub));
                //setTimeout(() => {
                //    this.ws.subscribe(opt.sub);
                //    console.log('订阅')
                //},5 * 1000)
                break;
            case 'vod':
                break;
        }
    }

    sendMsg(message) {
        switch(this.option.type) {
            case 'live':
                if(this.ws) {
                    this.ws.sendMsg(message);
                }
                break;
            case 'vod':
                break;
        }
    }

    pause() {
        if(this.showBarrage) {
            this.showBarrage.pauseFun();
        }
    }

    resize(opt) {
        if(this.showBarrage) {
            $('#canvas_danmu')[0].width = opt.width;
            $('#canvas_danmu')[0].height = opt.height;
            this.showBarrage.resize();
        }
    }

    close() {
        this.ws = this.showBarrage = null;
        console.log('==== 弹幕已关闭 ====');
    }


}
win.Barrage = function(opt) {
    return new Barrage(opt);
};