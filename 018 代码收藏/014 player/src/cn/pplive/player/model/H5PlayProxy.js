/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import $ from 'jquery';
import puremvc from "puremvc";
import Global from "manager/Global";
import { H5Common } from "common/H5Common";
import H5Notification from "common/H5Notification";
import { H5CommonUtils } from "common/H5CommonUtils";
import { H5Crypto as pptvH5Crypto } from "crypto/H5Crypto";
import BIPCommon from "../bip/BIPCommon";

export class H5PlayProxy extends puremvc.Proxy {

	static NAME = 'h5_play_proxy';

	set dindex(value) {
		this._dindex = value;
	}

	constructor(name) {
		super(name);
		this._dindex = 0;
	}

	loadData() {
		let playUrl, codeObj, queryString = '';
		let $p = ['stps', 'ttps', 'ttpe'][this._dindex];
		Global.getInstance().ftps = +new Date();		
		Global.getInstance().ctx.rcc_id = Global.getInstance().ctx.o;
		queryString = '&' + $.param(Global.getInstance().ctx);
		//Global.getInstance().cid = '3003840';//某付费直播节目
		//测试使用该域名http://webapi.h5.ppqa.com/
		if(H5CommonUtils.getQueryString("h5cryopt")){//测试防盗链加入该参数
			playUrl = '//webapi.h5.ppqa.com/webplay3-0-' + Global.getInstance().cid + '.xml?version=6&type=' + Global.getInstance().loadType + queryString + '&appplt=wap&appid=pptv.wap&appver=' + H5Common.version();
		}else {
			playUrl = H5Common.playDomain[this._dindex] + '/webplay3-0-' + Global.getInstance().cid + '.xml';
			playUrl += '?version=6';
			playUrl += '&type=' + Global.getInstance().loadType + queryString;
			playUrl += '&appver=' + H5Common.version();
			if (Global.getInstance().isMobile) {
				playUrl += '&appplt=wap';
				playUrl += '&appid=pptv.wap';
			} else {
				playUrl += '&appplt=web';
				playUrl += '&appid=pptv.web.h5';
			}
		}
		if(Global.getInstance().userInfo && Global.getInstance().userInfo.uid) {
		    playUrl += '&token=' + encodeURIComponent(Global.getInstance().userInfo.token);
		    playUrl += '&username=' + encodeURIComponent(Global.getInstance().userInfo.uid);
		}
		playUrl += '&vvid=' + Global.getInstance().bip.vvid;
		playUrl += '&nddp=1';//ddp策略
		//判断是否在微信中观看视频
		let $from_ua;
		if (/MicroMessenger/i.test(navigator.userAgent)) {
			$from_ua = 'weixin';
		}
        if($from_ua) playUrl += '&from_ua=' + $from_ua;
		//签名
		let key = pptvH5Crypto.SC_KEY;
		let uu = Global.getInstance().ctx.kk || "";//scver=1 ,与密钥相对应 
		let signObj = pptvH5Crypto.getSignature(uu, key);
		Global.debug('签名地址 随机数  >>>>> ', signObj.random);
		Global.debug('签名地址 签名  >>>>> ', signObj.sign);
		if(signObj && signObj.sign && signObj.random){
			playUrl += "&scver=1&scRandom="+signObj.random+"&scSignature="+signObj.sign;
		}
		Global.debug('开始 webplay 请求  >>>>> ', playUrl);
		Global.getInstance().playUrl = playUrl;
		if(this._dindex == 0)  this.sendNotification(H5Notification.START_RECORD, {'target' : BIPCommon.DTT});
		$.ajax({
				dataType 	  : 'jsonp',
				type          : 'GET',
				cache         : true,
				jsonpCallback : 'getPlayEncode',
				jsonp         : 'cb',
				timeout       : 15 * 1000,
				url           : playUrl,
				success       : (data)=>{
									/***** 测试数据 开始 *****/
									/* data.childNodes.unshift({tagName: "error", code: 216, msg: "用户名为空"});
									for(let info of data.childNodes) {
										if (info.tagName == 'channel') {
											info.sectionId = '132988';
											info.sectionTitle = '西甲第19轮 埃瓦尔vs马德里竞技';
										}
									}
									data.childNodes.unshift({"tagName":"lang","childNodes":[{"tagName":"start","childNodes":["2018-01-14 01:30:00"]},{"tagName":"end","childNodes":["2018-01-14 03:40:00"]},{"id":0,"title":"直播","tagName":"item","cId":300384}]}); */
									/***** 测试数据 结束 *****/
									Global.debug('play返回数据 ==>> ', data);
									Global.getInstance()[$p] = +new Date();		
									H5Common.playJson = data;
									this.sendNotification(H5Notification.PLAY_COMPLETE, data);
									this.sendNotification(H5Notification.STOP_RECORD, {'target' : BIPCommon.DTT});
								},
								//XMLHttpRequest 对象，错误信息，（可能）捕获的错误对象
				error		  : (xhr, errorType, error)=>{
									Global.getInstance()[$p] = +new Date();	
									if (this._dindex < H5Common.playDomain.length - 1) {
										this._dindex++;
										this.loadData();
									} else {
										codeObj = {
											'errorcode'  : H5Common.callCode.play[1],
											'msg': 'play请求错误'
										}
										this.sendNotification(H5Notification.VIDEO_BIP, {
																							'dt' : 'er',
																							'data' : codeObj
																						});
										Global.debug('ajax的play请求错误：[' , xhr, '|' + errorType + ']', error);
										this.sendNotification(H5Notification.PLAY_FAILED, codeObj);
										this.sendNotification(H5Notification.STOP_RECORD, {'target' : BIPCommon.DTT});
									}
								}	
		});
	}
}