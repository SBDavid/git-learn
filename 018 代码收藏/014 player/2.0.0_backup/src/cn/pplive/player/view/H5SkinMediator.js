/**
 * ...
 * @author minliang_1112@foxmail.com
 */
;puremvc.define({
					name  : 'cn.pplive.player.view.H5SkinMediator',
					parent: puremvc.Mediator
				},
				{
					listNotificationInterests : function() {
						return [
								player.H5Notification.CONTROL_STATE,
								player.H5Notification.VIDEO_TITLE,
								player.H5Notification.VIDEO_UPDATE,
								player.H5Notification.VIDEO_STATE,
								player.H5Notification.SKIN_TIPS
							];
					},
					handleNotification : function(note) {
						switch (note.getName()) {
							case player.H5Notification.CONTROL_STATE:
								this.viewComponent.controlAnimate(note.getBody()['visible']);
								break;
							case player.H5Notification.VIDEO_TITLE:
								this.viewComponent.playUITitle.find('span').html(puremvc.title);
								this.viewComponent.playUITitle.css('display', note.getBody()['display']);
								break;
							case player.H5Notification.VIDEO_UPDATE:
								this.viewComponent.update(note.getBody());
								break;
							case player.H5Notification.VIDEO_STATE:
								this.viewComponent.displayState(note.getBody()['playstate']);
								break;
							case player.H5Notification.SKIN_TIPS:
								this.viewComponent.showTip(true);
								break;
						}
					},
					onRemove : function() {
						this.setViewComponent(null);
					},
					onRegister : function() {
						//
						var UICom = cn.pplive.player.view.component.core.UIComponent;
						var Skin = cn.pplive.player.view.component.SkinComponent;
						UICom.call(Skin);
						$.extend(Skin.prototype , UICom.prototype);
						this.setViewComponent(new cn.pplive.player.view.component.SkinComponent());
						this.viewComponent.target = this.viewComponent.playUIControl;
						//
						this.viewComponent.addEventListener(cn.pplive.player.view.event.H5PlayerEvent.SKIN_STATE, this);
						this.viewComponent.addEventListener(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_SCREEN, this);
						this.viewComponent.addEventListener(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_SEEK, this);
						this.viewComponent.addEventListener(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_REPLAY, this);
						this.viewComponent.addEventListener(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_BARRAGE, this);
					},
					handleEvent : function (event , data) {
						var self = event.data.self;
						switch(event.type) {
							case cn.pplive.player.view.event.H5PlayerEvent.SKIN_STATE:
								self.sendNotification(player.H5Notification.SKIN_STATE);
								break;
							case cn.pplive.player.view.event.H5PlayerEvent.VIDEO_SCREEN:
								self.sendNotification(player.H5Notification.VIDEO_SCREEN);
								break;
							case cn.pplive.player.view.event.H5PlayerEvent.VIDEO_SEEK:
								self.sendNotification(player.H5Notification.VIDEO_SEEK);
								break;
							case cn.pplive.player.view.event.H5PlayerEvent.VIDEO_REPLAY:
								self.sendNotification(player.H5Notification.VIDEO_REPLAY);
								break;
							case cn.pplive.player.view.event.H5PlayerEvent.VIDEO_BARRAGE:
								self.sendNotification(player.H5Notification.VIDEO_BARRAGE, data);
								break;
						 }
						
					},
					view : function() {
						if (this.viewComponent) {
							return this.viewComponent;
						}
						return null;
					}
				},
				{
					NAME : 'h5skin_mediator'
				});