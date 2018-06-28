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


export class H5RecomProxy extends puremvc.Proxy {

	static NAME = 'h5_recom_proxy';

	constructor(name) {
		super(name);
	}

	loadData() {
		let recomUrl = H5Common.recom_url.replace(/\[ID\]/g, Global.getInstance().cid);
		recomUrl += '&num=18';
		$.ajax({
				dataType 	  : 'jsonp',
				type          : 'GET',
				cache         : true,
				jsonpCallback : 'getRecom',
				jsonp         : 'cb',
				timeout       : 10 * 1000,
				url           : recomUrl,
				success       : (data) => {
				                    try {
										if (data['err'] == 0 && data['data']['videos'].length > 0) {
											this.sendNotification(H5Notification.VIDEO_RECOM, data['data']['videos']);
										}
									} catch (err) {
										this.sendNotification(H5Notification.VIDEO_RECOM);
									}
								},
								//XMLHttpRequest 对象，错误信息，（可能）捕获的错误对象
				error		  : (xhr, errorType, error) => {
									this.sendNotification(H5Notification.VIDEO_RECOM);
								}	
		});
	}
}