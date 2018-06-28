/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import $ from 'jquery';
import Global from "manager/Global";
import { PayTip } from "../../component/PayTip";
import { CommonUI } from "../../component/CommonUI";
import { ErrorTip } from "../../component/ErrorTip";
import { ButtonTip } from "../../component/ButtonTip";
import { RecomUI as Recom } from "../../component/RecomUI";
import { Contextmenu } from "../../component/Contextmenu";
import { UIComponent } from "../../component/UIComponent";
import { CenterUI as Center } from "../../component/CenterUI";
import H5ComponentEvent from "../../event/H5ComponentEvent";
import { H5CommonUtils } from "common/H5CommonUtils";
import H5PlayerEvent from "common/H5PlayerEvent";
import VIPPrivilege from "common/VIPPrivilege";
import TipsManager from "manager/TipsManager";
import { H5Common } from "common/H5Common";
import BIPCommon from "bip/BIPCommon";

const ftName = ['流 畅', '高 清', '超 清', '蓝 光'];
const langName = ['国 语', '粤 语', '英 语', '韩 语', '日 语'];

export class PcSkinComponent extends UIComponent {

	constructor() {
		super();
		this.boxHtml = CommonUI.pcboxHtml.replace(/\[TITLE\]/g, Global.getInstance().title?Global.getInstance().title:'');
		Global.getInstance().pbox.html(this.boxHtml);
		//
		this.playUITips = Global.getInstance().pbox.find('.w-tips');
		this.playUIBigPlay = Global.getInstance().pbox.find('.w-video-button');
		this.playUIHandy = Global.getInstance().pbox.find('.w-handy');
		this.playUIShare = this.playUIHandy.find('.w-share');
		this.playUIQrcode = this.playUIHandy.find('.w-qrcode');
		this.playUIControl = Global.getInstance().pbox.find('.w-control');
		this.playUIControlLeft = this.playUIControl.find('.w-control-left');
		this.playUIControlRight = this.playUIControl.find('.w-control-right');
		this.playUIPlay =  this.playUIControl.find('.w-play-container .w-playPause-button');
		this.playUINext = this.playUIControl.find('.w-next-container');
		this.playUIStop = this.playUIControl.find('.w-stop-container');
		this.playUITimer = this.playUIControl.find('.w-time');
		this.playUIBarrage = this.playUIControl.find('.w-barrage-container .w-barrage');
		this.playUILang = this.playUIControl.find('.w-lang');
		this.playUIFt = this.playUIControl.find('.w-ft');
		this.playUISound = this.playUIControl.find('.w-sound-container .w-sound');
		this.playUISetup = this.playUIControl.find('.w-setup-container');
		this.playUIExpand = this.playUIControl.find('.w-expand-container .w-expandIn');
		this.playUIZoom = this.playUIControl.find('.w-zoom-container .w-zoomIn');
		this.playUISlider = this.playUIControl.find('.w-progress .w-progress-slider');
		this.playUIPosiBar = this.playUISlider.find('.w-posiBar');
		this.playUISliderActive = this.playUISlider.find('.w-active');
		this.playUIDrag = this.playUISlider.find('.w-drag');
		//
		Global.getInstance().playUITips = this.playUITips;
		this.center = new Center(Global.getInstance().pbox);
		this.center.addEventListener('center_close', (e)=>{
			this.sendEvent(H5ComponentEvent.VIDEO_CENTER, {
				'display' : 'none'
			});
		});
		this.btnTip = new ButtonTip(Global.getInstance().pbox);
		this.btnTip.addEventListener('show_btn_tip', (e, data)=>{
			if (data && data['isShow']) {
				this.inter && clearTimeout(this.inter);
			} else {
				this.btnTip.hide();
			}
		});
		this.btnTip.addEventListener('change_rate', (e, data)=>{
			this.sendEvent(H5ComponentEvent.VIDEO_SWITCH, {
				'ft' : ftName.indexOf(data['currftName'])
			});
		});
		this.btnTip.addEventListener('change_language', (e, data)=>{
			if (data['chid'] == Global.getInstance().cid) {
				return;
			}
			Global.postMessage(H5PlayerEvent.VIDEO_ONNOTIFICATION, {
																		'header' : {
																			'type' : 'changelanguage'
																		},
																		'body' : {
																			'data' : data
																		}
																	});
		});
		this.btnTip.addEventListener('change_setting', (e, data)=>{
			if (data['type'] == 'skip') {
				H5Common.isSkip = data['select'];
				Global.getInstance().bip.setValue('skip', H5Common.isSkip, false);
			}
		});
		this.drag_key = false;
		this.goliveInter = 0;
		this.enable = false;
		this.UIHandyToRight = 10;
		this.UIBigPlayToLeft = 16;
		this.UIBigPlayToBottom = 48;
		this.playUIBigPlay.hide();
		this.onUIHandler();
	}

	resize() {
		this.standardWidth = this.playUIControl.width() - this.playUIDrag.width();
		try{
			let sliderWidth = sliderWidth = this.standardWidth * (this.timeObj['posi'] - this.timeObj['start']) / (this.timeObj['end'] - this.timeObj['start']);
			this.position(sliderWidth);
		}catch(evt){}
		H5Common.isShowControl = (this.playUIControlLeft.width() + this.playUIControlRight.width() < Global.getInstance().pbox.width());
		this.playUIHandy.css({
			'top' : Global.getInstance().pbox.height() - this.playUIHandy.height() >> 1,
			'right' : H5Common.isShowControl ? this.UIHandyToRight : -this.playUIHandy.width()
		});
		this.playUIBigPlay.css({
			'left' : H5Common.isShowControl ? this.UIBigPlayToLeft : (Global.getInstance().pbox.width()-this.playUIBigPlay.width()>>1),
			'bottom' : H5Common.isShowControl ? this.UIBigPlayToBottom : (Global.getInstance().pbox.height()-this.playUIBigPlay.height()>>1)
		});
		this.playUIControl.css({'display' : H5Common.isShowControl?'block':'none'});
		!H5Common.isShowControl && this.center && this.center.hide();
		if (this.errorTip) this.errorTip.resize();
		if (this.payTip) this.payTip.resize();
		if (this.recom) this.recom.resize();
		if (this.playUISlider.find('.w-point').length > 0) {
			this.playUISlider.find('.w-point').each((index, item)=>{
				$(item).css({'left' : $(item).attr('attr_time') / Global.getInstance().playData['duration'] * this.standardWidth});
			});
		}
	}

	onUIHandler() {
		this.playUIBigPlay.on('click', (e) => {
			this.sendEvent(H5ComponentEvent.VIDEO_PLAY);
		});
		this.playUIPlay.on('click', (e) => {
			this.sendEvent(H5ComponentEvent.VIDEO_PLAY);
		});
		this.playUINext.on('click', (e) => {
			H5Common.isHandoff = 1;
			this.reset();
			this.sendEvent(H5ComponentEvent.VIDEO_NEXT);
		});
		this.playUIStop.on('click', (e) => {
			H5Common.isHandoff = 1;
			this.reset();
			this.sendEvent(H5ComponentEvent.VIDEO_STOP);
		});
		this.playUITimer.find('.w-total').on('click', (e) => {
			if (e.target.tagName.toLowerCase() == "a") {
				if (H5Common.isVod) {
					//回看节目时点击回到直播点，重走播放流程
					this.goliveInter && clearTimeout(this.goliveInter);
					this.goliveInter = setTimeout(()=>{
						H5Common.isVod = 0;
						H5Common.stime = NaN;
						H5Common.etime = NaN;
						this.sendEvent(H5ComponentEvent.VIDEO_TOGGLE);
					}, 2 * 1000);
					Global.postMessage(H5PlayerEvent.VIDEO_ONNOTIFICATION, {
						'header' : {
							'type' : 'golive'
						},
						'body' : {}
					});
				} else {
					//出现节目延迟时点击回到直播点
					this.sendEvent(H5ComponentEvent.VIDEO_SEEK, {
						'seektime' : this.timeObj['end']
					});
				}
			}
		});
		this.playUIBarrage.on('click', (e) => {
			Global.getInstance().barrageDisplay = !Global.getInstance().barrageDisplay;
			this.barrageOn_Off = Global.getInstance().barrageDisplay;
		});
		this.playUISound.on('click', (e) => {
			if (Global.getInstance().adRoll) {
				this.sendEvent(H5ComponentEvent.VIDEO_VOLUME_ADV);
				return;
			}
			let vol = this.playUISound.hasClass('w-sound')?0:Global.getInstance().volume;
			this.sendEvent(H5ComponentEvent.VIDEO_VOLUME, {
				'volume': vol
			});
		});
		this.playUIExpand.on('click', (e) => {
			this.sendEvent(H5ComponentEvent.VIDEO_SCREEN, {
				'zoom' : false
			});
			Global.postMessage(H5PlayerEvent.VIDEO_ONNOTIFICATION, { 
																	'header' : {
																		'type' : 'theatre'
																	},
																	'body' : {
																		'data' : { 
																			'mode': !this.expandMode
																		}
																	}
																});
		});
		this.playUIZoom.on('click', (e) => {
			this.sendEvent(H5ComponentEvent.VIDEO_SCREEN, {
				'zoom' : this.playUIZoom.hasClass('w-zoomIn')
			});
		});
		['mouseenter', 'mouseleave', 'mousemove', 'click'].forEach((itemType)=>{
			this.playUISlider.on(itemType, (e) => {
				switch(itemType){
					case 'mouseenter':
					case 'mousemove':
						this.clientX = e.clientX - this.playUIControl.offset().left;
						this.sendEvent(H5ComponentEvent.VIDEO_PREVIEW_SNAPSHOT, {
							'posi' : e.target.className == 'w-point' ? $(e.target).attr('attr_time') : this.posi
						});
						break;
					case 'mouseleave':
						this.sendEvent(H5ComponentEvent.VIDEO_PREVIEW_SNAPSHOT);
						break;
					case 'click':
						this.clientX = e.clientX - this.playUIControl.offset().left;
						this.setPositionToTime();
						break;
				}
			});
		});
		[this.playUIPlay, this.playUINext, this.playUIStop, this.playUIBarrage, this.playUILang, this.playUIFt, this.playUISound, this.playUISetup, this.playUIExpand, this.playUIZoom].forEach((item) => {
			item.on('mouseenter', (e) => {
				this.inter && clearTimeout(this.inter);
				let $content = ['<span style="white-space: nowrap;">', '</span>'];
				this.btnTip.className = 'w-btntip';
				if ($(e.currentTarget).hasClass('w-play')) {
					$content.splice(1, 0, "播 放");
				}
				if ($(e.currentTarget).hasClass('w-pause')) {
					$content.splice(1, 0, "暂 停");
				}
				if ($(e.currentTarget).hasClass('w-next-container')) {
					$content.splice(1, 0, "下一集");
				}
				if ($(e.currentTarget).hasClass('w-stop-container')) {
					$content.splice(1, 0, "停 止");
				}
				if ($(e.currentTarget).children().hasClass('w-barrage-open')) {
					$content.splice(1, 0, "关闭弹幕");
				}
				if ($(e.currentTarget).children().hasClass('w-barrage-close')) {
					$content.splice(1, 0, "开启弹幕");
				}
				if ($(e.currentTarget).hasClass('w-expandIn')) {
					$content.splice(1, 0, "剧场模式");
				}
				if ($(e.currentTarget).hasClass('w-expandOut')) {
					$content.splice(1, 0, "退出剧场");
				}
				if ($(e.currentTarget).hasClass('w-zoomIn')) {
					$content.splice(1, 0, "全 屏");
				}
				if ($(e.currentTarget).hasClass('w-zoomOut')) {
					$content.splice(1, 0, "退出全屏");
				}
				if ($(e.currentTarget).hasClass('w-setup-container')) {
					this.btnTip.className = 'w-setting';
					$content = ['<div style="width: auto;text-align: left;">', '</div>'];
					for (let item of [{'title':'自动跳过片头片尾','type':'skip'}]) {
						$content.splice(1, 0, '<a attr_type="'+item['type']+'"><span class="'+(item['type']=='skip'&&H5Common.isSkip?'select':'')+'"></span>'+item['title']+'</a>');
					}
				}
				if ($(e.currentTarget).hasClass('w-ft')) {
					this.btnTip.className = 'w-rate';
					$content = ['<div style="width: auto;text-align: left;">', '</div>'];
					for (let item of Global.getInstance().stream) {
						if (item) {
							$content.splice(1, 0, '<div ft-vip="'+item.vip+'" ft-name="'+ftName[item.ft]+'" class="w-ftname w-ft-'+item.ft+'" style="padding:0 10px;cursor:pointer;color:'+ (item.ft==H5Common.ft?'#3399ff':(item.vip!=0?'#FF7200':'#9b999b'))+'">'+ftName[item.ft]+(item.vip!=0?'（会员）':'')+'</div>');
						}
					}
				}
				if ($(e.currentTarget).hasClass('w-lang')) {
					this.btnTip.className = 'w-language';
					$content = ['<div style="width: auto;text-align: left;">', '</div>'];
					for (let item of Global.getInstance().playData['lang']) {
						$content.splice(1, 0, '<div class="w-ftname w-ft-'+item.chid+'" style="padding:0 10px;cursor:pointer;color:'+ (item.chid==Global.getInstance().cid?'#3399ff':'#9b999b')+'">'+langName[item.type]+'</div>');
					}
				}
				if ($(e.currentTarget).hasClass('w-sound') || $(e.currentTarget).hasClass('w-mute')) {
					if ($(e.currentTarget).hasClass('w-sound')) {
						this.showVolumeHorn('#3399ff');
					}
					this.btnTip.className = 'w-volume-slider';
					$content = [
								'<div class="volume-progress">',
									'<div class="volume-bufferBar" />',
									'<div class="volume-posiBar" />',
									'<div class="volume-drag" />', 
								'</div>'
							]
				}
				if ($content) {
					this.btnTip.data = {
						'content' : $content.join(''),
						'clientX' : $(e.currentTarget).offset().left - this.playUIControl.offset().left + $(e.currentTarget).width() / 2
					}
					if (this.btnTip.className == 'w-volume-slider') {
						this.v_standard = this.btnTip.target.find('.volume-bufferBar').height();
						this.v_top = this.btnTip.target.find('.volume-bufferBar').position().top;
						this.setVolumePosi((1-H5Common.currVolume / 100) * this.v_standard);
						this.btnTip.addEventListener('change_volume', (e, data)=>{
							let disH = data['currY'] - this.v_top;
							if (disH < 0) {
								disH = 0;
							} else if (disH > this.v_standard) {
								disH = this.v_standard;
							}
							this.setVolumePosi(disH);
							let vol = (1 - disH / this.v_standard) * 100 >> 0;
							this.sendEvent(H5ComponentEvent.VIDEO_VOLUME, {
								'volume': vol
							});
						});
					}
				}
			})
			item.on('mouseleave', (e) => {
				if ($(e.currentTarget).hasClass('w-sound') || $(e.currentTarget).hasClass('w-mute') || $(e.currentTarget).hasClass('w-ft') || $(e.currentTarget).hasClass('w-lang') || $(e.currentTarget).hasClass('w-setup-container')) {
					if ($(e.currentTarget).hasClass('w-sound')) {
						this.showVolumeHorn('#9b999b');
					}
					this.inter = setTimeout(()=>{
						this.btnTip.hide();
					}, .5 * 1000);
				} else {
					this.btnTip.hide();
				}
			})
		});
		[this.playUIShare, this.playUIQrcode].forEach((item) => {
			$(item).on('click', (e)=>{
				let className_suffix = e.currentTarget.className.split(' ')[1].split('-')[1];
				this.center['setData_'+className_suffix]();
				this.sendEvent(H5ComponentEvent.VIDEO_CENTER, {
					'display' : 'block'
				});
			});
		});
		Global.getInstance().pbox.on('contextmenu', (e) => {
			e.preventDefault();
			try{
				if (!this.contextmenu) this.contextmenu = new Contextmenu(Global.getInstance().pbox);
				let $rect = Global.getInstance().pbox.offset();
				this.contextmenu.setLocation({
					'left' : e.clientX - $rect.left,
					'top' : e.clientY - ($rect.top - $(window).scrollTop())
				});
			}catch(e){}
			return false;
		});
	}

	showBufferTip() {
		let $content = '<span style="float: left;margin: auto 15px;line-height: 22px;">立即下载客户端，尊享3倍网络加速</span><a href="'+H5Common.client_url+'" class="w-btn">立即下载</a>';
		let $time = new Date().getTime() - Number(Global.getInstance().bip.getValue('feedback_buffer_time'));
		if ($time > 24 * 60 * 60 * 1000) {
			$content += '<a href="javascript:void(0);" class="w-btn feedback-btn" style="background:#505964;color:#ccc;font-weight: bold;">卡顿反馈</a>';
		}
		TipsManager.getInstance().addTips(this.playUITips, {
			'content' : $content,
			'times'   : 1,
			'display' : 15 * 1000,
			'type'    : 'buffer',
		});
		this.playUITips.find('.feedback-btn').on('click', (e)=>{
			this.feedbackAjax({
				'errorcode':'491',
				'extra1' : 'ft=' + H5Common.ft
				},
				()=>{
					$(e.target).css({
						'pointer-events': 'none',
						'opacity' : 0
					});
					alert('反馈已收到，故障排查中');
				});
		});
	}

    setVolumePosi(disH) {
		this.btnTip.target.find('.volume-posiBar').css({
			'height' : this.v_standard * (1 - disH / this.v_standard),
			'top' : this.v_top + disH
		})
		this.btnTip.target.find('.volume-drag').css({
			'top' : this.v_top + disH - 3
		})
    }

	/**
	 * 显示当前播放码流
	 */
	setFt() {
		this.playUIFt.find('.w-btn-text').html(ftName[H5Common.ft]);
	}

	/**
	 * 设置当前内容提示点和开始播放相关提示
	 */
	setPointAndTips() {
		if (Global.getInstance().videoType == 1) {
			/********** 显示内容提示点逻辑 **********/
			try {
				let pointUI = $('.w-point');
				if (pointUI.length > 0) {
					pointUI.remove();
				}
				for (let item of Global.getInstance().playData['point']) {
					pointUI = $('<div/>',{
						'class':'w-point',
						'attr_time' : item['time'],
						'attr_title' : item['title']
					})
					pointUI.appendTo(this.playUISlider);
					pointUI.css({'left' : pointUI.attr('attr_time') / Global.getInstance().playData['duration'] * this.standardWidth});
				}
			} catch (error) {}
			//
			if (!isNaN(H5Common.stime) && H5Common.stime!=0 && !Global.getInstance().fd) {
				/********** 显示续播点 **********/
				this.generalTip(
					`您上次观看至 <a href="javascript:void(0);">${H5CommonUtils.timeFormat(H5Common.stime, false)}</a> 处，正在为您续播`,
					'continue',
					5
				)
			} else {
				/********** 显示跳过片头 **********/
				try {
					for (let item of Global.getInstance().playData['point']) {
						if (item['type'] == 1 && item['time'] > 0) {
							this.generalTip(
								`已经为您跳过片头，<a class="w-setup" href="javascript:void(0);">设置</a>`,
								'skip-begin'
							);
							break;
						}
					}
				} catch (error) {}
			}
			//
			/********** 显示蓝光码流提示 **********/
			try {
				if (Global.getInstance().stream[3]['vip'] == 1 && !VIPPrivilege.isVip && !Global.getInstance().fd) {
					this.bluelightInter && clearTimeout(this.bluelightInter);
					this.bluelightInter = setTimeout(()=>{
						this.generalTip(
							`此视频有蓝光高清码流，<a class="w-setup" href="javascript:void(0);">点击切换</a>`,
							'bluelight'
						);
					}, 20 * 1000);
				}
			} catch (error) {}
		}
		//
		/********** 显示安装客户端提示 **********/
		if (Global.getInstance().videoType != 1) {
			this.downloadInter && clearTimeout(this.downloadInter);
			this.downloadInter = setTimeout(()=>{
				this.generalTip(
					`<i class="w-logo"></i><a href="${H5Common.client_url}" class="w-btn" style="margin-top: 11px;margin-left: 20px;">立即下载</a>`,
					'download'
				);
			}, 1 * 1000);
		}
	}

	/**
	 * 通用提示显示逻辑
	 * @param {*} content   内容
	 * @param {*} type      提示类型
	 * @param {*} display   显示时长 默认15秒
	 * @param {*} time      显示次数 默认1次
	 */
	generalTip(content, type, display=15, time=1){
		let con = ['<span style="float: left;margin: auto 15px;line-height: 22px;">', '</span>'];
		if (type == 'download') con = ['<div style="padding: 10px 0px 10px 15px;width: 310px;height: 45px;float: left;line-height: 45px;">', '</div>'];
		con.splice(1, 0, content);
		if (con.length > 2) {
			let dataObj = {
				'content' : con.join(''),
				'times'   : time,
				'display' : display * 1000,
				'type'    : type,
			};
			if (type == 'download') dataObj['fill'] = 1;
			TipsManager.getInstance().addTips(this.playUITips, dataObj);
			TipsManager.getInstance().getTip(type).on('_setup_', (e)=>{
				switch(type) {
					case 'bluelight':
						this.sendEvent(H5ComponentEvent.VIDEO_SWITCH, {
							'ft' : 3
						});
						break;
					case 'skip-begin':
					case 'skip-end':
						this.btnTip.className = 'w-setting';
						let $content = ['<div style="width: auto;text-align: left;">', '</div>'];
						for (let item of [{'title':'自动跳过片头片尾','type':'skip'}]) {
							$content.splice(1, 0, '<a attr_type="'+item['type']+'"><span class="'+(item['type']=='skip'&&H5Common.isSkip?'select':'')+'"></span>'+item['title']+'</a>');
						}
						this.btnTip.data = {
							'content' : $content.join(''),
							'clientX' : this.playUISetup.offset().left - this.playUIControl.offset().left + this.playUISetup.width() / 2
						}
						break;
				}
			});
		}
	}

	initChangeUI() {
		if (Global.getInstance().playData['lang']) {
			this.playUILang.css({'display' : 'block'});
			for (let item of Global.getInstance().playData['lang']) {
				if (item.chid == Global.getInstance().cid) {
					this.playUILang.find('.w-btn-text').html(langName[item.type]);
				}
			}
		}
		this.playUISetup.css({'display' : Global.getInstance().videoType == 1?'block':'none'});
		this[Global.getInstance().videoType == 1?'playUINext':'playUIStop'].css({'display' : 'block'});
		this.resize();
	}
	
	get posi() {
		let $posi = 0;
		try {
			$posi = Math.floor((this.timeObj['end'] - this.timeObj['start']) * this.clientX / this.standardWidth)  + this.timeObj['start'];
			if ($posi >= this.timeObj['end']) $posi = this.timeObj['end'];
			if ($posi <= this.timeObj['start']) $posi = this.timeObj['start'];
		}catch(e){};
		return $posi;
	}

	/**
	 * 时间、进度条更新
	 */
	update(obj) {
		if (this.drag_key) return;
		this.timeObj = obj ? obj : {};
		let sliderWidth = 0;
		if (!$.isEmptyObject(this.timeObj)) {
			sliderWidth = this.standardWidth * (this.timeObj['posi'] - this.timeObj['start']) / (this.timeObj['end'] - this.timeObj['start']);
			if (sliderWidth < 0) sliderWidth = 0;
			if (sliderWidth > this.standardWidth) sliderWidth = this.standardWidth;
		}
		this.position(sliderWidth);
		this.showTime(this.timeObj['posi']);
		if (Global.getInstance().videoType != 1 && this.btnTip.target.css('display') == 'block' && this.btnTip.target[0].className == "w-snapshot") {
			this.sendEvent(H5ComponentEvent.VIDEO_PREVIEW_SNAPSHOT, {
				'posi' : this.posi
			});
		}
	}

	/**
	 * 时间定位到位置
	 */
	setTimeToPosition(posi) {
		this.drag_key = true;
		this.seekInter && clearTimeout(this.seekInter);
		this.clientX = this.standardWidth * (posi - this.timeObj['start']) / (this.timeObj['end'] - this.timeObj['start']);
		this.position(this.clientX);
		this.showTime(posi);
		this.sendEvent(H5ComponentEvent.VIDEO_PREVIEW_SNAPSHOT, {
			'posi' : posi
		});
		this.seekInter = setTimeout(()=>{
			this.drag_key = false;
			this.sendEvent(H5ComponentEvent.VIDEO_SEEK, {
														'seektime' : posi
													});
		}, 0.2 * 1000);
	}
	
	/**
	 * 位置定位到时间
	 */
	setPositionToTime() {
		this.position(this.clientX);
		this.showTime(this.posi);
		this.sendEvent(H5ComponentEvent.VIDEO_SEEK, {
													'seektime' : this.posi
												});
		this.sendEvent(H5ComponentEvent.ADD_VALUE, {'target' : BIPCommon.DG});
		this.sendEvent(H5ComponentEvent.START_RECORD, {'target' : BIPCommon.TDD}); 
		//5min中内的拖动相关（时长、次数）
		this.sendEvent(H5ComponentEvent.ADD_VALUE, {'target' : BIPCommon.OLDC});
		this.sendEvent(H5ComponentEvent.START_RECORD, {'target' : BIPCommon.OLDST});
	}
	
	/**
	 * 进度条更新
	 * @param {*} posi  px 
	 */
	position(posi) {
		let per = 100 * posi / this.standardWidth;
		let linearObj = {
							'width' : per + '%',
							'background' : '-webkit-linear-gradient(left, #175882 '+ (per<20?0:80) + '%, #66dae7)'
						}
		this.playUIPosiBar.css(linearObj);
		this.playUIDrag.css('left', posi);
	}
	
	/**
	 * 时间更新
	 */
	showTime(posi) {
		if (!posi || Global.getInstance().adRoll) {
			posi = 0;  //广告时显示为0
			this.playUITimer.find('.w-current').html(H5CommonUtils.timeFormat(posi, false, posi==0));
			return;
		}
		try {
			if (Global.getInstance().videoType == 1) {
				this.playUITimer.find('.w-current').html(H5CommonUtils.timeFormat(posi, false, posi==0)+' / '+H5CommonUtils.timeFormat(this.timeObj['end'], false, posi==0));
			} else {
				this.playUITimer.find('.w-current').html(H5CommonUtils.timeFormat(posi, true, posi==0));
				this.playUITimer.find('.w-total').html(`&nbsp;&nbsp;&nbsp;${this.timeObj['live']-posi<20?'正在直播':'<a href="javascript:void(0);" >返回直播</a>'}`);
			}
		} catch (error) {}
	}
	
	setUIEffect(effectObj) {
		if (!this.enable) return;
		this.playUIHandy.animate({
			opacity : effectObj['isMove']?'show':'hide'
		}, .3 * 1000);
		if (effectObj['isFullscreen']) {
			this.playUIControl.animate({
				bottom : effectObj['isMove']?0:-this.playUIControl.height()
			}, .3 * 1000);
		} else this.playUIControl.css({'bottom' : 0});
	}

	set barrageOn_Off(value){
		if (value) {
			this.playUIBarrage.css({'background' : '#3399ff'});
			this.playUIBarrage.children().removeClass('w-barrage-close').addClass('w-barrage-open');
		} else {
			this.playUIBarrage.css({'background' : '#4e4e4e'});
			this.playUIBarrage.children().removeClass('w-barrage-open').addClass('w-barrage-close');
		}
	}

	/**
	 * 剧场模式状态切换
	 */
	set expandMode(mode) {
		if (mode == 1) {
			this.playUIExpand.removeClass('w-expandIn').addClass('w-expandOut');
		} else {
			this.playUIExpand.removeClass('w-expandOut').addClass('w-expandIn');
		}
		this.$expandMode = mode;
	}
	get expandMode() {
		return this.$expandMode ? this.$expandMode : 0;
	}

	/**
	 * 音量状态切换
	 */
	set volumeState(vol) {
		if (Global.getInstance().adRoll) {
			Global.getInstance().adVolume = vol;
		}
		this.setVolumeTip(vol);
		this.setVolumePosi((1-vol / 100) * this.v_standard);
		this.playUISound.parent().find('.arc_2').css('display', vol == 0?'none':'block');
		if (vol == 0) {
			this.playUISound.removeClass('w-sound').addClass('w-mute');
		} else {
			this.playUISound.removeClass('w-mute').addClass('w-sound');
			this.showVolumeHorn('#9b999b');
		}
	}

	showVolumeHorn(color) {
		[[0, 30], [30, 70], [70, 100]].forEach((item, index)=>{
			this.playUISound.parent().find('.arc_'+index).css('border-right', '2px solid transparent');
			var volNum = Global.getInstance().adVolume ? Global.getInstance().adVolume : H5Common.currVolume;
			if (volNum > item[0]) {
				this.playUISound.parent().find('.arc_'+index).css('border-right', '2px solid '+color);
			}
		});
	}

	setVolumeTip(value){
		let volid = 'volume_tip';
		let style = 'position:absolute;font-size:16px;color:#fff;left:20px;top:20px;z-index:99;filter: drop-shadow(2px 2px 1px #000);';
		if ($('#' + volid).length == 0) {
			$('<div/>', {
				'id' : volid,
				'style' : style
			}).appendTo(Global.getInstance().pbox);
		}
		$('#' + volid).html('音量：'+ value + '%');
		$('#' + volid).css({'display':'block'});
		this.vol_inter && clearTimeout(this.vol_inter);
		this.vol_inter = setTimeout(()=>{
			$('#' + volid).css({'display':'none'});
		},3 * 1000);
	}

	/**
	 * 全屏状态切换
	 */
	set displayScreenState(screenstate) {
		if (screenstate) {
			this.playUIZoom.removeClass('w-zoomIn').addClass('w-zoomOut');
		} else {
			this.playUIControl.css({'bottom' : 0});
			this.playUIZoom.removeClass('w-zoomOut').addClass('w-zoomIn');
		}
	}
	
	/**
	 * 播控状态切换
	 */
	set displayState(playstate) {
		if(playstate == 'playing') {
			this.playUIBigPlay.hide();
			this.playUIPlay.removeClass('w-play').addClass('w-pause');
		} else {
			this.playUIBigPlay.show();
			this.playUIPlay.removeClass('w-pause').addClass('w-play');
			if (playstate == 'stopped') {
				this.update();
			}
		}
	}

	/**
	 * 显示某个时间点的预览图
	 * @param {
	 * 			posi :  时间	
	 * 			bmp  : {
	 * 				x :   
	 * 				y :
	 * 	            width : 
	 *              height : 
	 * 			}
	 * 		}
	 */
	createPreSnapshot(obj) {
		if (obj) {
			let $content = "";
			if (obj['bmp']) {
				$content += '<div style="background:url(' + obj['bmp'].url + ') no-repeat -' + obj['bmp'].x + 'px -' + obj['bmp'].y + 'px;width:' + obj['bmp'].width + 'px;height:' + obj['bmp'].height + 'px;"/>';
			}
			$content += '<span>' + H5CommonUtils.timeFormat(obj['posi'], Global.getInstance().videoType != 1, true) + '</span>';
			if (this.playUISlider.find('.w-point').length > 0) {
				this.playUISlider.find('.w-point').each((index, item)=>{
					if ($(item).attr('attr_time') == obj['posi']) {
						$content += ' ' + $(item).attr('attr_title');
					}
				});
			}
			this.btnTip.className = 'w-snapshot';
			this.btnTip.data = {
				'content' : $content,
				'clientX' : this.clientX
			}
		} else {
			this.btnTip.hide();
		}
	}

	/**
	 * 
	 * @param {    
	 * 			"message": "success",                  // 出错信息
	 * 			"livePriceInfo": {                     // 直播价格信息  
	 * 				"sectionId": 107325,               // 节目id 
	 * 				"title": "风云游戏直播",            // 标题  
	 * 				"shareStatus": 0,                  // 能否赠片 0：可赠 1：不可赠 
	 * 				"ticketStatus": 1,                 // 观影券是否可用 0可用 1不可用 
 	 * 				"startBuyTime": 1480409580,        // 购买开始时间 
	 * 				"endBuyTime": 1483174380,          // 购买结束时间 
	 * 				"cataId" : 2,					   // 1 : 影视 2 : 体育
	 * 				"sellPolicy": [                    // 购买策略 
	 * 					{                 
	 * 						"type": "buy_vip",         // 价格类型（包括四种：开通会员：buy_vip，使用观影券：use_ticket，购买单片：buy_vod;购买付费包:buy_package（包） 
	 *              		"sellType": "svip",        // 使用观影券：use_ticket(影视会员观影劵),use_sports_ticket(体育观赛券)，购买单片：buy_vod，会员类型：svip,vip,购买包：buy_package，sports（体育赛事包） 
	 *              		"priceList": []             
	 * 					},             
	 * 					{                 
	 * 						"type": "buy_vod",      
	 * 		        		"sellType": "buy_vod",      
	 * 	            		"priceList": [             // 价格列表 
	 * 		               		{          
	 * 			               		"productId": "",   // IOS产品ID（只有平台是IOS端时才有相应的值，其他平台的productId值为空字符串）    
	 * 			               		"vipType": "vip",  // 会员类型（具体会员类型） 影视会员分类：mvip：移动专享会员，vip普通会员，svip超级会员       
	 *                         		"price": 2         // 价格 
	 *                     		},       
	 *                     		{          
	 *                        		"productId": "",     
	 *                        		"vipType": "novip",    
	 *                        		"price": 5  
	 *                     		}    
	 *              			]    
	 *          			}      
	 *      			]   
	 * 			},     
	 * 			"errorcode": "0"   // 错误码，0表示成功，非0表示出错
     *	} obj 
	 */
	guideToPay(obj) {
		if(!this.payTip) this.payTip = new PayTip(Global.getInstance().pbox);
		this.payTip.addEventListener('pay_play', (e)=>{
			H5Common.isPayPass = 1;
			this.sendEvent(H5ComponentEvent.VIDEO_TOGGLE);
		});
		let createPayTip = (type, info) => {
			this.payTip.title = {
				'alignType' : type,
				'text' : H5Common.sectionTitle || Global.getInstance().title
			}
			// 此为直播时间区间
			let cObj = {
				'start' : H5CommonUtils.formatDate(new Date(H5Common.paystime), 'YYYY年MM月DD日hh:mm'),
				'end' : H5CommonUtils.formatDate(new Date(H5Common.payetime), 'YYYY年MM月DD日hh:mm')
			}
			if (obj.vt == 3) {
				cObj = {};
			} 
			if (info) {
				$.extend(cObj, info, {'vt' : obj.vt});
			}
			this.payTip.content = cObj;
		}
		try {
			if (obj.errorcode == 0) {
				let currInfo = obj.vt == 3 ? obj.vodPriceInfo : obj.livePriceInfo;
				if (currInfo.cataId == 2) {
					createPayTip('normal|center', {'info' : currInfo});
				} else {
					let errObj = {
						'sectionid' : H5Common.sectionId,
						'startTime' : H5Common.paystime,
						'endTime' : H5Common.payetime
					}
					if (obj.vt == 3) {
						errObj = {
							'cateId' : currInfo.cataId
						}
					}
					Global.postMessage(H5PlayerEvent.VIDEO_ONERROR, $.extend({ 
																				'code': H5Common.callCode['video'][6]
																			}, errObj));
				}
			} else {
				createPayTip('center|normal', {'errorcode' : obj.errorcode});
			}
		}catch(e){
			createPayTip('center|normal');
		}
	}

	showRecom(recom) {
		// http://v.pptv.com/show/h4Zj4EiauHlyicPaU.html
		/* {
			id: 16755518,
			title: "颤抖的欲望",
			capture: "http://s1.pplive.cn/v/cap/16755518/w120.jpg",
			catpure: "http://s1.pplive.cn/v/cap/16755518/w120.jpg",
			link: "http://v.pptv.com/show/PtOPDXXbS4nsatI.html"
		} */
		if (!this.recom) {
			this.recom = new Recom(Global.getInstance().pbox);
			this.recom.addEventListener('_show_share_', (e)=>{
				if(this.center) this.center.setData_share();
			})
		}
		this.recom.showData(recom);
	}

	showError(errorcode, ...rest) {
		if (!errorcode) {
			if (this.errorTip) {
				this.errorTip.target.remove();
				this.errorTip = null;
			}
			return;
		}
		if (!this.errorTip) {
			this.errorTip = new ErrorTip(Global.getInstance().pbox);
		}
		this.errorTip.setData(errorcode, rest);
		this.errorTip.resize();
		this.sendEvent(H5ComponentEvent.VIDEO_STORAGE, {'key' : BIPCommon.ERROR_CODE,'value' : errorcode});
	}

	reset() {
		this.goliveInter && clearTimeout(this.goliveInter);
		this.downloadInter && clearTimeout(this.downloadInter);
		TipsManager.getInstance().delTips();
		if (this.errorTip) {
			this.errorTip.target.remove();
			this.errorTip = null;
		}
		if (this.btnTip) this.btnTip.hide();
		if (this.payTip) this.payTip.hide();
		if (this.center) this.center.hide();
		if (this.recom) this.recom.hide();
		this.enable = false;
		[this.playUIShare, this.playUIQrcode].forEach((item) => {
			$(item).css({
				'pointer-events' : 'auto',
				'opacity' : '1'
			})
		});
	}

	/**
	 * 中央弹层（分享、手机看）
	 */
	get centerTip() {
		if (this.center) {
			return this.center.cenTip;
		}
		return null;
	}

	get enable() {return this.controlEnable;}
	set enable(enabled) {
		this.controlEnable = enabled;
		if (enabled) {
			if (H5Common.shareDisable) {
				[this.playUIShare, this.playUIQrcode].forEach((item) => {
					$(item).css({
						'pointer-events' : 'none',
						'opacity' : '.3'
					})
				});
			}
			if (this.payTip) this.payTip.hide();
		}
		[this.playUIPlay, this.playUIStop, this.playUITimer, this.playUIBarrage, this.playUILang, this.playUIFt, this.playUISetup, this.playUISlider].forEach((item) => {
			item.css({
				'pointer-events': enabled ? 'auto' : 'none',
				'opacity' : enabled ? '1' : '.3'
			});
		});
		if (!this.controlEnable) this.showTime();
		this.playUIHandy.css('display', enabled ? 'block' : 'none');
		this.playUIBarrage.parent().css({'display' : Global.getInstance().barrage?'block':'none'});
		if (this.playUIBarrage.parent().css('display') == 'block') {
			this.barrageOn_Off = Global.getInstance().barrageDisplay;
		}
	}
}