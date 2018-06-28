/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import puremvc from "puremvc";
import Global from "manager/Global";
import H5Notification from "common/H5Notification";
import {BIPReport} from "./BIPReport";
import {BIPEncode} from "./BIPEncode";

export class H5BipMediator extends puremvc.Mediator {

	static NAME = 'h5_bip_mediator';

	constructor(name){
		super(name);
		this.bip = new BIPReport(new BIPEncode());
		Global.getInstance().bip = this.bip;
	}

	/**
	 * @override
	 */
	listNotificationInterests() {
		return [
				H5Notification.VIDEO_BIP,
				H5Notification.VIDEO_STORAGE,
				H5Notification.START_RECORD,
				H5Notification.STOP_RECORD,
				H5Notification.ADD_VALUE,
				H5Notification.VIDEO_SESSION_UPDATE,
				H5Notification.VIDEO_ONLINE	
			];
	}
	
	/**
	 * @override
	 */
	handleNotification(note) {
		switch (note.getName()) {
			case H5Notification.VIDEO_BIP:
				this.bip.sendBIPReport(note.getBody()['dt'], note.getBody()['data']);
				break;
			case H5Notification.VIDEO_STORAGE:
				this.bip.setValue(note.getBody()['key'], note.getBody()['value']);
				break;
			case H5Notification.START_RECORD:
				this.bip.startRecord(note.getBody()['target']);
				break;
			case H5Notification.STOP_RECORD:
				this.bip.stopRecord(note.getBody()['target']);
				break;
			case H5Notification.ADD_VALUE:
				this.bip.addValue(note.getBody()['target']);
				break;
			case H5Notification.VIDEO_SESSION_UPDATE:
				this.bip.updateSession();
				break;
			case H5Notification.VIDEO_ONLINE:
				this.bip.sendOnlineReport(note.getBody());
				break;
		}
	}
	
}