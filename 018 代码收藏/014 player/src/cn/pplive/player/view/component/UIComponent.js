/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import Global from "manager/Global";
import BIPCommon from "bip/BIPCommon";
import { H5Common } from "common/H5Common";
import { H5CommonUtils } from "common/H5CommonUtils";
import H5ComponentEvent from "../event/H5ComponentEvent";

export class UIComponent {

	constructor() {
		this.target = null;
	}

	addEventListener(eventType, listener, useCapture) {
		try{
			this.target.on(eventType, { 
				                        self : listener
			                          }, listener.handleEvent != undefined ? listener.handleEvent : listener);
		}catch(e){}
	}

	sendEvent(eventType, obj) {
		try{
			this.target.trigger(eventType, obj);
		}catch(e){}
	}
	
	sendOnline(obj) {
		this.sendEvent(H5ComponentEvent.STOP_RECORD, {
													'target' : BIPCommon.OLBS
												});
		this.sendEvent(H5ComponentEvent.VIDEO_ONLINE, obj);
	}

	feedbackAjax(obj, callback) {
		Global.debug('开始 提交feedback 请求 ');
		var dataObj = {
						'pfkw'     : 'm_web_error',
						'player'   : H5Common.version(),
						'username' : (Global.getInstance().userInfo && Global.getInstance().userInfo.uid) ? encodeURIComponent(Global.getInstance().userInfo.uid) : '',
						'vip'      : (Global.getInstance().userInfo && Global.getInstance().userInfo.isvip)? Global.getInstance().userInfo.isvip : 'false',
						'channel'  : Global.getInstance().ctx.o,
						'message'  : Global.getInstance().title + '+' + Global.getInstance().cid,
						'backUrl'  : encodeURIComponent(decodeURIComponent(Global.getInstance().pageUrl) || window.top.location.href),
						'ikanlog'  : Global.m_log ? encodeURIComponent(Global.m_log) : '',
						'errorcode': obj['errorcode'],
						'extra1'   : obj['extra1'],
						'error'    : 'h5视频错误码日志'
					}
		H5CommonUtils.formsubmit('//feedback.client.pptv.com/api/errorlog', dataObj, callback);
		if (obj['errorcode'] == 491) {
			Global.getInstance().bip.setValue('feedback_buffer_time', new Date().getTime(), false);
		}
	}

}