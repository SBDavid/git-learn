/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import $ from 'jquery';
import Global from "manager/Global";
import { CommonUI } from "../../component/CommonUI";
import { UIComponent } from "../../component/UIComponent";
import H5ComponentEvent from "../../event/H5ComponentEvent";
import { Countdown } from "../../component/Countdown";
import { H5CommonUtils } from "common/H5CommonUtils";
import H5PlayerEvent from "common/H5PlayerEvent";
import JcropManager from "manager/JcropManager";
import { H5Common } from "common/H5Common";
import BIPCommon from "bip/BIPCommon";

export class MobilePlayerComponent extends UIComponent {

	constructor() {
		super();
		this.videoHtml = CommonUI.videoHtml.replace(/\[WIDTH\]/g, Global.getInstance().w)
										   .replace(/\[HEIGHT\]/g, Global.getInstance().h);
		$('.control').before(this.videoHtml);

		this.videoBox = Global.getInstance().pbox.find('.p-video');
		this.playerBox = this.videoBox.find('.p-video-box');
		this.playerBox.css({'background' : 'none'})
		this.video = this.playerBox.find('.p-video-player');
		this.player = this.video[0];
		this.player.removeAttribute("controls");
		if(Global.getInstance().autoplay !== 0){
			this.player.setAttribute('autoplay', 'autoplay');
		}
		this.playUILoading = this.videoBox.find('.p-video-loading');
		this.playUIPoster = this.videoBox.find('.p-video-poster');
		this.resize();
		//渠道策略 - 绕过播放限制（暂未处理）
		for (let i = 0, len = Global.getInstance().whitelist.length; i < len; i++) {
			if(Global.getInstance().ctx.o && Global.getInstance().whitelist[i] && Global.getInstance().whitelist[i] == Global.getInstance().ctx.o) {
				//处理逻辑
			}
		}
		//
		this.stopInter = 0;
		this.bufferInter = 0;
		this.isRequestPlay = false;//是否作了play请求
		this.playData = null;
		this.firstPlay = true;//是否是首次播放
		this.abnormal = false;
		this.isSeek = false;
		this.isPlayClick = false;
		this.advInter = 0;
		this.onlineTime = 5 * 60;
		this.advDu = 0;
		this.fd = 0;//免费试看时长
		//
		this.playUILoading.hide();
		Global.getInstance().playstate = 'stopped';
		Global.getInstance().posiTime = 0;
		Global.getInstance().video = this.video;
		Global.getInstance().player = this.player;
		Global.getInstance().isStart = true;
		Global.getInstance().isEnd = false;
		Global.getInstance().isReload = false;//视频请求是否重试备用ip
		this.onVideoHandler();
	}

	resize() {
		var img = new Image();
		img.id = 'pre_img';
		img.src = Global.getInstance().poster;
		img.style.cssText = 'position:absolute;';
		JcropManager.getInstance().addImage(this.playUIPoster, img, Global.getInstance().isfull);
		//
		let ow = Global.getInstance().pbox.width(),
			oh = Global.getInstance().pbox.height();
		Global.getInstance().winSize = {
											ow: ow,
											oh: oh
										}
		if (this.orignalWHObj) {
			let per = this.orignalWHObj.width / this.orignalWHObj.height;
			if (ow / oh > per) {	
				this.playerBox.css({
					'width' : oh*per,
					'height' : oh
				});	
			} else {
				this.playerBox.css({
					'width' : ow,
					'height' : ow / per
				});
			}
			this.playerBox.css({
				'margin-left' : ow-parseFloat(this.playerBox.css('width')) >> 1,
				'margin-top' : oh-parseFloat(this.playerBox.css('height')) >> 1,
			});
		}
	}

	onVideoHandler() {
		this.video.on('loadstart', 	(e) => {
												if (!H5Common.isPlayAdv) {
													Global.debug('当前接收事件 ==>> ', e.type);													
												} else {
													this.advStatusUpdate('videoStart');
													this.sendEvent(H5ComponentEvent.ADV_EVENT, {'eventType':'showAdvDom'});
												}
											});
		this.video.on('loadedmetadata loadeddata durationchange', (e) => {
													if (!H5Common.isPlayAdv) {
														Global.debug('当前接收事件 ==>> ', e.type);
													} else {
														if (e.type == 'durationchange') {
															this.advStatusUpdate('videoDuration', Math.floor(this.player.duration));
															this.advDu += this.player.duration;
															Global.debug('获取广告时长 ==>> ', this.player.duration);
														}
														return;
													};
													if (e.type == 'loadedmetadata') {
														this.orignalWHObj = {
															'width' : this.player.videoWidth || Global.getInstance().playData['width'],
															'height': this.player.videoHeight || Global.getInstance().playData['height']
														}
														this.resize();
													}
													this.getDuration();
													this.sendEvent(H5ComponentEvent.VIDEO_TITLE, {
																								'display' : 'block'
																							});
													Global.getInstance().pbox.on('touchstart', (e) => {
																									this.sendEvent(H5ComponentEvent.CONTROL_STATE, {
																																					'visible' : true
																																				});
																								});
												});
		this.video.on('canplaythrough', (e) => {
													this.playUIPoster.hide();
													this.playUILoading.hide();
													if (!H5Common.isPlayAdv) {
														Global.debug('当前接收事件 ==>> ', e.type);
													} else {
														this.clearAdvTimeout();
														return;
													}
													this.volume = 100;
													this.sendEvent(H5ComponentEvent.VIDEO_BUFFER);
													this.sendEvent(H5ComponentEvent.VIDEO_STATE, {
																								'playstate' : Global.getInstance().playstate
																							});
													this.isSeek = false;
													if (Global.getInstance().isStart) {
														Global.getInstance().vde = +new Date();
														Global.getInstance().isStart = false;
														this.abnormal = false;
														this.sendEvent(H5ComponentEvent.VIDEO_STORAGE,{
																										'key' : BIPCommon.PTE,
																										'value' : this.advDu
																									});
														this.sendEvent(H5ComponentEvent.CONTROL_STATE, {
																										'visible' : true
																									});
														this.sendEvent(H5ComponentEvent.VIDEO_BIP, {
																									'dt' : 'sd'
																								});
														this.sendEvent(H5ComponentEvent.VIDEO_BIP, {
																									'dt' : 'act',
																									'data' : {
																												'type' : 'pds'
																											}
																								});
														this.sendOnline({'J':1});
														this.onlineInter = setInterval(() => {
																							if (Global.getInstance().playstate == 'paused') {
																								this.sendOnline({'J':3});
																							} else if(Global.getInstance().playstate == 'playing') {
																								this.sendOnline({'J':4});
																							}
																						}, this.onlineTime * 1000);
													} else {
														if (this.bufferInter) clearTimeout(this.bufferInter);
														this.sendEvent(H5ComponentEvent.STOP_RECORD, {
																									'target' : BIPCommon.BS
																								});
														this.sendEvent(H5ComponentEvent.STOP_RECORD, {
																									'target' : BIPCommon.OLBS
																								});
													}
												});
		this.video.on('seeking waiting  stalled', (e) => {
													if (!H5Common.isPlayAdv) {
														Global.debug('当前接收事件 ==>> ', e.type);
													} else {
														if (e.type == 'stalled') {
															this.advTimeout();
														}
														return;
													}
													if (e.type == 'seeking' || e.type == 'waiting') { 
														this.playUILoading.show();
													}
													if (this.bufferInter) clearTimeout(this.bufferInter);
													if (e.type != 'seeking' && !Global.getInstance().isStart && !this.isSeek) {
														if (e.type == 'stalled') {
															if (!this.isStalled) {
																this.isStalled = true;
															} else {
																return;
															}
														} else {
															this.isStalled = false;
														}
														this.bufferInter = setTimeout(() => {
																			Global.postMessage(H5PlayerEvent.VIDEO_ONPLAYSTATE_CHANGED, '4');
																			this.sendEvent(H5ComponentEvent.START_RECORD, {
																															'target' : BIPCommon.BS
																														});
																			this.sendEvent(H5ComponentEvent.ADD_VALUE, {
																														'target' : BIPCommon.BF
																													});
																			//以下为5min中的卡顿相关（包括次数、时长）
																			this.sendEvent(H5ComponentEvent.ADD_VALUE, {
																														'target' : BIPCommon.OLBF
																													});
																			this.sendEvent(H5ComponentEvent.START_RECORD, {
																															'target' : BIPCommon.OLBS
																														});
																		}, 0.5 * 1000);
													}
												});
		this.video.on('timeupdate', H5CommonUtils.throttle((e) => {
														if (H5Common.isPlayAdv) {
															this.advStatusUpdate('videoCurrentTime', Math.floor(this.player.currentTime));
															return;
														}
														this.playUILoading.hide();
														Global.getInstance().posiTime = this.player.currentTime;
														let timeObj = { };
														if (Global.getInstance().videoType != 10) {
															timeObj['start'] = 0;
															timeObj['end'] = Global.getInstance().duration == undefined ? 0 : Global.getInstance().duration;
															timeObj['posi'] = Global.getInstance().posiTime;
															if (Global.getInstance().duration - Global.getInstance().posiTime < 15) this.abnormal = true;
														} else {
															let timestamp = new Date().valueOf() - Global.getInstance().playData['timestamp'];
															timeObj['live'] = Global.getInstance().playData['st'] + timestamp;
														}
														this.sendEvent(H5ComponentEvent.VIDEO_UPDATE, timeObj);
														this.sendEvent(H5ComponentEvent.ADD_VALUE, {
																									'target' : BIPCommon.VT
																								});
														if (this.bufferInter) clearTimeout(this.bufferInter);
														if (this.isStalled) {
															this.isStalled = false;
															this.sendEvent(H5ComponentEvent.STOP_RECORD, {
																										'target' : BIPCommon.BS
																									});
														}    
													}, 1000));
		this.video.on('ended', 			(e) => {
													Global.getInstance().isEnd = true;
													if (!H5Common.isPlayAdv) {
														Global.debug('当前接收事件 ==>> ', e.type);
													} else {
														this.advStatusUpdate('videoEnd');
														H5Common.isPlayAdv = false;
														//15s等待时间如果广告没有给素材就把广告层删除
														this.advTimeout();
														return;
													}
													this.stopVideo();
												});
		this.video.on('pause',			(e) => {
													//android接收ended事件后仍能收到pause事件
													if (!Global.getInstance().isEnd) {
														Global.getInstance().playstate = 'paused';
														this.sendEvent(H5ComponentEvent.VIDEO_STATE, {
																									'playstate' : Global.getInstance().playstate
																								});
													}
												});
		this.video.on('playing',		(e) => {
													this.playUILoading.hide();
													Global.getInstance().playstate = 'playing';
													this.sendEvent(H5ComponentEvent.VIDEO_STATE, {
																								'playstate' : Global.getInstance().playstate
																							});
												});
		this.video.on('abort error', 	(e) => {
													Global.debug('video请求出错 >>>>>>' + this.playData.videoSrc);
													//启用备用ip
													if (this.playData.backip && !Global.getInstance().isReload) {			
														Global.getInstance().isReload = true;																			
														let rex = new RegExp(this.playData.ip, 'g');
														this.playData.videoSrc = this.playData.videoSrc.replace(rex, this.playData.backip);
														Global.debug('启用备用ip请求video >>>>>' + this.playData.videoSrc);
														this.replay();	
														return;
													}
													this.playUIPoster.hide();
													this.playUILoading.hide();
													if (this.onlineInter) clearInterval(this.onlineInter);
													if (!H5Common.isPlayAdv) {
														Global.debug('当前接收事件 ==>> ', e.type, ' 当前总时长 ==>> ', Global.getInstance().duration, ' 当前播放点 ==>> ', Global.getInstance().posiTime);
													} else {
														this.advStatusUpdate('videoFail');
														H5Common.isPlayAdv = false;
														//15s等待时间如果广告没有给素材就把广告层删除
														this.advTimeout();
														return;
													}
													//兼容android手机环境下结束时仍然抛出abort事件，导致弹出错误信息和er报文发送
													if (this.abnormal) {
														this.endDone();
														Global.debug('视频播放接近结束收到异常：[' + e.type + ']事件，阻止错误信息显示和er报文发送...');
														return;
													}
													this.sendEvent(H5ComponentEvent.VIDEO_BUFFER);
													this.sendEvent(H5ComponentEvent.VIDEO_STATE, {
																								'playstate' : Global.getInstance().playstate
																							});
													let codeObj = {
																	'errorcode' : H5Common.callCode.video[1],
																	'msg' 		: e.type,
																	'videosrc'	: ((this.player && this.player.src) ? this.player.src  : '')
																};
													this.sendEvent(H5ComponentEvent.VIDEO_FAILED, codeObj);
													this.sendEvent(H5ComponentEvent.VIDEO_BIP, {
																								'dt' : 'er',
																								'data' : codeObj
																							});
													this.sendEvent(H5ComponentEvent.VIDEO_BIP, {
																								'dt' : 'act',
																								'data' : {
																											'type' : 'pderr'
																										}
																						});
												});
		this.video.on('webkitbeginfullscreen webkitendfullscreen', (e) => {
														this.sendEvent(H5ComponentEvent.VIDEO_SCREEN, {
																										'zoom' : e.type == 'webkitbeginfullscreen'
																									});
												});
	}

	//显示定时上线倒计时
	showCountdown(obj) {
		let block = new Countdown(Global.getInstance().pbox);
		block.addTime(obj['time']);
		block.addEventListener(H5ComponentEvent.VIDEO_COUNTDOWN, (e) => {
																	block.remove();
																	//节目倒计时结束后无法直接播放，必须手动点击
																	Global.getInstance().isReload = false;
																	this.firstPlay = true;
																	this.isRequestPlay = false;
																	this.playVideo();
																})
	}

	//视频播放时长
	getDuration() {
		Global.getInstance().realDuration = this.player.duration;
		if (Global.getInstance().videoType == 1) {//点播
			Global.getInstance().duration = Math.min(Global.getInstance().realDuration, Global.getInstance().totalDuration);
		} else if (Global.getInstance().videoType == 20) {//伪点播
			Global.getInstance().duration = Global.getInstance().realDuration;
		} else Global.getInstance().duration = 0;  
		this.sendEvent(H5ComponentEvent.VIDEO_STORAGE, {
														'key' : BIPCommon.DU, 
														'value' : Global.getInstance().duration * 1000
													});
	}

	//设置视频音量
	set volume(vol) {
		H5Common.currVolume = vol;
		try {
			vol = vol / 100;
			if (vol >= 0 && vol <= 1) {
				this.player.volume = vol;
			}
		}catch(e) { };
	}

	execute() {
		let noAdFlag = false;
		H5Common.noAdsList = window.adConfig || H5Common.noAdsList;
		for(let i = 0, l = H5Common.noAdsList.length; i < l; i++) {
			if(Global.getInstance().ctx.o == H5Common.noAdsList[i]) {
				noAdFlag = true;
			}
		}
		Global.getInstance().userInfo = H5CommonUtils.userInfo(H5CommonUtils.cookie());
		Global.debug('用户信息 >>>>>> ', Global.getInstance().userInfo)
		if (noAdFlag || (Global.getInstance().userInfo && Global.getInstance().userInfo.uid && Global.getInstance().userInfo.isvip) || Global.getInstance().isVipMovie) {
			Global.debug('执行无广告 | VIP用户播放逻辑 ...');
			this.sendEvent(H5ComponentEvent.ADS_STATUS, {
														'status':10
													});
		} else {
			Global.debug('执行有广告 | 非用户播放逻辑 ... ');
			Global.getInstance().adConfig.vlen = Global.getInstance().ctx.duration;
			this.sendEvent(H5ComponentEvent.ADS_STATUS);
		}
		this.video.show();
		this.playVideo();
	}

	//启动 或 重新播放
	replay(data) {
		this.sendEvent(H5ComponentEvent.VIDEO_BIP, {
													'dt' : 'bfr'
												});
		if (this.stopInter) clearTimeout(this.stopInter);
		if (data) this.playData = data;
		if (this.fd_Interval) clearInterval(this.fd_Interval);
		if(data && data.fd > 0)//试看逻辑
		{
			this.fd = data.fd;
			this.fd_Interval = setInterval(() => {											
										this.fd --;
										if(this.fd == 0)
										{
											this.stopVideo();
										}
										else
										{
											this.sendEvent(H5ComponentEvent.VIDEO_FD_COUNTDOWN, this.fd);
										}										
								}, 1000);
		}
		Global.getInstance().isEnd = false;
		this.video.show();
		if (H5CommonUtils.getQueryString('userto')) {
			this.sendEvent(H5ComponentEvent.VIDEO_STORAGE, {
															'key' : BIPCommon.USERTO,
															'value' : H5CommonUtils.getQueryString('userto')
														});
		}
		try{
			[{
				'key' : BIPCommon.S,
				'value' : Global.getInstance().videoType
				},{
					'key' : BIPCommon.NOW,
					'value' : Global.getInstance().st + (new Date().valueOf() - Global.getInstance().originTime)
				},{
					'key' : BIPCommon.BWT,
					'value' : Global.getInstance().stream[H5Common.ft]['dt']['bwt']
				},{
					'key' : BIPCommon.CFT,
					'value' : H5Common.ft
				},{
					'key' : BIPCommon.MN,
					'value' : (Global.getInstance().title || '')
				},{
					'key' : BIPCommon.VH,
					'value' : (Global.getInstance().ip || '')
				},{
					'key' : BIPCommon.CID,
					'value' : Global.getInstance().adConfig.chid
				},{
					'key' : BIPCommon.CLD,
					'value' : Global.getInstance().adConfig.clid
				},{
					'key' : BIPCommon.CTX,
					'value' : Global.getInstance().adConfig.ctx
				},{
					'key' : BIPCommon.SS,
					'value' : Global.getInstance().ss
				},{
					'key' : BIPCommon.UT,
					'value' : Global.getInstance().userInfo.ut
				},{
					'key' : BIPCommon.SECTIONID,
					'value' : H5Common.sectionId
				}].forEach((item) => {
								this.sendEvent(H5ComponentEvent.VIDEO_STORAGE, item);
							});
		}catch(e){};
		Global.debug('开始 video 请求  >>>>>> ', this.playData.videoSrc);
		this.player.src = this.playData.videoSrc;
		this.player.load();
		setTimeout(()=>{
			this.player.play();
			Global.postMessage(H5PlayerEvent.VIDEO_ONPLAYSTATE_CHANGED, '3');
		}, 10);
	}

	//拖动播放
	seekVideo(time) {
		this.isSeek = true;
		this.player.currentTime = Global.getInstance().posiTime;
		if (time) {
			this.player.currentTime = time;
		}
		this.playVideo();
	}

	//播放视频
	playVideo() {
		this.sendEvent(H5ComponentEvent.SKIN_TIPS, {'bool' : false});
		if (Global.getInstance().playstate == 'stopped') {
			if (!this.isRequestPlay) {
				try{
					[{
						'key' : BIPCommon.GUID,
						'value' : Global.getInstance().userInfo.guid
					},{
						'key' : BIPCommon.UID,
						'value' : Global.getInstance().userInfo.uid
					},{
						'key' : BIPCommon.CID,
						'value' : Global.getInstance().cid
					}].forEach((item) => {
									this.sendEvent(H5ComponentEvent.VIDEO_STORAGE, item);
								});
				}catch(e){};
				this.isRequestPlay = true;
				if (this.stopInter) clearTimeout(this.stopInter);
				this.sendEvent(H5ComponentEvent.WEB_PLAY);
			} else {
				Global.postMessage(H5PlayerEvent.VIDEO_ONPLAYSTATE_CHANGED, '5');
				Global.debug('开始视频正片播放  >>>>>');
				Global.getInstance().vds = +new Date();
				this.replay(Global.getInstance().playData);
				try{
					CommonUI.showMark(this.video, Global.getInstance().playData.mark);
				}catch(e){};
				try{
					CommonUI.showPno(this.video, Global.getInstance().playData.pno);
				}catch(e){};
				Global.getInstance().playstate = 'playing';
			}
		} else {
			Global.debug('视频暂停后播放  >>>>>');
			this.player.play();
			Global.getInstance().playstate = 'playing';
			this.sendEvent(H5ComponentEvent.VIDEO_BIP, {
														'dt' : 'act',
														'data' : {
																	'type' : 'pd'
																}
													});
		}
	}

	//停止视频
	stopVideo() {
		Global.getInstance().posiTime = 0;
		Global.getInstance().isStart = true;
		Global.getInstance().playstate = 'stopped';
		this.sendOnline({'J':5});
		if (this.onlineInter) clearInterval(this.onlineInter);
		if (this.fd_Interval) clearInterval(this.fd_Interval);
		Global.postMessage(H5PlayerEvent.VIDEO_ONPLAYSTATE_CHANGED, H5Common.isHandoff?'7':'8');
		this.sendEvent(H5ComponentEvent.VIDEO_STATE, {
													'playstate' : Global.getInstance().playstate
												});
		this.sendEvent(H5ComponentEvent.CONTROL_STATE, {
														'visible' : false
													});
		this.sendEvent(H5ComponentEvent.VIDEO_TITLE, {
													'display' : 'none'
												});
		this.stopInter = setTimeout(() => {
							this.player.pause();
							this.video.hide();
							this.playUIPoster.show();
						}, 1 * 1000);
		this.endDone();
		this.sendEvent(H5ComponentEvent.VIDEO_BIP, {
													'dt' : 'act',
													'data' : {
																'type' : 'pde'
															}
												});
	}

	endDone() {
		if (Global.getInstance().videoType == 1) {
			if (Global.getInstance().duration < Global.getInstance().totalDuration) {
				Global.debug('视频预览播放结束，给出后续操作弹窗...');
				//判断是否在APP中观看视频
              	let $plt = /\?\s*(plt)=(\w+)/i.exec(top.location.href);
				if(!$plt || ($plt.length > 0 && $plt[2] != 'app')){
					this.sendEvent(H5ComponentEvent.SKIN_TIPS, {'bool' : true});
				}
			} else {
				try{
					Global.debug('视频完整播放结束，准备进入下一集,抛出 nextvideo 事件...');
					Global.postMessage(H5PlayerEvent.VIDEO_NEXT);
				}catch(e){};
			}			
		} else if(Global.getInstance().videoType == 10){//直播
				Global.debug('视频预览播放结束，给出后续操作弹窗...');
				//判断是否在APP中观看视频
              	let $plt = /\?\s*(plt)=(\w+)/i.exec(top.location.href);
				if(!$plt || ($plt.length > 0 && $plt[2] != 'app')){
					this.sendEvent(H5ComponentEvent.SKIN_TIPS, {'bool' : true});
				}
		}
	}

	toggleVideo() {
		if (this.player.paused) {
			this.isPlayClick = true;
			if (H5Common.isPlayAdv) {
				Global.getInstance().pbox.find('.p-video-vastad').css('z-index','99999');
				this.playAdvVideo();
			} else this.playVideo();
		} else {
			Global.postMessage(H5PlayerEvent.VIDEO_ONPLAYSTATE_CHANGED, '6');
			this.player.pause();
			Global.getInstance().playstate = 'paused';
			this.sendEvent(H5ComponentEvent.VIDEO_BIP, {
														'dt' : 'act',
														'data' : {
																	'type' : 'pdp'
																}
													});
		}
		this.sendEvent(H5ComponentEvent.VIDEO_STATE, {
													'playstate' : Global.getInstance().playstate
												});
	}

	/**
	 * android 系统走伪全屏
	 */
	screenVideo(data) {
		if (/android/i.test(navigator.userAgent.toLocaleLowerCase())) {
			 Global.postMessage(H5PlayerEvent.VIDEO_FULLSCREEN, data);
		} else {
			if ($.isFunction(this.player.requestFullscreen)) {
				this.player.requestFullscreen();
			} else if ($.isFunction(this.player.webkitEnterFullscreen)) {
				this.player.webkitEnterFullscreen();
			} else if ($.isFunction(this.player.mozRequestFullScreen)) {
				this.player.mozRequestFullScreen();
			} else {
				alert('Your browsers doesn\'t support fullscreen');
			}
		}
	}

	//设置广告素材路径
	setAdvSrc(src) {
		if(src && src.length > 0) {
			Global.debug('设置广告素材 setAdvSrc ===>>> ', src);
			H5Common.isPlayAdv = true;
			if (!this.advSrc) {
				this.advSrc = src;
			} else {
				this.advSrc = src;
				this.playAdvVideo();
			}
		}
	}

	//播放广告
	playAdvVideo() {
		if (this.advSrc) {
			Global.debug('播放广告素材 playAdvVideo ...');
			this.clearAdvTimeout();
			this.player.src = this.advSrc;
			this.player.load();
			this.player.play();
		}
	}

	advStatusUpdate(type, value) {
		this.sendEvent(H5ComponentEvent.ADV_EVENT, {
													'eventType' : 'sendToAdvDom',
													'type' : type,
													'values' : value!==undefined?[value]:''
												});
	}

	clearAdvTimeout() {
		if (this.advInter) clearTimeout(this.advInter);
	}

	//10s等待时间如果广告没有给素材就把广告层删除
	advTimeout() {
		this.clearAdvTimeout();
		this.advInter = setTimeout(() => {
							if (!H5Common.isPlayAdv && Global.getInstance().playstate != 'playing') {
								this.sendEvent(H5ComponentEvent.ADS_STATUS, {
																			'status' : 100
																		});
							}
						}, 10*1000);
	}
}
