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
import VIPPrivilege from "common/VIPPrivilege";
import { H5Common } from "common/H5Common";
import CTXQuery from "manager/CTXQuery";
import BIPCommon from "bip/BIPCommon";
import { H5PcCore } from "H5PcCore";

export class PcPlayerComponent extends UIComponent {

	kernal;
	$doubleInter;
	$isDoubleClick = false;

	constructor() {
		super();
		this.videoHtml = CommonUI.videoHtml.replace(/\[WIDTH\]/g, Global.getInstance().w)
										   .replace(/\[HEIGHT\]/g, Global.getInstance().h);
		$('.w-control').before(this.videoHtml);
		this.videoBox = Global.getInstance().pbox.find('.p-video');
		this.playerBox = this.videoBox.find('.p-video-box');
		this.video = this.playerBox.find('.p-video-player');
		this.player = this.video[0];
		//this.player.muted = true;
		this.player.removeAttribute("controls");
		this.playUILoading = this.videoBox.find('.p-video-loading');
		this.playUILoading.removeClass('p-video-loading').addClass('w-video-loading');
		this.playUILoading.html('正在缓冲...');
		this.playUIPoster = this.videoBox.find('.p-video-poster');
		this.playUIPoster.removeClass('p-video-poster').addClass('w-video-poster');
		this.resize();
		//
		this.stopInter = 0;
		this.bufferInter = 0;
		this.bfInter = 0;
		this.bufferCountArr = [];
		this.playData = null;
		this.isSeek = false;
		this.onlineTime = 5 * 60;
		//
		this.enable = false;
		this.playUILoading.hide();
		this.videoAutoPlayNext = true;
		Global.getInstance().playstate = 'stopped';
		Global.getInstance().posiTime = 0;
		Global.getInstance().video = this.video;
		Global.getInstance().player = this.player;
		Global.getInstance().isStart = true;
		this.onVideoHandler();
	}

	resize() {
		let ow = Global.getInstance().pbox.width(),
			oh = Global.getInstance().pbox.height() - (!this.isFullscreen && H5Common.isShowControl?$('.w-control').height():0);
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
	
	set isMouseMove(value) {
		this.sendEvent(H5ComponentEvent.VIDEO_MOUSEMOVE, {
			isMove : value,
			isFullscreen : this.isFullscreen
		});
	}

	onVideoHandler() {
		this.video.on('loadstart', 	    (e) => {
													Global.debug('当前接收事件 ==>> ', e.type);
												});
		this.video.on('loadedmetadata loadeddata durationchange', (e) => {
													if (e.type == 'loadedmetadata') {
														this.orignalWHObj = {
															'width' : this.player.videoWidth || Global.getInstance().playData['width'],
															'height': this.player.videoHeight || Global.getInstance().playData['height']
														}
														this.resize();
													}
													this.sendEvent(H5ComponentEvent.VIDEO_TITLE, {
																									'display' : 'block'
																								});
												});
		this.video.on('timeupdate', H5CommonUtils.throttle((e) => {
													//this.playUILoading.hide();
													if (this.isSeek) return;
													try{
														if (this.kernal) {
															let currTime = Math.floor(new Date().valueOf() / 1000);
															Global.getInstance().startTime = Global.getInstance().serverTime + (currTime - Global.getInstance().localTime);
															Global.getInstance().posiTime = this.kernal.timeHack + (this.kernal.headTime >> 0);
															let timeObj = {
																'start': Global.getInstance().videoType == 1 ? 0 : (H5Common.isVod ? H5Common.stime : (Global.getInstance().startTime - H5Common.backdur)),
																'end'  : Global.getInstance().videoType == 1 ? Global.getInstance().playData['duration'] : (H5Common.isVod ? H5Common.etime : Global.getInstance().startTime),
																'posi' : Global.getInstance().posiTime,
																'live' : Global.getInstance().startTime
															}
															this.sendEvent(H5ComponentEvent.VIDEO_UPDATE, timeObj);
															if (Global.getInstance().videoType == 1) {
																if (Global.getInstance().fd && Global.getInstance().posiTime > Global.getInstance().fd) {
																	this.stopVideo();
																	// 试看节目逻辑已经结束，弹出付费窗口
																	this.sendEvent(H5ComponentEvent.VIDEO_PAY);
																}
																Global.postMessage(H5PlayerEvent.VIDEO_ONPROGRESS_CHANGED, {
																																'timeloaded': timeObj['posi']
																															});
																if (H5Common.isSkip) {
																	/********** 显示跳过片尾 **********/
																	try {
																		for (let item of Global.getInstance().playData['point']) {
																			if (item['type'] == 2 && item['time'] > 0) {
																				if (item['time']-Global.getInstance().posiTime>0 && item['time']-Global.getInstance().posiTime<=30) {
																					if (!this.isShowSkip) {
																						this.isShowSkip = true;
																						this.sendEvent(H5ComponentEvent.VIDEO_SKIP);
																					}
																				}
																				if (Global.getInstance().posiTime>=item['time']) {
																					this.nextExecute();
																				}
																			}
																		}
																	} catch (error) {}
																}
															} else {
																Global.postMessage(H5PlayerEvent.VIDEO_ONNOTIFICATION, { 
																															'header' : {
																																'type' : 'position'
																															},
																															'body' : {
																																'data' : {
																																	'posi' : Global.getInstance().posiTime,
																																	'live' : Global.getInstance().startTime,
																																	'isVod': H5Common.isVod
																																}
																															}
																														});
															}
															this.sendEvent(H5ComponentEvent.ADD_VALUE, {
																'target' : BIPCommon.VT
															});
															if (H5Common.isVod) {
																if (Global.getInstance().posiTime > H5Common.etime) {
																	Global.debug('当前直播回看已经结束，播放下一时间段节目 ===>>>');
																	this.sendEvent(H5ComponentEvent.VIDEO_BIP, {
																		'dt' : 'livestop'
																	});
																	Global.postMessage(H5PlayerEvent.VIDEO_ONPLAYSTATE_CHANGED, '8');
																	Global.postMessage(H5PlayerEvent.VIDEO_ONNOTIFICATION, { 
																															'header' : {
																																'type' : 'nextvideo'
																															},
																															'body' : {
																																'data' : {}
																															}
																														});
																}
															}
														}
													}
													catch(e){}
//													if (this.bufferInter) clearTimeout(this.bufferInter);
												}, 1 * 1000));
//		this.video.on('ended', 			(e) => {
//													Global.debug('当前接收事件 ==>> ', e.type);
//													this.stopVideo();
//												});
		this.video.on('pause',			(e) => {
													/* if (!Global.getInstance().isStart) {
														Global.getInstance().playstate = 'paused';
													} */
												});
		this.video.on('playing',		(e) => {
													this.playUILoading.hide();
													/* Global.getInstance().playstate = 'playing';
													this.sendEvent(H5ComponentEvent.VIDEO_STATE, {
														'playstate' : Global.getInstance().playstate
													}); */
												});
		this.playerBox.on('mousemove', 	(e) => {
													this.isMouseMove = true;
													this.timer && clearTimeout(this.timer);
													this.timer = setTimeout(()=>{
														this.isMouseMove = false;
													}, 3 * 1000);
												});
		this.playerBox.on('click', 		(e) => {
													if (this.$isDoubleClick) {
														this.fullscreenVideo(!this.isFullscreen);
														this.checkDoubleClick(false);
													} else {
														this.$isDoubleClick = true;
														this.$doubleInter = setTimeout(()=>{
															this.checkDoubleClick(true);
														}, 300);
													}
												});
	}

	setUserInfo() {
		VIPPrivilege.isVip = false;
		VIPPrivilege.isNoad = false;
		VIPPrivilege.vipMap = ['novip'];
		Global.getInstance().userInfo = H5CommonUtils.userInfo(H5CommonUtils.cookie());
		Global.debug('用户信息 >>>>>> ', Global.getInstance().userInfo);
		try{
			let udi = Global.getInstance().userInfo.udi.split('$');
			VIPPrivilege.isVip = Global.getInstance().userInfo['isvip'];
            VIPPrivilege.isNoad = VIPPrivilege.isVip;
			VIPPrivilege.vipMap = getVipMap(udi[28]?udi[28]:Global.getInstance().userInfo['udr']);
			function getVipMap(value) {
				// vip类型: 移动会员(-5)  普通会员(1)  超级会员(10)
				// value = {1:'1526093122000', 10:'1520412421000'}
				value = value.replace(/(\-?\d+)(?=:)/g, "\'$1\'");
				try{
					let vipmap = [];
					let vipDic = {"1":"vip", "10":"svip"};
					let vipValidate = eval("let abc;abc=" + (value || "{}"));
					let nowTime = new Date().valueOf(); 
					for (let i in vipValidate){
						if (vipDic[i] && Number(vipValidate[i]) >= nowTime){
							if (vipDic[i]) vipmap.push(vipDic[i]);
						}
					}
					if (vipmap.length == 0) vipmap = ["novip"];
					return vipmap;
				}catch (e){}
				return ["novip"];
			}
		}catch(e){}
		Global.debug('用户权益 >>>>>> ', VIPPrivilege);
	}
	
	execute() {
		this.setUserInfo();
        Global.postMessage(H5PlayerEvent.VIDEO_ONREADY);
        this.sendEvent(H5ComponentEvent.VIDEO_STORAGE, {
														'key' : BIPCommon.ISVIP,
														'value' : VIPPrivilege.isVip
													});
	}

	switchVideo() {
		this.replay();
		this.seekVideo(Global.getInstance().posiTime);
		this.resize();
	}
	
	//拖动播放
	seekVideo(seektime) {
		if (!seektime || isNaN(seektime)) return;
		H5Common.tempT = NaN;
		this.bufferCountArr = [];
		this.isSeek = true;
		if (Global.getInstance().videoType != 1) {
			seektime -= seektime % Global.getInstance().playData.interval;
		}
		this.playUILoading.show();
		if (this.kernal) {
			this.kernal.seekVideo(seektime);
			this.playerPlayHandler();
		}
	}
	
	/**
	 * 停止视频播放
	 */
	stopVideo() {
		if (this.kernal) {
			this.kernal.close();
			this.kernal = null;
		}
		this.sendOnline({'J':5});
		this.onlineInter && clearInterval(this.onlineInter);
		H5Common.isVod = 0;
		H5Common.stime = NaN;
		H5Common.etime = NaN;
		this.isShowSkip = false;
		Global.getInstance().isStart = true;
		this.playUILoading.hide();
		this.enable = false;
		Global.postMessage(H5PlayerEvent.VIDEO_ONPLAYSTATE_CHANGED, H5Common.isHandoff?'7':'8');
		Global.getInstance().playstate = 'stopped';
		this.sendEvent(H5ComponentEvent.VIDEO_STATE, {
			'playstate' : Global.getInstance().playstate
		});
		this.sendEvent(H5ComponentEvent.VIDEO_TITLE, {
													'display' : 'none'
												});
		this.stopInter = setTimeout(() => {
							this.player.pause();
							this.video.hide();
						}, 0.5 * 1000);
	}
	
	toggleVideo() {
		if (Global.getInstance().playstate == 'playing') {
			this.pauseVideo();
		} else {
			this.playVideo(Global.getInstance().playstate == 'stopped'?this.pObj:null);
		}
	}

	pauseVideo() {
		if (Global.getInstance().playstate == 'playing') {
			this.player.pause();
			Global.getInstance().playstate = 'paused';
			this.sendEvent(H5ComponentEvent.VIDEO_STATE, {
				'playstate' : Global.getInstance().playstate
			});
			Global.postMessage(H5PlayerEvent.VIDEO_ONPLAYSTATE_CHANGED, '6');
		}
	}
	
	/**
	 * 开始视频播放
	 * @param {*} obj 
	 */
	playVideo(obj) {
		this.postAdInter && clearTimeout(this.postAdInter);
		if (obj) {
			this.pObj = obj;
			Global.getInstance().pObj = this.pObj;
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
				},{
					'key' : BIPCommon.PL,
					'value' : Global.getInstance().pObj['pl']
				}].forEach((item) => {
								this.sendEvent(H5ComponentEvent.VIDEO_STORAGE, item);
							});
			}catch(e){};
			this.stopInter && clearTimeout(this.stopInter);
			this.sendEvent(H5ComponentEvent.WEB_PLAY);
		} else {
			Global.postMessage(H5PlayerEvent.VIDEO_ONPLAYSTATE_CHANGED, '5');
			if (Global.getInstance().playstate == 'paused') {
				Global.debug('视频暂停后播放  >>>>>');
				Global.getInstance().isVodNoStart = false;
				this.playerPlayHandler();
			} else {
				Global.getInstance().vds = +new Date();
				this.replay();
				if (Global.getInstance().videoType == 1) {
					Global.debug('开始【点播】正片播放  >>>>>');
					Global.getInstance().isVodNoStart = true;
					/*********** 记忆播放点开始播放逻辑 start ***********/
					let posi = 0;
					if (!isNaN(H5Common.stime) && H5Common.isPay) posi = H5Common.stime;
					if (H5Common.isSkip) {
						try {
							for (let item of Global.getInstance().playData['point']) {
								if (item['type'] == 1 && item['time'] > 0) {
									posi = posi>item['time'] ? posi : item['time'];
								}
							}
						} catch (error) {}
					}
					this.seekVideo(posi);
					/*********** 记忆播放点开始播放逻辑 end ***********/
					if (!VIPPrivilege.isNoad && H5Common.isPay) {
						var inter_rs = setInterval(()=>{
							if (this.player.readyState == 4) {
								this.player.pause();
								Global.getInstance().playstate = 'paused';
								this.sendEvent(H5ComponentEvent.VIDEO_STATE, {
									'playstate' : Global.getInstance().playstate
								});
								clearInterval(inter_rs);
							}
						}, 0.3 * 1000);
					} else {
						this.enable = true;
						this.playerPlayHandler();
					}
				} else {
					Global.debug('开始【直播】正片播放  >>>>>');
					if (H5Common.isVod) {
						Global.getInstance().isVodNoStart = true;
						this.seekVideo(H5Common.stime);
						if (!VIPPrivilege.isNoad) {
							var inter_rs = setInterval(()=>{
								if (this.player.readyState == 4) {
									this.player.pause();
									Global.getInstance().playstate = 'paused';
									this.sendEvent(H5ComponentEvent.VIDEO_STATE, {
										'playstate' : Global.getInstance().playstate
									});
									clearInterval(inter_rs);
								}
							}, 0.3 * 1000);
						} else this.enable = true;
					} else {
						this.playerPlayHandler();
					}
				}
				this.resize();
				try{
					CommonUI.showMark(this.video, Global.getInstance().playData.mark);
				}catch(e){};
				try{
					CommonUI.showPno(this.video, Global.getInstance().playData.pno);
				}catch(e){};
			}
		}
	}

	/**
	 * 启动 或 重新开始播放
	 */
	replay() {
		this.sendEvent(H5ComponentEvent.VIDEO_BIP, {
													'dt' : 'bfr'
												});
		this.sendEvent(H5ComponentEvent.VIDEO_BIP, {
													'dt' : 'pv'
												});
		this.stopInter && clearTimeout(this.stopInter);
		try{
			[{
				'key' : BIPCommon.S,
				'value' : Global.getInstance().videoType
				},{
					'key' : BIPCommon.NOW,
					'value' : Global.getInstance().serverTime
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
					'value' : CTXQuery.cctx
				},{
					'key' : BIPCommon.DCTX,
					'value' : CTXQuery.dctx
				},{
					'key' : BIPCommon.SS,
					'value' : Global.getInstance().ss
				},{
					'key' : BIPCommon.UT,
					'value' : Global.getInstance().userInfo.ut
				},{
					'key' : BIPCommon.SECTIONID,
					'value' : H5Common.sectionId
				},{
					'key' : BIPCommon.VID,
					'value' : Global.getInstance().playData['kernal'].rid
				},{
					'key' : BIPCommon.IFID,
					'value' : Global.getInstance().ifid
				},{
					'key' : BIPCommon.CATAID1,
					'value' : Global.getInstance().cataid1
				},{
					'key' : BIPCommon.CATAID2,
					'value' : Global.getInstance().cataid2
				}].forEach((item) => {
								this.sendEvent(H5ComponentEvent.VIDEO_STORAGE, item);
							});
		}catch(e){};
		this.sendEvent(H5ComponentEvent.START_RECORD, {
															'target' : BIPCommon.TDS
													});
		
		if (this.kernal) {
			this.kernal.close();
			this.kernal = null;
		}
		this.kernal = PcPlayerComponent.createKernal(this.pObj, this.player);
		this.kernal.on('live_core_dac_log',  this.onKernalHandler);
		this.kernal.on('buffer_full',  this.onKernalHandler);
		this.kernal.on('buffer_empty', this.onKernalHandler);
		this.kernal.on('onair_show',   this.onKernalHandler);
		this.kernal.on('onair_hide',   this.onKernalHandler);
		this.kernal.on('play_complete',  this.onKernalHandler);
		this.kernal.on('play_failed',  this.onKernalHandler);
		this.kernal.on('stream_speed',  this.onKernalHandler);
		Global.postMessage(H5PlayerEvent.VIDEO_ONPLAYSTATE_CHANGED, '3');
	}

	static createKernal(pObj, player) {
		let deliveryTime = Global.getInstance().startTime;
		deliveryTime -= deliveryTime % Global.getInstance().playData.interval;
		let kernal = H5PcCore.createPlayerStream(player, {
			'videoType' : Global.getInstance().videoType
		});
		if (Global.getInstance().videoType == 1) {
			kernal.start(H5PcCore.createVodPlayInfo(
														Global.getInstance().playData['kernal'].host,
														Global.getInstance().playData['kernal'].backhost,
														pObj['cid'],
														Global.getInstance().playData['kernal'].rid,
														Global.getInstance().playData['kernal'].variables,
														Global.getInstance().playData['kernal'].bwtype,
														Global.getInstance().playData['kernal'].segments,
													));
		} else {
			kernal.start(H5PcCore.createLivePlayInfo(
														Global.getInstance().playData['kernal'].host,
														Global.getInstance().playData['kernal'].backhost,
														pObj['cid'],
														Global.getInstance().playData['kernal'].rid,
														Global.getInstance().playData['kernal'].variables,
														Global.getInstance().playData['kernal'].bwtype,
														deliveryTime,
														Global.getInstance().playData.delay,
														Global.getInstance().playData.interval,
														pObj['isVod']?pObj['etime']:-1
													));
		}
		return kernal;
	}

	onKernalHandler = (e) => {
		Global.debug('当前接收事件 ==>> ', e.type);
		switch(e.type) {
			case 'live_core_dac_log':
					let $info = e.data;
					let $kernelCtx = '';
					for (let i in $info) {
						$kernelCtx += (($kernelCtx.length == 0)?'':'&') + i + '=' + $info[i];
					}
					
					if ($kernelCtx.length > 0) {
						this.sendEvent(H5ComponentEvent.VIDEO_STORAGE, {
														'key' : BIPCommon.COREINFO,
														'value' : $kernelCtx
												});
					}
				break;
			case 'buffer_full':
					this.playUIPoster.hide();
					this.playUILoading.hide();
					this.isSeek = false;
					this.sendEvent(H5ComponentEvent.VIDEO_BUFFER_FULL);
					/* this.player.play();
					Global.getInstance().playstate = 'playing';
					this.sendEvent(H5ComponentEvent.VIDEO_STATE, {
						'playstate' : Global.getInstance().playstate
					}); */
					if (Global.getInstance().isStart) {
						Global.getInstance().vde = +new Date();
						Global.getInstance().isStart = false;
						this.sendEvent(H5ComponentEvent.VIDEO_BIP, {
							'dt' : 'sd'
						});
						this.sendEvent(H5ComponentEvent.VIDEO_START);
						if (!Global.getInstance().adRoll) {
							this.volume = Global.getInstance().bip.getValue('vol')?Global.getInstance().bip.getValue('vol'):H5Common.initVolume;
						} else {
							this.volume = 0;
						}
						this.sendOnline({'J':1});
						this.onlineInter = setInterval(() => {
							if (Global.getInstance().playstate == 'paused') {
								this.sendOnline({'J':3});
							} else if(Global.getInstance().playstate == 'playing') {
								this.sendOnline({'J':4});
							}
						}, this.onlineTime * 1000);
					} else {
						this.bufferInter && clearTimeout(this.bufferInter);
						this.bfInter && clearTimeout(this.bfInter);
						this.sendEvent(H5ComponentEvent.STOP_RECORD, {
							'target' : BIPCommon.BS
						});
						this.sendEvent(H5ComponentEvent.STOP_RECORD, {
							'target' : BIPCommon.OLBS
						});
						this.sendEvent(H5ComponentEvent.STOP_RECORD, {
							'target' : BIPCommon.TDD
						});
						this.sendEvent(H5ComponentEvent.STOP_RECORD, {
							'target' : BIPCommon.OLDST
						});
					}
				break;
			case 'buffer_empty':
					this.bufferInter && clearTimeout(this.bufferInter);
					this.bfInter && clearTimeout(this.bfInter);
					if (!Global.getInstance().isStart && !this.isSeek) {
						this.bufferInter = setTimeout(() => {
							if (this.bufferCountArr.length < 5) {
								if (this.bufferCountArr.length == 5) {
									if (this.bufferCountArr[4] - this.bufferCountArr[0] <= 60 * 1000) {
										Global.debug('一分钟卡顿缓冲5次出现提示...');
										this.sendEvent(H5ComponentEvent.VIDEO_BUFFER_TIP);
									}
									this.bufferCountArr.shift();
								}
							}
							//
							this.playUILoading.show();
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
						this.bfInter = setTimeout(() => {
							Global.debug('卡顿超过5秒出现提示...');
							this.sendEvent(H5ComponentEvent.VIDEO_BUFFER_TIP);
						}, 5 * 1000);
					}
				break;
			case 'onair_show':
				this.player.pause();
				this.sendEvent(H5ComponentEvent.VIDEO_ONAIR, {
					'errorcode' : H5Common.callCode.video[2],
					'msg' 		: '视频数据中断'
				})
				break;
			case 'onair_hide':
				this.player.play();
				this.sendEvent(H5ComponentEvent.VIDEO_ONAIR);
				break;
			case 'play_complete':
				if (Global.getInstance().videoType == 1) {
					Global.debug('播放自动结束，进入下一段节目 ===>>>');
					this.nextExecute();
				}
				break;
			case 'play_failed':
				this.sendEvent(H5ComponentEvent.VIDEO_FAILED, {
					'errorcode' : H5Common.callCode.video[1],
					'msg' 		: '视频数据异常'
				});
				break;
			case 'stream_speed':
				this.sendEvent(H5ComponentEvent.VIDEO_STORAGE, {
					'key' : BIPCommon.SR,
					'value' : e.data
				});
				break;
		}
	}

	nextExecute() {
		this.stopVideo();
		if (Global.getInstance().autoplay) {
			Global.debug('播放自动结束，轮播开始 ===>>>');
			this.playVideo(this.pObj);
		} else {
			Global.postMessage(H5PlayerEvent.VIDEO_ONPLAYSTATE_CHANGED, '8');
			this.postAdInter = setTimeout(() => {
				this.sendEvent(H5ComponentEvent.VIDEO_POST);
			}, 1 * 1000);
			Global.postMessage(H5PlayerEvent.VIDEO_ONNOTIFICATION, {
																		'header' : {
																			'type' : 'nextvideo'
																		},
																		'body' : {
																			'data' : {
																				'autoPlayNext':this.videoAutoPlayNext ? 1 : 0
																			}
																		}
																	});
		}
		this.videoAutoPlayNext = true;
	}
	
	playerPlayHandler(){
		let e = this.player.play();
			e && e.catch((e) => {
				if(e.code != 20)
				{
					Global.getInstance().playstate = 'paused';
					this.sendEvent(H5ComponentEvent.VIDEO_STATE, {
						'playstate' : Global.getInstance().playstate
					});
					return;
				}	                
            });
			Global.getInstance().playstate = 'playing';
			this.sendEvent(H5ComponentEvent.VIDEO_STATE, {
				'playstate' : Global.getInstance().playstate
			});
	}
		
	//设置视频音量
	set volume(vol) {
		H5Common.currVolume = vol;
		try {
			if (!Global.getInstance().adRoll) {
				this.sendEvent(H5ComponentEvent.VIDEO_VOLUME_STATE, {
					'volume': vol
				});
			}
			if (vol > 0) {
				Global.getInstance().volume = vol;
				Global.getInstance().bip.setValue('vol', vol, false);
			}
			vol = vol / 100;
			if (vol >= 0 && vol <= 1) {
				this.player.volume = vol;
			}
		}catch(e) { };
	}

	/**
	 * 检测视频单、双击事件
	 * @param	bool
	 */
	checkDoubleClick(bool) {
		this.$isDoubleClick = false;
		this.$doubleInter && clearTimeout(this.$doubleInter);
		if (bool) this.toggleVideo();
	}
	
	//显示定时上线倒计时
	showCountdown(obj) {
		let block = new Countdown(Global.getInstance().pbox);
		block.addTime(obj['time']);
		block.addEventListener(H5ComponentEvent.VIDEO_COUNTDOWN, (e) => {
																	block.remove();
																	//节目倒计时结束后无法直接播放，必须手动点击
																	this.playVideo(this.pObj);
																})
	}

	/**
	 * 视频播放全屏处理
	 */
	fullscreenVideo(isZoomIn) {
		if (isZoomIn) {
			let del = Global.getInstance().pbox[0];
			if ($.isFunction(del.requestFullscreen)) {
				del.requestFullscreen();
			} else if ($.isFunction(del.webkitRequestFullScreen)) {
				del.webkitRequestFullScreen();
			} else if ($.isFunction(del.mozRequestFullScreen)) {
				del.mozRequestFullScreen();
			} else {
				alert('Your browsers doesn\'t support fullscreenAPI');
			}
		} else {
			if ($.isFunction(document.exitFullscreen)) {
				document.exitFullscreen();
			} else if ($.isFunction(document.webkitCancelFullScreen)) {
				document.webkitCancelFullScreen();
			} else if ($.isFunction(document.mozCancelFullScreen)) {
				document.mozCancelFullScreen();
			} else {
				alert('Your browsers doesn\'t support fullscreenAPI');
			}
		}
	}
	
	/**
	 * check是否全屏状态
	 */
	get isFullscreen() {
		return document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen || false;
	}

	get enable() {
		return this.videoEnable;
	}

	set enable(enabled) {
		this.videoEnable = enabled;
		this.video[enabled?'show':'hide']();
		this.playerBox.css('pointer-events', enabled ? 'auto' : 'none');
		if (enabled) {
			this.volume = Global.getInstance().bip.getValue('vol')?Global.getInstance().bip.getValue('vol'):H5Common.initVolume;
		}
	}
}