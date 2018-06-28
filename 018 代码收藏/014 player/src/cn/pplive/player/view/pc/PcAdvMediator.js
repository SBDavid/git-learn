/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import $ from 'jquery';
import Global from "manager/Global";
import puremvc from "puremvc";
import { PcAdvComponent, afpMapId } from "./component/PcAdvComponent";
import H5ComponentEvent from "../event/H5ComponentEvent";
import H5Notification from "common/H5Notification";
import { PcPlayerMediator } from "./PcPlayerMediator";
import { PcSkinMediator } from "./PcSkinMediator";
import VIPPrivilege from 'common/VIPPrivilege';
import { H5Common } from "common/H5Common";

export class PcAdvMediator extends puremvc.Mediator {
	
	static NAME = 'pc_adv_mediator';

	onRegister() {
		this.setViewComponent(new PcAdvComponent());
		this.viewComponent.target = this.viewComponent.vastAdBox;
		this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_VOLUME_STATE, this);
		this.viewComponent.addEventListener(H5ComponentEvent.ADV_ROLL_COUNTDOWN, this);
		this.viewComponent.addEventListener(H5ComponentEvent.ADV_ROLL_START, this);
		this.viewComponent.addEventListener(H5ComponentEvent.ADV_ROLL_END, this);
	}

	handleEvent(event, data) {
		let self = event.data.self;
		let player = self.facade.retrieveMediator(PcPlayerMediator.NAME);
		let skin = self.facade.retrieveMediator(PcSkinMediator.NAME);
		switch(event.type) {
			case H5ComponentEvent.VIDEO_VOLUME_STATE:
				skin.viewComponent.volumeState = data['volume'];
				break;
			case H5ComponentEvent.ADV_ROLL_COUNTDOWN:
				player.viewComponent.pauseVideo();
				break;
			case H5ComponentEvent.ADV_ROLL_START:
				Global.debug(data['type'] + '广告开始, 相关UI功能禁用 >>>>>');
				self.sendNotification(H5Notification.VIDEO_SHOW, data);
				break;
			case H5ComponentEvent.ADV_ROLL_END:
				Global.debug(data['type'] + '广告结束, 相关UI功能开启  >>>>>');
				self.sendNotification(H5Notification.VIDEO_SHOW, data);
				break;
		 }
	}

	/**
	 * 加载广告播放器并实例化
	 * @param {*} cb 
	 */
	loadAdScript(cb) {
		if (this.viewComponent.afp) {
			this.viewComponent.execute();
			this.viewComponent.showAFP('pre');
		} else {
			if (Global.getInstance().h5adplayer_version) {
				$('<link>').attr({ 
					    rel: 'stylesheet',
						type: 'text/css',
						href: '//static9.pplive.cn/corporate/afp/' + Global.getInstance().h5adplayer_version + '/dist/css/style-AFP.css'
				}).appendTo("head");
				$.getScript({
					'url'  :'//static9.pplive.cn/corporate/afp/' + Global.getInstance().h5adplayer_version + '/dist/AFP.js',
					'cache': true
				}).done(() => {
					cb && cb();
				}).fail(() => {
					cb && cb();
				});
			} else {
				cb && cb();
			}
		}
	}

	/**
	 * 检查是否需要免广告
	 * @param {*} cb 
	 */
	checkisMustAFP(cb) {
		if(VIPPrivilege.isVip) {
			VIPPrivilege.isNoad = true;
			cb && cb();
		} else if(Global.getInstance().rcl == 5) {	//已购买体育包时分类5（体育）免视频
			if(Global.getInstance().userinfo && Global.getInstance().userinfo.uid) {
				$.ajax({
					dataType 	  : 'jsonp',
					type          : 'GET',
					cache         : true,
					username      : Global.getInstance().userinfo.uid,
					token         : Global.getInstance().userinfo.token,
					jsonpCallback : 'getPackageList',
					jsonp         : 'cb',
					timeout       : 10 * 1000,
					url           : H5Common.packageList,
					success       : function(data) {
						if(data.errorcode == '0' && !data.content.length) {
							VIPPrivilege.isNoad = true;
						}
						cb && cb();
					},
					error		  : function(xhr, errorType, error) {
						cb && cb();
					}
				});
			} else {
				cb && cb();
			}
		} else {
			cb && cb();
		}
	}

	/**
	 * @override
	 */
	listNotificationInterests() {
		return [
					H5Notification.ADV_SETUP,
					H5Notification.ADV_ROLL_DELETE,
					H5Notification.VIDEO_VOLUME,
					H5Notification.VIDEO_USERINFO,
					H5Notification.VIDEO_UPDATE,
					H5Notification.VIDEO_VOLUME,
					H5Notification.VIDEO_STATE,
					H5Notification.VIDEO_POST,
				];
	}

	handleNotification(note) {
		let skin = this.facade.retrieveMediator(PcSkinMediator.NAME);
		switch (note.getName()) {
			case H5Notification.ADV_SETUP:
				this.checkisMustAFP(() => {
					this.loadAdScript(() => {
						this.viewComponent.execute();
						this.viewComponent.showAFP('pre');
					})
				});
				break;
			case H5Notification.VIDEO_UPDATE:
				this.viewComponent.updateAFP(note.getBody());
				break;
			case H5Notification.VIDEO_VOLUME:
				this.viewComponent.volume = note.getBody()['volume'];
				break;
			case H5Notification.VIDEO_STATE:
				if (!Global.getInstance().isVodNoStart) {
					if (note.getBody()['playstate'] == 'playing') {
						this.viewComponent.delAFP('mid-overlay');
					} else if (note.getBody()['playstate'] == 'paused') {
						if (!skin.viewComponent.centerTip) {
							this.viewComponent.showAFP('mid-overlay');
						} else {
							if (skin.viewComponent.centerTip.css('display') == 'none') {
								this.viewComponent.showAFP('mid-overlay');
							}
						}
					}
				}
				break;
			case H5Notification.ADV_ROLL_DELETE:
				if (Global.getInstance().adRoll) {
					for (let aid in afpMapId) {
						if (aid == 'pre' || aid == 'post' || aid == 'mid') {
							this.viewComponent.delAFP(aid);
						}
					}
				}
				break;
			case H5Notification.VIDEO_POST:
				this.viewComponent.showAFP('post');
				break;
		}

	}
}