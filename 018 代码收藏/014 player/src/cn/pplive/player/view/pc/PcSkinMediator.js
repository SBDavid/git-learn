/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import puremvc from "puremvc";
import Global from "manager/Global";
import { H5Common } from "common/H5Common";
import H5PlayerEvent from "common/H5PlayerEvent";
import H5Notification from "common/H5Notification";
import H5ComponentEvent from "../event/H5ComponentEvent";
import { H5PreSnapshotProxy } from "model/H5PreSnapshotProxy";
import { PcSkinComponent } from "./component/PcSkinComponent";
import { PcAdvMediator } from "./PcAdvMediator";
import { H5PayProxy } from "model/H5PayProxy";

export class PcSkinMediator extends puremvc.Mediator {

	static NAME = 'pc_skin_mediator';

	onRegister() {
		this.setViewComponent(new PcSkinComponent());
		this.viewComponent.target = this.viewComponent.playUIControl;
		//
		this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_SCREEN, this);
		this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_SEEK, this);
		this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_NEXT, this);
		this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_STOP, this);
		this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_PREVIEW_SNAPSHOT, this);
		this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_VOLUME, this);
		this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_VOLUME_ADV, this);
		this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_SWITCH, this);
		this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_CENTER, this);
		this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_TOGGLE, this);
		this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_PLAY, this);
		this.viewComponent.addEventListener(H5ComponentEvent.START_RECORD, this);
		this.viewComponent.addEventListener(H5ComponentEvent.ADD_VALUE, this);
	}

	handleEvent(event, data) {
		let self = event.data.self;
		let afp = self.facade.retrieveMediator(PcAdvMediator.NAME);
		switch(event.type) {
			case H5ComponentEvent.VIDEO_SCREEN:
				self.sendNotification(H5Notification.VIDEO_SCREEN, data);
				break;
			case H5ComponentEvent.VIDEO_SEEK:
				self.sendNotification(H5Notification.VIDEO_SEEK, data);
				break;
			case H5ComponentEvent.VIDEO_NEXT:
				self.sendNotification(H5Notification.VIDEO_NEXT);
				break;
			case H5ComponentEvent.VIDEO_STOP:
				self.sendNotification(H5Notification.VIDEO_STOP);
				break;
			case H5ComponentEvent.VIDEO_PREVIEW_SNAPSHOT:
				if (data) {
					let previewProxy = self.facade.retrieveProxy(H5PreSnapshotProxy.NAME);
					previewProxy.disposed(false, H5Common.isVod ? H5Common.stime : (Global.getInstance().startTime - H5Common.backdur));
                	previewProxy.initData(data['posi']);
				} else {
					self.viewComponent.createPreSnapshot(null);
				}
				break;
			case H5ComponentEvent.VIDEO_VOLUME:
				self.sendNotification(H5Notification.VIDEO_VOLUME, data);
				break;
			case H5ComponentEvent.VIDEO_SWITCH:
				self.sendNotification(H5Notification.VIDEO_SWITCH, data);
				break;
			case H5ComponentEvent.VIDEO_TOGGLE:
				this.pObj = {
					'isVod': H5Common.isVod,
					'cid'  : Global.getInstance().cid,
					'swf'  : Global.getInstance().pObj['swf'],
					'link' : Global.getInstance().pObj['link'],
					'pl'   : Global.getInstance().pObj['pl']
				}
				self.sendNotification(H5Notification.VIDEO_TOGGLE, this.pObj);
				break;
			case H5ComponentEvent.ADD_VALUE:
                self.sendNotification(H5Notification.ADD_VALUE, data);
                break;
            case H5ComponentEvent.START_RECORD:
                self.sendNotification(H5Notification.START_RECORD, data);
				break;
			case H5ComponentEvent.VIDEO_VOLUME_ADV:
				var currAdvVolume = Global.getInstance().adVolume == 0 ? 100 : 0;
				afp.viewComponent.volume = currAdvVolume;
				self.viewComponent.volumeState = currAdvVolume;
				break;
			case H5ComponentEvent.VIDEO_CENTER:
				afp.viewComponent.setMidoverlayDisplay(data['display']=='none'?'block':'none');
				break;
			case H5ComponentEvent.VIDEO_PLAY:
				self.sendNotification(H5Notification.VIDEO_PLAY);
				break;
		}
	}

	/**
	 * @override
	 */
	listNotificationInterests() {
		return [
				H5Notification.VIDEO_UPDATE,
				H5Notification.VIDEO_STATE,
				H5Notification.VIDEO_START,
				H5Notification.VIDEO_PREVIEW_SNAPSHOT,
				H5Notification.VIDEO_EXPAND,
				H5Notification.VIDEO_PAY,
				H5Notification.PAY_COMPLETE,
				H5Notification.VIDEO_MOUSEMOVE,
				H5Notification.VIDEO_BUFFER_TIP,
				H5Notification.VIDEO_RECOM,
			];
	}

	/**
	 * @override
	 */
	handleNotification(note) {
		switch(note.getName()) {
			case H5Notification.VIDEO_UPDATE:
				this.viewComponent.update(note.getBody());
				break;
			case H5Notification.VIDEO_STATE:
				this.viewComponent.displayState = note.getBody()['playstate'];
				break;
			case H5Notification.VIDEO_START:
				this.viewComponent.showError(null);
				this.viewComponent.enable = !Global.getInstance().adRoll;
				break;
			case H5Notification.VIDEO_PREVIEW_SNAPSHOT:
				this.viewComponent.createPreSnapshot(note.getBody());
				break;
			case H5Notification.VIDEO_EXPAND:
				this.viewComponent.expandMode = note.getBody()['mode'];
				break;
			case H5Notification.VIDEO_PAY:
				this.vt = note.getBody()['vt'];
				let payProxy = this.facade.retrieveProxy(H5PayProxy.NAME);
				payProxy.dindex = 0;
				payProxy.loadData(this.vt);
				break;
			case H5Notification.PAY_COMPLETE:
				if (this.vt != 3) {// 非点播付费直接显示付费信息
					this.viewComponent.guideToPay(note.getBody());
				}
				break;
			case H5Notification.VIDEO_MOUSEMOVE:
				this.viewComponent.setUIEffect(note.getBody());
				break;
			case H5Notification.VIDEO_BUFFER_TIP:
				this.viewComponent.showBufferTip();
				break;
			case H5Notification.VIDEO_RECOM:
				if (note.getBody()) {
					this.viewComponent.showRecom(note.getBody());
				}
				break;
		}

	}
}