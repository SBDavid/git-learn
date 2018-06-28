/**
 * ...
 * @author minliang_1112@foxmail.com
 */
;puremvc.define({
					name  : 'cn.pplive.player.bip.H5BipMediator',
					parent: puremvc.Mediator
				},
				{
					listNotificationInterests : function() {
						return [
								player.H5Notification.VIDEO_BIP,
								player.H5Notification.VIDEO_STORAGE,
								player.H5Notification.START_RECORD,
								player.H5Notification.STOP_RECORD,
								player.H5Notification.ADD_VALUE,
								player.H5Notification.VIDEO_SESSION_UPDATE,
								player.H5Notification.VIDEO_ONLINE
							];
					},
					handleNotification : function(note) {
						switch (note.getName()) {
							case player.H5Notification.VIDEO_BIP:
								this.bip.sendMobileReport(note.getBody()['dt'], note.getBody()['data']);
								break;
							case player.H5Notification.VIDEO_STORAGE:
								this.bip.setValue(note.getBody()['key'], note.getBody()['value']);
								break;
							case player.H5Notification.START_RECORD:
								this.bip.startRecord(note.getBody()['target']);
								break;
							case player.H5Notification.STOP_RECORD:
								this.bip.stopRecord(note.getBody()['target']);
								break;
							case player.H5Notification.ADD_VALUE:
								this.bip.addValue(note.getBody()['target']);
								break;
							case player.H5Notification.VIDEO_SESSION_UPDATE:
								this.bip.updateSession();
								break;
							case player.H5Notification.VIDEO_ONLINE:
								this.bip.sendOnlineReport(note.getBody());
								break;
						}
					},
					onRemove : function() {
						//
					},
					onRegister : function() {
						this.bip = new BIPReport(new BIPEncode());
						puremvc.bip = this.bip;
					}
				},
				{
					NAME : 'h5bip_mediator'
				});