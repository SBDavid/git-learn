/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import $ from 'jquery';
import Global from "manager/Global";
import { CommonUI } from "../../component/CommonUI";
import { ErrorTip } from "../../component/ErrorTip";
import { UIComponent } from "../../component/UIComponent";
import H5ComponentEvent from "../../event/H5ComponentEvent";
import DownloadManager from "manager/DownloadManager";
import { H5CommonUtils } from "common/H5CommonUtils";
import JcropManager from "manager/JcropManager";
import TipsManager from "manager/TipsManager";
import { H5Common } from "common/H5Common";

export class MobileSkinComponent extends UIComponent {

	constructor() {
		super();
		this.boxHtml = CommonUI.mobileboxHtml.replace(/\[TITLE\]/g, Global.getInstance().title?Global.getInstance().title:'');
		Global.getInstance().pbox.html(this.boxHtml);
		//
		this.playTips = Global.getInstance().pbox.find('.p-video-tip3'),
		this.playUIBigPlay = Global.getInstance().pbox.find('.p-video-button');
		this.playUIControl = Global.getInstance().pbox.find('.control');
		this.playUIPlayContainer =  this.playUIControl.find('.p-play-container');
		this.playUIPlay =  this.playUIPlayContainer.find('.p-playPause-button');
		this.playUIZoom = this.playUIControl.find('.zoomIn');
		this.playUICurrentTime = this.playUIControl.find('.current');
		this.playUIToTalTime = this.playUIControl.find('.total');
		this.playUIProsser = this.playUIControl.find('.progress');
		this.playUIBufferBar = this.playUIControl.find('.bufferBar');
		this.playUIPosiBar = this.playUIControl.find('.posiBar');
		this.playUITimer = this.playUIControl.find('.time');
		this.playUIDrag = this.playUIControl.find('.drag');
		this.playUITitle = Global.getInstance().pbox.find('.p-video-title');
		this.playUICountDown = Global.getInstance().pbox.find('.p-video-countdown');
		this.playUICountDownApp = Global.getInstance().pbox.find('.countdown-btn');
		this.playUITips = Global.getInstance().pbox.find('.p-tips');
		this.playUITipLogin = Global.getInstance().pbox.find('.p-video-tip3 .rightCorner .tipLogin');
		//
		this.playUIDrag.css({'display':'block'});
		this.delayTime = 5;
		this.fadeTime = 0.3;
		this.inter = null;
		this.bufferInter = null;
		this.timeObj = null;
		this.speedResult = null;
		this.onUIHandler();
	}

	//进度条适宽
	resize() {
		setTimeout(()=>{
			this.rem = parseFloat(document.documentElement.style.fontSize);
			let $left = this.playUIPlayContainer.width() + this.playUIPlayContainer.position().left + 15,
				$width = Global.getInstance().video.width() - $left*2;
			this.playUIProsser.css({
				'left' : (parseInt(this.playUIProsser.css('top')) < 0 ? 0 : $left) / this.rem + 'rem',
				'width' : (parseInt(this.playUIProsser.css('top')) < 0 ? Global.getInstance().video.width() : $width) / this.rem + 'rem'
			});
			this.playUITimer.css({
				'left' : $left / this.rem + 'rem',
				'width' : $width / this.rem + 'rem'
			});
			if (this.errorTip) this.errorTip.resize();
			this.addPostImage();
		}, 0);
	}

	addPostImage() {
		var img = new Image();
		img.id = 'post_img';
		img.src = H5CommonUtils.getDomainUrl() + '/dist/assets/p-player.jpg';
		img.style.cssText = 'position:absolute;z-index:-100;';
		JcropManager.getInstance().addImage(this.playTips, img, true);
	}

	onUIHandler() {
		this.playUITipLogin.on('click', (e) => {
											top.window.open('//i.pptv.com/h5user/login?target=new&back=' + encodeURIComponent(top.window.location.href) + '&type=login&mobile=1&tab=login', '_self');
										});
		this.playUIBigPlay.on('click', (e) => {
											this.playUIBigPlay.hide();
											this.sendEvent(H5ComponentEvent.VIDEO_PLAY);
										});
		this.playUIPlay.on('click', 	(e) => {
											this.sendEvent(H5ComponentEvent.VIDEO_PLAY);
										});
		this.playUIZoom.on('click', 	(e) => {
											this.displayScreenState(this.playUIZoom.hasClass('zoomIn'));
											this.sendEvent(H5ComponentEvent.VIDEO_SCREEN, {
																							'zoom' : this.playUIZoom.hasClass('zoomOut')
																						});
										});
		this.playUIProsser.on('click', 	(e) => {
											if (Global.getInstance().videoType == 10) return;
											e.preventDefault();
											this.updatePosition(e.clientX);
											this.sendEvent(H5ComponentEvent.VIDEO_SEEK);
										});
		this.playUIDrag.on('touchstart',(e) => {
											if (Global.getInstance().videoType == 10) return;
											e.preventDefault();
											if(e.touches.length == 1){
												let touch = e.touches[0];
												Global.getInstance().player.pause();
												this.isTouching = true;
												this.startX = touch.clientX;
											}
										});
		this.playUIDrag.on('touchmove', (e) => {
											if (Global.getInstance().videoType == 10) return;
											e.preventDefault();      
											if(this.isTouching && e.touches.length == 1){
												let touch = e.touches[0];  
												this.currentX = touch.clientX;
												this.updatePosition(this.currentX);
											}
										});
		this.playUIDrag.on('touchend',  (e) => {
											if (Global.getInstance().videoType == 10) return;
											e.preventDefault();
											this.startX = this.currentX;
											this.isTouching = false;
											this.sendEvent(H5ComponentEvent.VIDEO_SEEK);
										});
		this.playUICountDownApp.find('a').on('click', (e) => {
			this.download();
		});
		this.playTips.find('a').on('click', (e) => {
											if (/know/gi.test(e.target.className)){
												this.playTips.hide();
												this.sendEvent(H5ComponentEvent.VIDEO_REPLAY);
											} else if (/app/gi.test(e.target.className)) {
												if (Global.getInstance().isVipMovie) {
													if (Global.getInstance().userInfo && Global.getInstance().userInfo.uid) {
														//【登录用户】
														if (Global.getInstance().userInfo.isvip) {
															//【会员用户】
															this.download();
														} else {
															//【普通用户】
															actPay(Global.getInstance().cid, Global.getInstance().ctx.o);
														}
													} else {
														//【未登录用户】
														actPay(Global.getInstance().cid, Global.getInstance().ctx.o);
													}
												} else {
													//【非会员节目】
													this.download();
												}
											} else if (/center/gi.test(e.target.className)) {
												this.download();
											}
										});
		//跳转支付页接口拼接
		function actPay(cid, channel) {
			top.window.open('//pay.vip.pptv.com/actpayh5/?logintype=msite&aid=content_wap_neirongshikan&fromchannel=' + encodeURIComponent('cid=' + cid +'&channel=' + channel), '_self');
		}
	}

	//体育APP接口判断
	download() {
		//获取url地址中的参数
		let rcc_channel_id = H5CommonUtils.getQueryString('rcc_channel_id') || -1;
		//H5Common.isSport == 1 为体育节目
		let live = '';  
		if (H5Common.isSport == 1) {
			if (Global.getInstance().videoType == 1) {
				//点播 
				live = [
						'action=vod',
						'video_id=' + Global.getInstance().cid,
						'channel_id=' + Global.getInstance().adConfig.chid,
						'startTime=' + Global.getInstance().posiTime,
						'rcc_channel_id=' + rcc_channel_id,
					].join('&');
			} else {
				//直播
				live = [
						'action=live', 
						'channel_id=' + Global.getInstance().cid,
						'startTime=' + Global.getInstance().posiTime,
						'rcc_channel_id=' + rcc_channel_id,
					].join('&'); 
			}
			live = encodeURIComponent(live);
		} else {
				live = 'page/player/halfscreen?';
				live+= [
						'type=vod',
						'vid=' + Global.getInstance().cid,
						'sid=' + Global.getInstance().adConfig.chid,
						'startTime=' + Global.getInstance().posiTime,
						'userfrom=play_end'  // 数据统计用
					].join('&');
		}
		live += '&utm=178';
		DownloadManager.getInstance().goToApp('//app.aplus.pptv.com/minisite/pptvaphone/m_app_down/pg_xiazai3', live , H5Common.isSport);
	}

	//安装APP弹层显示
	showTip(bool) {
		if (bool){
			Global.getInstance().pbox.off('touchstart');
			this.playUIControl.css({'bottom' : '-1.2rem'});
			this.playUITipLogin.hide();
			this.playTips.find('.btns').css('display', 'block');
			this.playTips.find('.oths').css('display', 'none');
			if (!this.apptempUI) this.apptempUI = this.playTips.find('.app');
			if (!this.knowtempUI) this.knowtempUI = this.playTips.find('.know');
			let tname = H5Common.isSport == 1 ? '体育' : '视频';
			let appUI, knowUI, contentUI = this.playTips.find('.content'), centerUI = this.playTips.find('.center');
			this.addPostImage();
			if(Global.getInstance().videoType != 1)//直播没有再看一次
			{
				this.playTips.find('.btns').css('display', 'none');
				this.playTips.find('.oths').css('display', 'block');
				contentUI.html('试看已结束<br />请下载PP' + tname + '客户端继续观看精彩内容');
				centerUI.html('下载PP' + tname);
				this.playTips.show();
				return;
			}
			knowUI = this.apptempUI.attr('class', 'know').addClass('left');
			appUI = this.knowtempUI.attr('class', 'app').addClass('right');
			knowUI.html('再看一次');
			if (Global.getInstance().isVipMovie) {
				if (Global.getInstance().userInfo && Global.getInstance().userInfo.uid) {
					//【登录用户】
					if (Global.getInstance().userInfo.isvip) {
						//【会员用户】
						appUI.html('观看完整版');
						contentUI.html('试看已结束<br />下载PP' + tname + '客户端观看完整版');
					} else {
						//【普通用户】
						appUI.html('开通VIP会员');
						contentUI.html('试看已结束<br />开通VIP会员可免费观看');
					}
				} else {
					//【未登录用户】
					this.playUITipLogin.show();
					appUI.html('开通VIP会员');
					contentUI.html('试看已结束<br />开通VIP会员可免费观看');
				}
			} else {
				//【非会员节目】
				appUI.html('观看完整版');
				contentUI.html('试看已结束<br />下载PP' + tname + '客户端观看完整版');
			}
			this.playTips.show();
		} else {
			this.playTips.hide();
		}
	}

	displayScreenState(screenstate) {
		if (screenstate) {
			this.playUIZoom.removeClass('zoomIn').addClass('zoomOut');
		} else {
			this.playUIZoom.removeClass('zoomOut').addClass('zoomIn');
		}
	}
	
	//播控按钮状态更新
	displayState(playstate) {
		if(playstate == 'playing') {
			this.playUIBigPlay.hide();
			this.playUIPlay.removeClass('p-go').addClass('p-pause');
		} else {
			if (!H5Common.isPlayAdv )this.playUIBigPlay.show();
			this.playUIPlay.removeClass('p-pause').addClass('p-go');
			if (playstate == 'stopped') this.showTime(0, 0);
		}
	}

	//播放控制栏效果
	controlAnimate(bool) {
		this.resize();
		this.playUITitle.css({'display' : 'block'});
		this.playTitleTop = this.playUITitle.find('span').position().top;
		let animate = (dis0, dis1, cb) => {
						this.playUIControl.animate({
													'bottom' : dis0 + 'rem'
												},
												this.fadeTime * 1000, 'swing', cb || function(){});
						this.playUITitle.animate({
													'top' : dis1 + 'rem'
											}, 
												this.fadeTime * 1000, 'swing');
						this.playUICountDownApp.animate({
													'top' : dis1 * 2  +  this.playTitleTop / this.rem +'rem'
												}, 
												this.fadeTime * 1000, 'swing');						
												
						this.playUICountDown.animate({
													'top' : dis1 + (this.playUITitle.height() + this.playTitleTop) / this.rem + 'rem'
											}, 
												this.fadeTime * 1000, 'swing');
					};
		if (bool) {
			let $left = this.playUIPlayContainer.width() + this.playUIPlayContainer.position().left + 15;
			this.playUIProsser.css({
				'left' : $left / this.rem + 'rem',
				'top' : 0.6 + 'rem',
				'width' : (Global.getInstance().video.width() - $left * 2) / this.rem + 'rem'
			});
			this.playUIDrag.css({'display':'block'});
			animate(0, 0);
			if (this.inter) clearTimeout(this.inter);
			this.inter = setTimeout(() => {
							animate(-1.2, (-this.playUITitle.height()-this.playTitleTop) / this.rem, ()=>{
								this.playUIProsser.css({
									'left' : 0,
									'top' : -this.playUIProsser.height() / this.rem + 'rem',
									'width' : Global.getInstance().video.width() / this.rem + 'rem'
								});
								this.playUIDrag.css({'display':'none'});
							});
						}, this.delayTime * 1000);
		} else {
			animate(-1.2, (-this.playUITitle.height()-this.playTitleTop) / this.rem, ()=>{
				this.playUIProsser.css({
					'left' : 0,
					'top' : -this.playUIProsser.height() / this.rem + 'rem',
					'width' : Global.getInstance().video.width() / this.rem + 'rem'
				});
				this.playUIDrag.css({'display':'none'});
			});
		}
	}

	//进度条更新
	position(per) {  
		let linearObj = {
							'width' : per + '%',
							'background' : '-webkit-linear-gradient(left, #00ADEF '+ (per<20?0:60) + '%, #47CCFE)'
						}
		this.playUIPosiBar.css(linearObj);
		per = 100 * (this.playUIProsser.width() * per / 100 - this.playUIDrag.width() / 2) / this.playUIProsser.width(); 
		this.playUIDrag.css('left', per + '%');
	}

	//时间、进度更新
	update(obj) {  
		this.timeObj = obj;
		this.showTime(obj['posi'], obj['end'] - obj['start']);
		let per = 100;
		if (Global.getInstance().videoType != 10) {
			per = 100 * obj['posi'] / (obj['end'] - obj['start']);
		}
		this.position(per);
	}

	updatePosition(x) {  
		let position = x - this.playUIProsser.offset().left;
		let per = 100 * position / this.playUIProsser.width();
		per = (per >= 0) ? (() => {
			if(per >= 100) {
				return 100;
			}
			return per;
		})() : 0;
		this.position(per);
		Global.getInstance().posiTime = (this.timeObj['end'] - this.timeObj['start']) * per / 100;
		this.showTime(this.timeObj['posi'], this.timeObj['end'] - this.timeObj['start']);
	}

	//显示时间
	showTime(posi, dur) {
		if (Global.getInstance().videoType != 10) {
			let total = H5CommonUtils.timeFormat(dur, false);
			this.playUICurrentTime.text(H5CommonUtils.timeFormat(posi, false, total.split(':').length > 2));
			this.playUIToTalTime.text(total);
		} else {
			this.playUICurrentTime.text('现场直播');
			this.playUIToTalTime.text(this.timeObj['live'] != undefined ? H5CommonUtils.timeFormat(this.timeObj['live'], true) : '');
		}
	}

	showBuffer() {
		if (this.bufferInter) clearTimeout(this.bufferInter);
		try {
			let currentBuffer = Global.getInstance().player.buffered.end(0);
			let per = 100 * currentBuffer / Global.getInstance().duration;
			if (per > 100) per = 100;
			this.playUIBufferBar.css('width', per + '%');
			if (currentBuffer < Global.getInstance().duration) {
				this.bufferInter = setTimeout(() => {
									this.showBuffer();
								}, 0.5 * 1000);
			}
		}catch(e){}
	}
	
	showCountDown(obj) {
		this.playUICountDownApp.css({'display' : 'block'});
		this.playUICountDown.find('span').html(  Math.floor(obj / 60) + '分' + (obj % 60) + '秒后试看结束');
	}

	showError(errorcode, ...rest) {
		if (!this.errorTip) {
			this.errorTip = new ErrorTip(Global.getInstance().pbox);
		}
		this.errorTip.setData(errorcode, rest);
		this.errorTip.resize();
	}

	reset() {
		if (this.errorTip) {
			this.errorTip.target.remove();
			this.errorTip = null;
		}
		this.playTips.hide();
	}

}
