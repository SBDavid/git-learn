/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import $ from 'jquery';
import Global from "manager/Global";
import H5ComponentEvent from "../../event/H5ComponentEvent";
import { UIComponent } from "../../component/UIComponent";
import { H5CommonUtils } from "common/H5CommonUtils";
import { CommonUI } from "../../component/CommonUI";
import { PcSkinMediator } from "../PcSkinMediator";
import H5PlayerEvent from "common/H5PlayerEvent";
import VIPPrivilege from 'common/VIPPrivilege';
import { H5Common } from "common/H5Common";
import CTXQuery from "manager/CTXQuery";

export const afpMapId = {
	'pre'        : '300001',// 前贴
	'post'       : '300002',// 后贴
	'mid'        : '300008',// 中插
	'mid-overlay': '300003',// 暂停
}

/**
 * TempAFP为在无广告播放器时的临时替换类
 */
class TempAFP extends UIComponent {

	constructor(option) {
		super();
		this.target = $(option['dom']);
	}

	addAFP(type) {
		for (var i in afpMapId) {
			if (type == 'pre' || type == 'mid' || type == 'post') {
				setTimeout(()=>{
					this.sendEvent('roll_end');
				}, 0.1 * 1000)
			}
		}
	}

	setSize(w, h) {}

	delAFP() {}
}

export class PcAdvComponent extends UIComponent {

	constructor() {
		super();
		let ad_box = CommonUI.adverHtml;
		ad_box = H5CommonUtils.replaceClassPrefix(ad_box, 'w-');
		$('.w-control').before(ad_box);
		this.vastAdBox = Global.getInstance().pbox.find('div[class$="video-vastad"]');
		Global.getInstance().adRoll = true;
	}

	/**
	 * 监听广告播放器的事件回调处理
	 */
	afpHandler() {
		let onVastHandler = (e)=>{
			Global.debug('接收到广告播放器事件  >>>>>  ', e.type);
			switch (e.type) {
				case 'roll_mid_countdown' : 
					this.sendEvent(H5ComponentEvent.ADV_ROLL_COUNTDOWN);
					break;
				case 'roll_lock'  :
					Global.getInstance().adRoll = true;
					this.sendEvent(H5ComponentEvent.ADV_ROLL_START, {
						'event' : e.type,
						'type'  : `${e.data.type}-roll`,
						'enable': 0
					});
					break;
				case 'roll_end'   : 
				case 'roll_error' :
				case 'roll_unlock':
					if (Global.getInstance().isAllAdvClear) return;
					Global.getInstance().adRoll = false;
					delete Global.getInstance().adVolume;
					this.sendEvent(H5ComponentEvent.ADV_ROLL_END, {
						'type'  : `${e.data.type}-roll`,
						'enable': 1
					});
					break;
				case 'roll_volume':
					Global.getInstance().adVolume = e.data['volume'];
					this.sendEvent(H5ComponentEvent.VIDEO_VOLUME_STATE, e.data);
					break;
				case 'roll_vip'   :
					//top.location.href = '//pay.vip.pptv.com/?plt=web&aid=pri_web_quguanggao&cid=' + Global.getInstance().cid;
					Global.postMessage(H5PlayerEvent.VIDEO_ONNOTIFICATION, { 
						'header' : {
							'type' : 'buyVip'
						},
						'body' : {
							'data' : {
								'cid' : Global.getInstance().cid,
								'sectionId' : H5Common.sectionId,
								'cp' : H5Common.sectionCp,
								'aid': H5Common.NEW_MEMBER
							}
						}
					});
					break;
				default:
					break;
			}
		}
		['roll_mid_countdown', 'roll_lock', 'roll_unlock', 'roll_end', 'roll_error', 'roll_volume', 'roll_vip'].forEach((eventType)=>{
			this.afp.addEventListener(eventType, onVastHandler);
		})
	}

	/**
	 * 实例化广告播放器，同时初始化广告参数
	 */
	execute() {
		if (window.AdH5Player) {
			if(!this.afp) {
				this.afp = new AdH5Player({
					'dom'  : this.vastAdBox[0]
				});
				H5Common.contextmenuArr.push('AFPPlayer  ' + this.afp.version);
				this.afp.debug = Global.debug;
				this.afp.afpMapId = afpMapId;
				this.afpHandler();
			}
			this.afp.initAFP({
				clid : Global.getInstance().adConfig.clid,
				chid : Global.getInstance().adConfig.chid,
				sid  : Global.getInstance().adConfig.sid,
				w    : Global.getInstance().winSize['ow'],
				h    : Global.getInstance().winSize['oh']
			});
			this.afp.ctx = [
				`type=${Global.getInstance().loadType}`,
				`${CTXQuery.cctx}`,
				`${CTXQuery.dctx}`,
				`vvid=${Global.getInstance().bip.vvid}`,
				`platform=2`,
				`connectiontype=1`,
				`userUnique=${Global.getInstance().userInfo.guid}`,
				`sectionid=${H5Common.sectionId}`,
				`live=${Global.getInstance().videoType==1?0:1}`,
				`${Global.getInstance().userInfo['uid']?('username='+Global.getInstance().userInfo['uid']):''}`
			].join('&');
		} else {
			if(!this.afp) {
				this.afp = new TempAFP({
					'dom'  : this.vastAdBox[0]
				});
				this.afpHandler();
			}
		}
	}

	/**
	 * 通知广告播放器发起对应广告位的请求
	 * @param {*} type  广告位类型
	 */
	showAFP(type) {
		if (this.afp) {
			if (!VIPPrivilege.isNoad && H5Common.isPay) {
				if (type == 'pre' || type == 'mid' || type == 'post') {
					Global.getInstance().adRoll = true;
					this.sendEvent(H5ComponentEvent.ADV_ROLL_START, {
						'type' : `${type}-roll`,
						'enable': 0
					});
				}
				if (type == 'mid-overlay' && !H5Common.isSpaceKey) return;
				this.afp.addAFP(type);
			} else {
				if (type == 'pre' || type == 'mid' || type == 'post') {
					Global.getInstance().adRoll = false;
					this.sendEvent(H5ComponentEvent.ADV_ROLL_END, {
						'type' : `${type}-roll`,
						'enable': 1
					});
				}
			}
		}
	}

	/**
	 * 通知广告播放器实时时间数据
	 * @param {*} obj {
	 *					'start': 动态区间段起始点
	 *					'end'  : 动态区间段结束点
	 *					'posi' : 动态播放点
	 *					'live' : 动态直播点
	 *				}
	 */
	updateAFP(obj) {
		if (this.afp) {
			this.afp.updateAFP(obj);
		}
	}

	/**
	 * 通知广告播放器重置清空广告位
	 * @param {*} type   undefined时清空所有广告位
	 */
	delAFP(type) {
		if (!type) Global.getInstance().isAllAdvClear = true; // 当 isAllAdvClear 为true时，不接收处理广告播放器事件
		if (this.afp) {
			this.afp.delAFP(type);
		}
	}

	/**
	 * 通知广告播放器重置所有已存在广告的尺寸
	 */
	resize() {
		if (this.afp) {
			this.afp.setSize(Global.getInstance().winSize['ow'], Global.getInstance().winSize['oh']);
		}
	}

	setMidoverlayDisplay(value) {
		try{
			$(this.afp.getAFP('mid-overlay')).css('display', value);
		}catch(evt){}
	}

	set volume(value) {
		if (this.afp) {
			this.afp.volume = value;
		}
	}
}