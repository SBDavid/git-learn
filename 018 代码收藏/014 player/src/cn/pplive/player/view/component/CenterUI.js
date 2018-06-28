/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import $ from 'jquery';
import Global from "manager/Global";
import { CommonUI } from "./CommonUI";
import { H5Common } from "common/H5Common";
import { UIComponent } from "./UIComponent";
import { H5CommonUtils } from "common/H5CommonUtils";
import H5ComponentEvent from "../event/H5ComponentEvent";
import { PcPlayerComponent } from "../pc/component/PcPlayerComponent"
import Clipboard from 'clipboard';

const posiClass = 'w-pre-posi';
const sliderClass = 'w-pre-slider';
const startDragClass = 'w-pre-start-drag';
const endDragClass = 'w-pre-end-drag';
const endClass = 'w-pre-end';
const startClass = 'w-pre-start';
const playerClass = 'w-pre-player';
const iconClass = 'w-share-icon';
const copyClass = 'w-share-copy';
const titleClass = "w-center-title";
const closeClass = "w-center-close";
const contentClass = "w-center-content";
const showCopyTxtClass = "w-copy-txt";
const copyBtnClass = "w-copy-btn";
const shareUrl = '//api2.v.pptv.com/api/openapi/playershare.js?app=[APP]&link=[LINK]&title=[TITLE]';

export class CenterUI extends UIComponent {

    constructor(container) {
        super();
        let centerId = 'w-center';
		if ($('#' + centerId).length == 0) {
            this.cenTip = $('<div/>', {
                'id' : centerId
            });
            this.cenTip.appendTo(container);
            let content = [
                `<div class="${titleClass}" />`,
                `<div class="${closeClass}">X</div>`,
                `<div class="${contentClass}" />`
            ].join('');
            this.cenTip.html(content);
            this.cenTip.find('.'+closeClass).on('click', (e)=>{
                if (this.kernal) {
                    this.kernal.close();
                    this.kernal = null;
                }
                this.container.html('');
                this.hide();
                this.sendEvent('center_close');
            })
        }
        this.target = this.cenTip;
    }

    updatePosition(target, x) {
        let tempLeft = x-parseInt(this.cenTip.css('margin-left')) - this.minLeft;
        let currTime = (()=>{
            let temp = this.timeObj['start'] + tempLeft / $('.'+sliderClass).width() * (this.timeObj['end'] - this.timeObj['start']);
            temp = temp >> 0;
            temp -= temp % Global.getInstance().playData.interval;
            return temp;
        })();
        if (target[0] == $('.'+startDragClass)[0]) {
            if (tempLeft < 0) tempLeft = 0;
            if (tempLeft > parseInt($('.'+endDragClass).css('margin-left')) - 10) tempLeft = parseInt($('.'+endDragClass).css('margin-left')) - 10;
            target.css('margin-left', tempLeft);
            $('.'+startClass).html(H5CommonUtils.timeFormat(currTime, true, true));
        }
        if (target[0] == $('.'+endDragClass)[0]) {
            if (tempLeft < parseInt($('.'+startDragClass).css('margin-left')) + 10) tempLeft = parseInt($('.'+startDragClass).css('margin-left')) + 10;
            if (tempLeft > $('.'+sliderClass).width()) tempLeft = $('.'+sliderClass).width();
            target.css('margin-left', tempLeft);
            $('.'+endClass).html(H5CommonUtils.timeFormat(currTime, true, true));
        }
        $('.'+posiClass).css('margin-left', $('.'+startDragClass).css('margin-left'));
        $('.'+posiClass).css('width', parseInt($('.'+endDragClass).css('margin-left')) - parseInt($('.'+startDragClass).css('margin-left')));
        return currTime;
    }

    addPlayer() {
        if (this.kernal) {
			this.kernal.close();
			this.kernal = null;
        }
        this.player = $('.'+playerClass)[0];
        this.kernal = PcPlayerComponent.createKernal(Global.getInstance().pObj, this.player);
        this.timeObj = {
            'start': H5Common.isVod ? H5Common.stime : (Global.getInstance().startTime - H5Common.backdur),
            'end'  : H5Common.isVod ? H5Common.etime : Global.getInstance().startTime
        }
        this.timeObj['start'] -= this.timeObj['start'] % Global.getInstance().playData.interval;
        this.timeObj['end'] -= this.timeObj['end'] % Global.getInstance().playData.interval;
        this.stime = this.timeObj['start'];
        this.etime = this.timeObj['end'];
        if (H5Common.isVod) this.kernal.seekVideo(this.stime);
        $('.'+startClass).html(H5CommonUtils.timeFormat(this.timeObj['start'], true, true));
        $('.'+endClass).html(H5CommonUtils.timeFormat(this.timeObj['end'], true, true));
        this.minLeft = $('.'+sliderClass).position().left;
        $('.'+startDragClass).on('mousedown',(e)=>{
            e.preventDefault();
            this.isStartTouching = true;
        });
        $('.'+endDragClass).on('mousedown',(e)=>{
            e.preventDefault();
            this.isEndTouching = true;
        });
        $(document).on('mousemove',(e)=>{
            e.preventDefault();
            if (this.isStartTouching) {
                this.currTime = this.stime = this.updatePosition($('.'+startDragClass), e.clientX);
            }
            if (this.isEndTouching) {
                this.currTime = this.etime = this.updatePosition($('.'+endDragClass), e.clientX);
            }
        });
        $(document).on('mouseup',(e)=>{
            e.preventDefault();
            this.isStartTouching = false;
            this.isEndTouching = false;
            if (this.kernal && e.target.className == 'drag') {
                this.kernal.seekVideo(this.currTime);
            }
        });
    }

    setData_share() {
        this.cenTip.show();
        this.title = '分享';
        let content;
        if (Global.getInstance().videoType == 1) {
            content = [
                '<div style="float: left;width: 320px;">',
                    '<div class="'+iconClass+'" />',
                    '<div class="'+copyClass+'" />',
                '</div>',
                '<div style="float: left;width: 310px;margin-top: 25px;">',
                    '<div class="'+showCopyTxtClass+'"><span></span></div>',
                    '<div class="'+copyBtnClass+'">复制</div>',
                '</div>'
            ].join('');
        } else {
            content = [
                '<div class="w-pre-video">',
                    '<video class="'+playerClass+'" width="100%" height="100%">您的浏览器不支持HTML5，无法观看我们提供的视频！建议使用高版本浏览器观看，谢谢！</video>',
                '</div>',
                '<div style="float: right;width: 100px;">',
                    '<div class="'+iconClass+'" />',
                    '<div class="'+copyClass+'" />',
                '</div>',
                '<div class="'+sliderClass+'">',
                    '<div class="'+posiClass+'" />',
                    '<div class="'+startDragClass+'" >',
                        '<div class="drag"/>',
                    '</div>',
                    '<div class="'+endDragClass+'" >',
                        '<div class="drag"/>',
                    '</div>',
                    '<span class="'+startClass+'">开始：00:00:00</span>',
                    '<span class="'+endClass+'">结束：00:00:00</span>',
                '</div>'
            ].join('');
        }
        this.container.html(content);
        [{'icon':'ico_14.png', 'app':'qq'},
         {'icon':'ico_02.png', 'app':'qzone'},
         {'icon':'ico_01.png', 'app':'weibo'},
         {'icon':'ico_10.png', 'app':'douban'},
         {'icon':'ico_15.png', 'app':'baidu'}].forEach((item)=>{
            let temp_share_url = shareUrl;
            temp_share_url = temp_share_url.replace(/\[APP\]/g, item['app']).replace(/\[LINK\]/g, Global.getInstance().link).replace(/\[TITLE\]/g, Global.getInstance().title);
            let newI = $('<a href="'+temp_share_url+'" target="_blank"><i/></a>');
            newI.appendTo($('.'+iconClass));
            newI.find('i').css({'background' : 'url(//static1.pplive.cn/public/share/120215/'+item['icon']+')'});
        });
        let currSelect;
        [{'content':'复制视频地址', 'copytxt':Global.getInstance().link},
        {'content':'复制Flash地址', 'copytxt':Global.getInstance().swf},
        {'content':'复制HTML代码', 'copytxt':'<embed src="'+Global.getInstance().swf+'" quality="high" width="480" height="302" bgcolor="#000" align="middle" allowScriptAccess="always" allownetworking="all" allowfullscreen="true" type="application/x-shockwave-flash" wmode="direct" />'}].forEach((item, index)=>{
            let newA = Global.getInstance().videoType == 1 ? $('<a class="copybtn_'+index+' vod"><span></span>'+item['content']+'</a>') : $('<a class="copybtn_'+index+' live">>'+item['content']+'</a>');
            newA.appendTo($('.'+copyClass));
            if (index == 0) {
                currSelect = newA.find('span');
                currSelect.addClass('select');
                $('.'+showCopyTxtClass).find('span').text(item['copytxt']);
            }
            newA.on('click', (e)=>{
                if (Global.getInstance().videoType == 1) {
                    currSelect.removeClass('select');
                    currSelect = $(e.target).find('span');
                    currSelect.addClass('select');
                    $('.'+showCopyTxtClass).find('span').text(item['copytxt']);
                    $('.'+copyBtnClass).on('click', (e)=>{
                        new Clipboard('.'+copyBtnClass, {
                            text : () => {
                                let link = item['copytxt'];
                                return link;
                            }
                        }).on('success', function(e) {
                            $('.'+showCopyTxtClass).find('span').text('复制成功！请按CTRL+V复制给你的好友！');
                            setTimeout(()=>{
                                $('.'+showCopyTxtClass).find('span').text(item['copytxt']);
                            }, 1 * 1000);
                        });
                    });
                } else {
                    let target = e.target;
                    new Clipboard('.copybtn_'+index, {
                        text : () => {
                            let link = item['copytxt'];
                            if (index == 0) link += ((link.indexOf('?') > 0)?'&':'?') + 'stime=' + this.stime + '&etime=' + this.etime;
                            return link;
                        }
                    }).on('success', function(e) {
                        $(target).html('复制成功！');
                        setTimeout(()=>{
                            $(target).html('>'+item['content']);
                        }, 1 * 1000);
                    });
                }
            });
        });
        if (Global.getInstance().videoType != 1) this.addPlayer();
    }

    setData_qrcode() {
        this.cenTip.show();
        this.title = '扫二维码，用手机看视频';
        this.content = [
            '<div class="w-content-qrcode">',
                '<i/>',
                '<img src="//api.qrcode.pptv.com/index.php?value=' + encodeURIComponent(Global.getInstance().link) + '"/>',
            '</div>',
            '<div style="float: right;width: 135px;">',
                '<div style="line-height: 24px;color: #9b999b;">',
                    '<span>立即用手机扫描左侧二维码在手机上继续观看视频</span>',
                '</div>',
                '<div style="font-size: 12px;margin-top: 25px;">',
                    '<a href="//app.pptv.com/pg_get_aph/" target="_blank">>立即安装PP视频APP</a>',
                '</div>',
            '</div>'
        ]
        this.container.html(this.content.join(''));
    }

    get container() {
        return $('.'+contentClass);
    }

    set title(value) {
        $('.'+titleClass).html(value);
    }

    hide() {
        this.cenTip.hide();
    }

}