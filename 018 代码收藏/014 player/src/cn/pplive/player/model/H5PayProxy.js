/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import $ from 'jquery';
import puremvc from "puremvc";
import Global from "manager/Global";
import { H5Common } from "common/H5Common";
import { PayTip } from "view/component/PayTip";
import H5Notification from "common/H5Notification";
import { H5CommonUtils } from "common/H5CommonUtils";
import H5PlayerEvent from "common/H5PlayerEvent";
import VIPPrivilege from "common/VIPPrivilege";
import TipsManager from "manager/TipsManager";


export class H5PayProxy extends puremvc.Proxy {

	static NAME = 'h5_pay_proxy';

	set dindex(value) {
		this._dindex = value;
	}

	constructor(name) {
		super(name);
		this._dindex = 0;
	}

	loadData(vt) {
		let payUrl = H5Common.priceinfo, codeObj;
		if (vt == 3) {
			// 需要用cid、用户名和token请求DDP的点播节目价格策略接口
			payUrl += '/vod';
			payUrl += `?channelid=${Global.getInstance().cid}`;
		} else {
			// 需要用返回的sectionid、用户名和token请求DDP的直播节目价格策略接口   （channelid&liveStartTime和sectionId两者必选其一）
			payUrl += '/live';
			if (H5Common.sectionId == 0) {
				payUrl += `?channelid=${Global.getInstance().cid}&liveStartTime=${H5Common.paystime}`;
			} else {
				payUrl += `?sectionid=${H5Common.sectionId}`;
			}
		}
		if (Global.getInstance().userInfo && Global.getInstance().userInfo.uid) {
		    payUrl += '&token=' + encodeURIComponent(Global.getInstance().userInfo.token);
		    payUrl += '&username=' + encodeURIComponent(Global.getInstance().userInfo.uid);
		}
		payUrl += '&appver=' + H5Common.version();
		payUrl += '&appplt=web';
		payUrl += '&appid=pptv.web.h5';
		payUrl += '&format=jsonp';
		Global.debug('开始付费价格策略请求  >>>>> ', payUrl);
		$.ajax({
				dataType 	  : 'jsonp',
				type          : 'GET',
				cache         : true,
				jsonpCallback : 'getPay',
				jsonp         : 'cb',
				timeout       : 10 * 1000,
				url           : payUrl,
				success       : (data) => {
									/* data = {
										"message": "success",                  // 出错信息
										"vodPriceInfo": {                     // 直播价格信息  
											"sectionId": 107325,               // 节目id 
											"title": "风云游戏直播",            // 标题  
											"shareStatus": 0,                  // 能否赠片 0：可赠 1：不可赠 
											"ticketStatus": 1,                 // 观影券是否可用 0可用 1不可用 
											"vodBuyTime": 600000,              // 购买时长
											"cataId" : 2,					   // 1 : 影视 2 : 体育
											"sellPolicy": [                    // 购买策略 
												{                 
													"type": "buy_package",         // 价格类型（包括四种：开通会员：buy_vip，使用观影券：use_ticket，购买单片：buy_vod;购买付费包:buy_package（包） 
													"sellType": "sports",        // 使用观影券：use_ticket(影视会员观影劵),use_sports_ticket(体育观赛券)，购买单片：buy_vod，会员类型：svip,vip,购买包：buy_package，sports（体育赛事包） 
													"priceList": []             
												},
												{                 
													"type": "buy_vod",      
													"sellType": "buy_vod",      
													"priceList": [             // 价格列表 
														{          
															"productId": "",   // IOS产品ID（只有平台是IOS端时才有相应的值，其他平台的productId值为空字符串）    
															"vipType": "vip",  // 会员类型（具体会员类型） 影视会员分类：mvip：移动专享会员，vip普通会员，svip超级会员       
															"price": 5         // 价格 
														},       
														{          
															"productId": "",     
															"vipType": "novip",    
															"price": 20  
														}    
													]    
												}  
											]   
										},     
										"errorcode": "0"   // 错误码，0表示成功，非0表示出错
									} */
									/* data = {    
										"message": "success",    
										"errorcode": "108"   // 错误码，0表示成功，非0表示出错
									} */
									Global.debug('付费价格策略返回数据 ==>> ', data);
									data.vt = vt;
									H5Common.paydata = data;
									if (data.vt == 3) {
										Global.postMessage(H5PlayerEvent.VIDEO_ONNOTIFICATION, {
											'header' : {
												'type' : 'pricedata'
											},
											'body' : {
												'data' : data
											}
										});
										if (data.errorcode == '0' && data.vodPriceInfo) {
											let currInfo = data.vodPriceInfo,
												price = 100000,
												minPrice = 10000,
												vipPrice = 0,
												patCon;
											for (let item of currInfo['sellPolicy']) {
												patCon = ['<span style="float: left;margin: auto 15px;line-height: 22px;">当前正在免费试看，', '观看完整版</span>'];
												if (item['type'] == 'buy_package' && currInfo.cataId == 2) {
													if (item['sellType'] == 'sports') {
														patCon.splice(1, 0, '<a style="text-decoration: underline;cursor: pointer;" class="buyvip">开通体育会员</a>');
														break;
													}
												} else if (item['type'] == "buy_vip" && currInfo.cataId == 1) {
													patCon.splice(1, 0, '<a style="text-decoration: underline;cursor: pointer;" target="_blank" href="//pay.vip.pptv.com/?aid=content_web_bfqkthy&plt=web&cid='+Global.getInstance().cid+'">开通会员</a>');
													break;
												} else if (item['type'] == 'buy_vod') {
													for (let its of item['priceList']) {
														if (VIPPrivilege.vipMap.indexOf(its['vipType']) != -1) {
															if (its['vipType'] == 'vip') vipPrice = its['price'];
															if (its['price'] < price) price = its['price'];
														}
														if (its['price'] < minPrice) minPrice = its['price'];
													}
													if (price != 0 && price != 100000) {
														if (currInfo.cataId == 2) {
															if (minPrice != 0 && minPrice < price){
																patCon.splice(1, 0, '<a style="text-decoration: underline;cursor: pointer;" target="_blank" href="//pay.vip.pptv.com/?aid=content_web_bfqkthy&plt=web&cid='+Global.getInstance().cid+'">开通会员享'+minPrice+'元购买</a>');
															}else{
																patCon.splice(1, 0, '<a style="text-decoration: underline;cursor: pointer;" class="buymovie">' + price+'元购买单片</a>');
															}
														} else {
															if (VIPPrivilege.vipMap.indexOf('novip') != -1) {
																if (vipPrice != 0){
																	patCon.splice(1, 0, '<a style="text-decoration: underline;cursor: pointer;" target="_blank" href="//pay.vip.pptv.com/?aid=content_web_bfqkthy&plt=web&cid='+Global.getInstance().cid+'">开通会员享'+vipPrice+'元购买</a>');
																} else {
																	patCon.splice(1, 0, '<a style="text-decoration: underline;cursor: pointer;" target="_blank" href="//pay.vip.pptv.com/?aid=content_web_bfqdpgm&typ=0&id='+Global.getInstance().cid+'">'+price+'元购买</a>');
																}
															} else if (VIPPrivilege.vipMap.indexOf('vip') != -1) {
																patCon.splice(1, 0, '<a style="text-decoration: underline;cursor: pointer;" target="_blank" href="//pay.vip.pptv.com/?aid=content_web_bfqdpgm&typ=0&id='+Global.getInstance().cid+'">享'+vipPrice+'元会员价购买</a>');
															}
														}
													}
												}
											}
											TipsManager.getInstance().addTips(Global.getInstance().playUITips, {
												'content' : patCon.join(''),
												'times'   : 1,
												'display' : Global.getInstance().fd * 1000,
												'type'    : 'pay',
											});
											Global.getInstance().playUITips.find('.buyvip').on('click', (e)=>{
												PayTip.sendMessage('openSportVip');
											});
											Global.getInstance().playUITips.find('.buymovie').on('click', (e)=>{
												PayTip.sendMessage('buyVideo');
											});
										}
										return;
									}
									this.sendNotification(H5Notification.PAY_COMPLETE, data);
								},
								//XMLHttpRequest 对象，错误信息，（可能）捕获的错误对象
				error		  : (xhr, errorType, error) => {
									if (this._dindex < 2) {
										this._dindex++;
										this.loadData();
									} else {
										Global.debug('付费价格策略ajax请求错误：[' , xhr, '|' + errorType + ']', error);
										this.sendNotification(H5Notification.PAY_COMPLETE);
									}
								}	
		});
	}
}