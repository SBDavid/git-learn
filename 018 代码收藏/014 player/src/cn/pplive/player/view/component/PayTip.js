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
import VIPPrivilege from "common/VIPPrivilege";
import H5PlayerEvent from "common/H5PlayerEvent";
import { H5CommonUtils } from "common/H5CommonUtils";
import H5ComponentEvent from "../event/H5ComponentEvent";

const titleClass = "w-pay-title";
const deadlineClass = "w-pay-deadline";
const contentClass = "w-pay-content";
const descClass = "w-pay-desc";
const errorClass = "w-pay-error";
const buttonClass = "w-pay-button";
const buyTicketClass = 'w-pay-buyticket';
const buyVipClass = 'w-pay-buyvip';
const buyMovieClass = 'w-pay-buymovie';
const playMovieClass = 'w-pay-play';
const buyXinYingClass = 'w-pay-xinying';
const privilegeClass = "w-pay-privilege";

export class PayTip extends UIComponent {

    constructor(container) {
        super();
        this.isTicket = false;
        this.isVipSport = false;
        this._dindex = 0;
        let payId = 'w-pay';
		if ($('#' + payId).length == 0) {
            this.payTip = $('<div/>', {
                'id' : payId
            });
            this.payTip.appendTo(container);
            let content = [
                `<div class="${contentClass}">`,
                    `<div class="${titleClass}" />`,
                    `<div class="${deadlineClass}" />`,
                    `<div class="${descClass}" />`,
                    `<div class="${buttonClass}" />`,
                    `<div class="${errorClass}" />`,
                `</div>`,
            ].join('');
            this.payTip.html(content);
        }
        this.target = this.payTip;
    }

    /**
     * 设置观赛券按钮内容
     */
    set buyTicketText(value) {
        this.setButtonDom(buyTicketClass, value);
    }
    /**
     * 设置开通会员按钮内容
     */
    set buyVipText(value) {
        this.setButtonDom(buyVipClass, value);
    }
    /**
     * 设置播放节目按钮内容
     */
    set playMovieText(value) {
        this.setButtonDom(playMovieClass, value);
    }
    /**
     * 设置单片购买按钮内容
     */
    set buyMovieText(value) {
        this.setButtonDom(buyMovieClass, value);
    }

    setButtonDom(domClass, value) {
        let target = $('.'+domClass);
        if (target.length == 0) {
            target = $('<a/>',{
                'class' : domClass,
            });
            target.appendTo($('.'+buttonClass));
        }
        target.html(value);
    }

    set errorText(value) {
        $('.'+errorClass).html(`<span style="font-size:18px">${value}</span>`);
    }

    set content(obj) {
        $('.'+buttonClass).empty();
        $('.'+errorClass).empty();
        $('.'+privilegeClass).remove();
        this.payTip.show();
        let now = new Date().valueOf(),
            price = 100000,
            minPrice = 10000;
        if (obj['info']) {
            let sellPolicy = obj['info']['sellPolicy'];
            if (sellPolicy && sellPolicy.length > 0) {
                let getSellPolicy = ()=>{
                    for (let item of obj['info']['sellPolicy']) {
                        if (item['type'] == 'use_sports_ticket' && item['sellType'] == 'use_sports_ticket') {
                            if (item.ticketNum > 0) {
                                this.buyTicketText = '使用' + item.ticketNum + '张观赛券观看';
                                $('.'+buyTicketClass).data('ticketNum', item.ticketNum);
                                this.isTicket = true;
                            }
                        }
                        if (item['type'] == 'buy_package' && item['sellType'] == 'sports') {
                            this.isVipSport = true;
                            this.buyVipText = '开通体育会员';
                        }
                        if (item['type'] == 'buy_vod') {
                            for (let its of item['priceList']) {
                                if (VIPPrivilege.vipMap.indexOf(its['vipType']) != -1) {
                                    if (its['price'] < price) price = its['price'];
                                }
                                if (its['price'] < minPrice) minPrice = its['price'];
                            }
                            if(price == 0 || price == 100000){
                                //没有取到相对应身份的值
                                this.errorText = '抱歉，付费信息获取失败，请刷新页面后再试';
                            } else {
                                if (minPrice != 0 && minPrice < price && VIPPrivilege.vipMap.indexOf('vip') == -1) {
                                    this.buyVipText = `开会员享${minPrice}元购买`;
                                }
                                this.buyMovieText = `${price}元购买`;
                            }
                        }                        
                        this.createPrivilegeMap();
                    }
                }
                if (obj.vt == 3) {
                    try {
                        if (obj['info']['vodBuyTime'] > 0) {
                            let validity = Math.floor(obj['info']['vodBuyTime'] / 3600);
                            $('.'+deadlineClass).html('单片购买后观看有效期: '+validity+'小时');
                        }
                        getSellPolicy();
                    } catch (error) {}
                } else {
                    try {
                        $('.'+deadlineClass).html('直播时间：'+obj['start']+' - '+obj['end']);
                    } catch (error) {}
                    if (now >= obj['info']['startBuyTime']*1000 && now <= obj['info']['endBuyTime']*1000) {
                        getSellPolicy();
                        if (H5Common.outLinkPay == 1 && H5Common.outLink) {
                            let xinyingA = $('<a/>',{
                                'class' : buyXinYingClass,
                                'href' : H5Common.outLink,
                                'target' : '_blank'
                            });
                            xinyingA.appendTo($('.'+buttonClass));
                            xinyingA.html('新英单场付费观看');
                        }
                    } else {
                        this.errorText = '很抱歉，本节目购买已结束，敬请期待后续精彩内容';
                    }
                }
                $('.'+buyTicketClass).on('click', (e)=>{
                    PayTip.sendMessage('usecoupon', {'ticketsCurrent' : $(e.target).data('ticketNum')});
                });
                $('.'+buyVipClass).on('click', (e)=>{
                    if (this.isVipSport) {
                        PayTip.sendMessage('openSportVip');
                    } else {
                        let tempPay = H5Common.payurl;
                        H5CommonUtils.getURL(tempPay.replace(/\[CID\]/g,  Global.getInstance().cid));
                    }
                });
                $('.'+buyMovieClass).on('click', (e)=>{
                    PayTip.sendMessage('buyVideo');
                });
            } else {
                this.errorText = '您已购过买本节目';
                this.playMovieText = '现在播放';
                $('.'+playMovieClass).on('click', (e)=>{
                    this.hide();
                    this.sendEvent('pay_play');
                });
            }
        } else {
            this.errorText = obj['errorcode'] && obj['errorcode'] == 108?'很抱歉，本节目购买已结束，敬请期待后续精彩内容':'抱歉，付费信息获取失败，请刷新页面后再试';
        }
        this.requestVipInfo();
        this.resize();
    }

    createPrivilegeMap() {
        if ($('.'+privilegeClass).length == 0) {
            $('.'+contentClass).append(`<div class="${privilegeClass}" />`);
        }
    }

    requestVipInfo() {
        let vipInfoUrl = H5Common.vipinfo, self = this;
        vipInfoUrl += `?type=0,1,2&format=jsonp`;
        if (Global.getInstance().videoType == 1) {
            vipInfoUrl += `&channelId=${Global.getInstance().cid}`;
        } else {
            vipInfoUrl += `&sectionid=${H5Common.sectionId}`;
        }
        $.ajax({
            dataType 	  : 'jsonp',
            type          : 'GET',
            cache         : true,
            jsonpCallback : 'getVipInfo',
            jsonp         : 'callback',
            timeout       : 10 * 1000,
            url           : vipInfoUrl,
            success       : function(data) {
                                /* data = {
                                    "root": {
                                        "total": 2,
                                        "pageNum": 1,
                                        "pageSize": 20,
                                        "list": [
                                            {
                                                "id": "5",
                                                "title": "体育高级会员",
                                                "type": "2",
                                                "rank": "0",
                                                "isPay": "1",
                                                "logo": "http://img.mip.pplive.cn/2017/07/04/15070336232.png",
                                                "cataId": "38",
                                                "description": "年会员送4K超高清机顶盒，详情见站内活动页！",
                                                "saleDescription": "",
                                                "isRelateTeam": "0"
                                            },
                                            {
                                                "id": "38",
                                                "title": "WWE摔跤娱乐会员",
                                                "type": "0",
                                                "rank": "0",
                                                "isPay": "1",
                                                "logo": "http://img.mip.pplive.cn/2017/08/09/16334698453.png",
                                                "cataId": "38",
                                                "description": "特惠:30元/月,全端畅享全部WWE赛事",
                                                "saleDescription": "包年更超值！平均每月{16.5元}畅享PPV付费赛事内容，更有NXT、205 Live、{女摔人生}等会员独享内容倾情奉献。",
                                                "isRelateTeam": "0"
                                            }
                                        ]
                                    }
                                } */
                                let titleArr = [];
                                for (let item of data.root.list){
                                    titleArr.push(`<a id="vip_${item.id}">${item.title}</a>`);
                                }
                                if (self.isTicket) {
                                    titleArr.push(`<a id="vip_ticket">用券</a>`);
                                }
                                $('.'+descClass).html(`<span>本场节目为</span>${titleArr.join(`<span style="color:#ffffff;">、</span>`)}<span>专享内容，请开通体育会员${self.isTicket?'或用券':''}或付费后观看</span>`);
                                $.each($('.'+descClass).find('a'), (index, item)=>{
                                    $(item).on('click', (e)=>{
                                        if ($(e.target).attr('id') == 'vip_ticket') {
                                            PayTip.sendMessage('usecoupon', {'ticketsCurrent' : $('.'+buyTicketClass).data('ticketNum')});
                                        } else {
                                            PayTip.sendMessage('openSportVip', {'packageId' : $(e.target).attr('id').split('_')[1]});
                                        }
                                    });
                                })
                                self.resize();
                                Global.debug('vip包信息请求返回数据 ==>> ', data);
                            },
                            //XMLHttpRequest 对象，错误信息，（可能）捕获的错误对象
            error		  : function(xhr, errorType, error) {
                                if (self._dindex < 2) {
                                    self._dindex++;
                                    self.requestVipInfo();
                                } else {
                                    Global.debug('vip包信息ajax请求错误：[' , xhr, '|' + errorType + ']', error);
                                }
                            }	
        });
    }

    /**
     * 付费事件通知
     * @param {*} type  类型   usecoupon: 观赛券  openSportVip: 开通会员  buyVideo: 单片购买
     * @param {*} rest  可能追加的通知对象参数
     */
    static sendMessage(type, ...rest) {
        let msgObj = [{
                        'type' : 'usecoupon', 
                        'data' : {
                            'type' : Global.getInstance().videoType == 1?1:2, //2是直播，1是点播
                        },
                    },{
                        'type' : 'openSportVip',
                        'data' : { }
                    },{
                        'type' : 'buyVideo',
                        'data' : { }
                    }].filter((item)=>{ return item['type'] === type })[0];
        let tempObj = {
            'sectionId' : H5Common.sectionId,
            'cid': Global.getInstance().cid,
            'cp' : H5Common.sectionCp
        };
        for (var item in rest) {
            $.extend(tempObj, rest[item]);
        }
        $.extend(msgObj['data'], tempObj);
        Global.postMessage(H5PlayerEvent.VIDEO_ONNOTIFICATION, { 
                                                                'header' : {
                                                                    'type' : msgObj['type']
                                                                },
                                                                'body' : {
                                                                    'data' : msgObj['data']
                                                                }
                                                            });
    }

    set title(obj) {
        // normal|center  启用"|"前位类  删除"|"后位类
        let type = obj.alignType.split('|');
        $('.'+titleClass).removeClass('w-pay-title-'+type[1]).addClass('w-pay-title-'+type[0]);
        $('.'+titleClass).html(obj.text);
    }

    resize() {
        try{
            let contentDom = this.payTip.children().eq(0);
            contentDom.css({
                'left' : Global.getInstance().pbox.width() - contentDom.width() >> 1,
                'top' : Global.getInstance().pbox.height() - contentDom.height() >> 1
            });
        }catch(e){}
    }

    hide() {
        try {
            this.payTip.hide();
        }catch(e){}
    }

}