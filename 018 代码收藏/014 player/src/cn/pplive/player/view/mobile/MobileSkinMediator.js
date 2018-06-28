/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import puremvc from "puremvc";
import Global from "manager/Global";
import H5PlayerEvent from "common/H5PlayerEvent";
import H5Notification from "common/H5Notification";
import H5ComponentEvent from "../event/H5ComponentEvent";
import { MobileSkinComponent } from "./component/MobileSkinComponent";

export class MobileSkinMediator extends puremvc.Mediator {

	static NAME = 'mobile_skin_mediator';

	onRegister() {
		this.setViewComponent(new MobileSkinComponent());
		this.viewComponent.target = this.viewComponent.playUIControl;
		//
		this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_PLAY, this);
		this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_SCREEN, this);
		this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_SEEK, this);
		this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_REPLAY, this);
		this.viewComponent.addEventListener(H5ComponentEvent.VIDEO_BARRAGE, this);
	}

	handleEvent(event, data) {
		let self = event.data.self;
		switch(event.type) {
			case H5ComponentEvent.VIDEO_PLAY:
				self.sendNotification(H5Notification.VIDEO_PLAY);
				break;
			case H5ComponentEvent.VIDEO_SCREEN:
				self.sendNotification(H5Notification.VIDEO_SCREEN, data);
				break;
			case H5ComponentEvent.VIDEO_SEEK:
				self.sendNotification(H5Notification.VIDEO_SEEK);
				break;
			case H5ComponentEvent.VIDEO_REPLAY:
				self.sendNotification(H5Notification.VIDEO_REPLAY);
				break;
			case H5ComponentEvent.VIDEO_BARRAGE:
				self.sendNotification(H5Notification.VIDEO_BARRAGE, data);
				break;
		}
	}

	/**
	 * @override
	 */
	listNotificationInterests() {
		return [
				H5Notification.CONTROL_STATE,
				H5Notification.VIDEO_TITLE,
				H5Notification.VIDEO_UPDATE,
				H5Notification.VIDEO_STATE,
				H5Notification.SKIN_TIPS,
				H5Notification.VIDEO_FD_COUNTDOWN,
			];
	}

	/**
	 * @override
	 */
	handleNotification(note) {
		switch(note.getName()) {
			case H5Notification.CONTROL_STATE:
				this.viewComponent.controlAnimate(note.getBody()['visible']);
				break;
			case H5Notification.VIDEO_TITLE:
				this.viewComponent.playUITitle.find('span').html(Global.getInstance().title);
				this.viewComponent.playUITitle.css('display', note.getBody()['display']);
				break;
			case H5Notification.VIDEO_UPDATE:
				this.viewComponent.update(note.getBody());
				break;
			case H5Notification.VIDEO_FD_COUNTDOWN:
				this.viewComponent.showCountDown(note.getBody());
				break;
			case H5Notification.VIDEO_STATE:
				this.viewComponent.displayState(note.getBody()['playstate']);
				break;
			case H5Notification.SKIN_TIPS:
				this.viewComponent.showTip(true);
				break;
		}
	}

	onRemove() {
		this.setViewComponent(null);
	}
}