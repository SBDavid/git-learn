/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import puremvc from "puremvc";
import Global from "manager/Global";
import { MobileAdvComponent } from "./component/MobileAdvComponent";
import H5ComponentEvent from "../event/H5ComponentEvent";
import H5Notification from "common/H5Notification";
import { H5Common } from "common/H5Common";

export class MobileAdvMediator extends puremvc.Mediator {
	
	static NAME = 'mobile_adv_mediator';

	onRegister() {
		this.setViewComponent(new MobileAdvComponent());
		this.viewComponent.target = this.viewComponent.vastAdBox;
		//
		this.viewComponent.addEventListener(H5ComponentEvent.ADS_STATUS, this);
		this.viewComponent.addEventListener(H5ComponentEvent.ADV_EVENT, this);
	}

	handleEvent(event, data) {
		var self = event.data.self;
		switch(event.type) {
			case H5ComponentEvent.ADS_STATUS:
				self.sendNotification(H5Notification.ADS_STATUS, data);
				break;
			case H5ComponentEvent.ADV_EVENT:
				self.sendNotification(H5Notification.ADV_EVENT, data);
				break;
		 }
	}

	/**
	 * @override
	 */
	listNotificationInterests() {
		return [
					H5Notification.ADS_STATUS,
					H5Notification.ADV_EVENT
				];
	}

	/**
	 * @override
	 * status : -1(没有广告)，
	 *     		-2(有广告，但一个都没有播放)
	 *     		0(所有广告都正常播放完成) - 在暂停广告时也表示手动关闭广告
	 *     		1(有部分广告没有播放出来)
	 *     		10(登录会员跳广告)
	 *     		11(广告iframe加载出错)
	 *     		100(初始广告等待超时)
	 */
	handleNotification(note) {
		switch (note.getName()) {
			case H5Notification.ADS_STATUS:
				try{
					if (note.getBody()['status'] != undefined) {
						Global.getInstance().advStatus = note.getBody()['status'];
						Global.debug('删除广告容器 status ', Global.getInstance().advStatus);
						if (this.viewComponent.vastAdBox) {
							this.viewComponent.vastAdBox.remove();
							this.viewComponent.vastAdBox = null;
						}
						this.sendNotification(H5Notification.ADV_OVER);
						return;
					}
				}catch(e){ };
				Global.debug('展示广告容器 ...');
				delete Global.getInstance().advStatus;
				this.viewComponent.execute(H5Common.adsUrl);
				break;
			case H5Notification.ADV_EVENT:
				try{
					var eObj = note.getBody();
					if (eObj['eventType'] == 'advSrc'){
						if(eObj['src']!= undefined && eObj['src']!='') {
							this.sendNotification(H5Notification.ADV_PLAY, {src:eObj['src']});
						}
					} else if(eObj['eventType'] == 'sendToAdvDom') {
						var win = $('#adiframe')[0].contentWindow;
						win.postMessage(JSON.stringify(note.getBody()),'*');
						return;
					} else if(eObj['eventType'] == 'showAdvDom') {
						this.viewComponent.showDom(true);
					} else if(eObj['eventType'] == 'advConnect') {
						this.sendNotification(H5Notification.ADV_CONNECT, {type:eObj['type']});
					}
				}catch(e){};
				break;
		}
	}

}