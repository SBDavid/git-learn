/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import $ from 'jquery';
import puremvc from "puremvc";
import Global from "manager/Global";
import H5PlayerEvent from "common/H5PlayerEvent";
import { H5Common } from "common/H5Common";
import H5Notification from "common/H5Notification";
import { H5CommonUtils } from "common/H5CommonUtils";
import { MobileAdvMediator } from "./mobile/MobileAdvMediator";
import { MobileSkinMediator } from "./mobile/MobileSkinMediator";
import { MobilePlayerMediator } from "./mobile/MobilePlayerMediator";
import { PcAdvMediator } from "./pc/PcAdvMediator";
import { PcPlayerMediator } from "./pc/PcPlayerMediator";
import { PcSkinMediator } from "./pc/PcSkinMediator";
import Clipboard from 'clipboard';

export class H5ViewMediator extends puremvc.Mediator {

	static NAME = 'h5_view_mediator';
	minT;
	maxT;
	step;
	disT;

	constructor(name) {
		super(name);
	}

	onRegister() {
		Global.debug('H5SkinMediator | H5AdverMediator | H5PlayerMediator 模块开始注册...');
		if (Global.getInstance().isMobile) {
			this.facade.registerMediator(new MobileSkinMediator());
			this.facade.registerMediator(new MobileAdvMediator());
			this.facade.registerMediator(new MobilePlayerMediator());
		} else {
			this.facade.registerMediator(new PcSkinMediator());
			this.facade.registerMediator(new PcAdvMediator());
			this.facade.registerMediator(new PcPlayerMediator());
			let player = this.facade.retrieveMediator(PcPlayerMediator.NAME);
			let skin = this.facade.retrieveMediator(PcSkinMediator.NAME);
			$(document).on('fullscreenchange webkitfullscreenchange mozfullscreenchange keydown keyup', (e) => {
				if (e.type == 'keyup') {
					// 空格键
					if (e.keyCode == 32 && H5Common.isSpaceKey) player.viewComponent.toggleVideo();
				} else if (e.type == 'keydown') {
					if (e.keyCode == 32) e.preventDefault();
					//上下键控制音量
					if (e.keyCode == 38 || e.keyCode == 40) {
						if (Global.getInstance().playstate != 'stopped') e.preventDefault();
						let tempV = H5Common.currVolume;
						let disV = tempV % 5;
						// 向上键
						if (e.keyCode == 38) {
							tempV += (disV != 0)?(5 - disV):5;
							if (tempV > 100) tempV = 100;
						}
						// 向下键
						if (e.keyCode == 40) {
							tempV -= (disV != 0)?disV:5;
							if (tempV < 0) tempV = 0;
						}
						player.viewComponent.volume = tempV;
					}
					//回看时左右键控制快退快进
					if (e.keyCode == 37 || e.keyCode == 39) {
						e.preventDefault();
						if (H5Common.isShowControl && H5Common.isSpaceKey) {
							let disT;
							if (isNaN(H5Common.tempT)) H5Common.tempT = Global.getInstance().posiTime;
							if(Global.getInstance().videoType == 1) {
								this.minT = 0;
								this.maxT = Global.getInstance().playData['duration'];
								this.step = 10;
								disT = 0;
							} else {
								if (!H5Common.isVod) return;
								this.minT = H5Common.stime;
								this.maxT = H5Common.etime;
								this.step = Global.getInstance().playData.interval;
								disT = H5Common.tempT % this.step;
							}
							try {
								if (e.keyCode == 37) {// 向左键
									H5Common.tempT -= (disT != 0)?disT:this.step;
									if (H5Common.tempT < this.minT) H5Common.tempT = this.minT;
								} else if (e.keyCode == 39) {// 向右键
									H5Common.tempT += (disT != 0)?(this.step - disT):this.step;
									if (H5Common.tempT > this.maxT) H5Common.tempT = this.maxT;
								}
								skin.viewComponent.setTimeToPosition(H5Common.tempT);
							}catch (error) { };
						}
					}
					var log_id = 'log_ids';
					//打开日志(shift+home)
					if (e.shiftKey && e.keyCode == 36) {
						if ($('#'+log_id).length == 0) {
							$('<div/>', {
								'id'   : log_id,
								'style': 'width:100%;height:100%;position:absolute;z-index:2147483648;left:0;top:0;font-size:12px;background:rgba(255, 255, 255, 0.8);word-wrap:break-word;overflow-y:auto;color:#333;'
							}).appendTo(Global.getInstance().pbox).html('<div class="w-playerlog" style="border: 1px solid #000;margin: 15px;overflow: hidden;height:85%;"/><a href="javascript:void(0);" class="w-closelog-btn" style="display: block;background: #666;color: #fff;width: 70px;height: 22px;line-height: 22px;margin-right: 15px;text-align: center;border-radius: 2px;float: right;">关闭&gt;&gt;&gt;</a><a href="javascript:void(0);" class="w-copylog-btn" style="display: block;background: #00afec;color: #fff;width: 70px;height: 22px;line-height: 22px;margin-right: 15px;text-align: center;border-radius: 2px;float: right;">复制&gt;&gt;&gt;</a>');
						}
						$('#'+log_id).find('.w-playerlog').html(Global.m_log);
						$('#'+log_id).find('.w-closelog-btn').on('click', (e)=>{
							$('#'+log_id).remove();
						});
						$('#'+log_id).find('.w-copylog-btn').on('click', (e)=>{
							let clipboard = new Clipboard('.w-copylog-btn', {
								text : () => Global.m_log
							});
						});
					}
					//关闭日志(shift+end)
					if (e.shiftKey && e.keyCode == 35) {
						if ($('#'+log_id).length > 0) {
							$('#'+log_id).remove();
						}
					}
				} else {
					Global.postMessage(H5PlayerEvent.VIDEO_ONMODE_CHANGED, player.viewComponent.isFullscreen?'3':'4');
					skin.viewComponent.displayScreenState = player.viewComponent.isFullscreen;
				}
			});
		}
		Global.postMessage(H5PlayerEvent.VIDEO_ONPLAYSTATE_CHANGED, '2');
		let pptv =  ' PPPPPPPPPPPPPPPPPPPPPP       PPPPPPPPPPPPPPPPPPPPPP      TTTTTTTTTTTTTTTTTTTTTTTTTTT    VVVVVVV                      VVVVVVV     \n';
		    pptv += 'P::::::::::::::::::::::P     P::::::::::::::::::::::P     T:::::::::::::::::::::::::T     V:::::V                    V:::::V     \n';
			pptv += 'P:::::::::PPPPP:::::::::P    P:::::::::PPPPP:::::::::P    TTTTTTTTTT:::::::TTTTTTTTTT      V:::::V                  V:::::V     \n';
			pptv += 'P:::::::P       P:::::::P    P:::::::P       P:::::::P             T:::::::T                V:::::V                V:::::V     \n';
			pptv += 'P:::::::P       P:::::::P    P:::::::P       P:::::::P             T:::::::T                 V:::::V              V:::::V     \n';
			pptv += 'P:::::::::PPPPP::::::::P     P:::::::::PPPPP::::::::P              T:::::::T                  V:::::V            V:::::V     \n';
			pptv += 'P:::::::::::::::::::::P      P:::::::::::::::::::::P               T:::::::T                   V:::::V          V:::::V     \n';
			pptv += 'P:::::::PPPPPPPPPPPPP        P:::::::PPPPPPPPPPPPP                 T:::::::T                    V:::::V        V:::::V     \n';
			pptv += 'P:::::::P                    P:::::::P                             T:::::::T                     V:::::V      V:::::V     \n';
			pptv += 'P:::::::P                    P:::::::P                             T:::::::T                      V:::::V    V:::::V     \n';
			pptv += 'P:::::::P                    P:::::::P                             T:::::::T                       V:::::V  V:::::V     \n';
			pptv += 'P:::::::P                    P:::::::P                             T:::::::T                        V:::::VV:::::V     \n';
			pptv += 'P:::::::P                    P:::::::P                             T:::::::T                         V::::::::::V     \n';
			pptv += 'P:::::::P                    P:::::::P                             T:::::::T                          V::::::::V     \n';
			pptv += 'PPPPPPPPP                    PPPPPPPPP                             TTTTTTTTT                           VVVVVVVV     \n';
		//console.info(pptv, 'color:#3399ff;font-size:8px');
		this.orient();
		if (window.parent == window) {
			// 非iframe嵌入，而由div直接嵌入播放器resize
			Global.getInstance().pbox.on('resize', (e) => {
				if (Global.getInstance().isMobile) window.recalc();
				this.orient();
			});
		} else {
			// iframe嵌入播放器resize
			$(window).on('orientationchange' in window && Global.getInstance().isMobile ?'orientationchange':'resize', (e) => {
				if (Global.getInstance().isMobile) window.recalc();
				this.orient();
			});
		}
	}

	//横屏、竖屏执行
	orient() {
		let skin = this.facade.retrieveMediator((Global.getInstance().isMobile?MobileSkinMediator:PcSkinMediator).NAME);
		let play = this.facade.retrieveMediator((Global.getInstance().isMobile?MobilePlayerMediator:PcPlayerMediator).NAME);
		let adv = this.facade.retrieveMediator((Global.getInstance().isMobile?MobileAdvMediator:PcAdvMediator).NAME);
		if (window.orientation == undefined) {
			Global.getInstance().screen = false;
		} else {
			Global.debug('横屏、竖屏切换 ==>> ', window.orientation);
			if (window.orientation == 180 || window.orientation == 0) {
				//竖屏
				Global.getInstance().screen = false;
			} 
			if (window.orientation == 90 || window.orientation == -90) {
				//横屏
				Global.getInstance().screen = true;
			}
		}
		skin.viewComponent.resize();
		play.viewComponent.resize();
		adv.viewComponent.resize();
	}

	/**
	 * @override
	 */
	listNotificationInterests() {
		return [
				H5Notification.PLAY_BLACK_DOMAINS
			];
	}

	/**
	 * @override
	 */
	handleNotification(note) {
		let skin = this.facade.retrieveMediator((Global.getInstance().isMobile?MobileSkinMediator:PcSkinMediator).NAME);
		switch(note.getName()) {
			case H5Notification.PLAY_BLACK_DOMAINS:
				skin.viewComponent.showError(note.getBody()['errorcode'], note.getBody());
				break;
		}
	}
}