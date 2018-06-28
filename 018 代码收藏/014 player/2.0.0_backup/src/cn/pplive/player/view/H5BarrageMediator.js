/**
 * ...
 * @author minliang_1112@foxmail.com
 */
;puremvc.define({
					name   : 'cn.pplive.player.view.H5BarrageMediator',
					parent : puremvc.Mediator
				},
				{
					listNotificationInterests : function() {
						//注册可收听的事件队列
						 return [
									player.H5Notification.VIDEO_UPDATE,
									player.H5Notification.VIDEO_STATE,
									player.H5Notification.VIDEO_BARRAGE
								];
					},
					handleNotification : function(note){
						//处理事件队列
						switch(note.getName()) {
							case player.H5Notification.VIDEO_UPDATE:
								this.viewComponent.update(note.getBody()['posi']);
								break;
							case player.H5Notification.VIDEO_STATE:
								this.viewComponent.playstate(note.getBody()['playstate']);
								break;
							case player.H5Notification.VIDEO_BARRAGE:
								this.viewComponent.display(note.getBody()['visible']);
								break;
						}
					},
					onRemove : function() {
						//清除可显示对象
						this.setViewComponent(null);
					},
					onRegister : function() {
						//初始化，注册显示对象的事件监听
						this.setViewComponent(new cn.pplive.player.view.component.BarrageComponent());
					},
					onEvent : function() {
						//处理显示对象的事件逻辑
					},
					view : function() {
						if(this.viewComponent) {
							return this.viewComponent;
						}
						return null;
					}
				},
				{
					NAME : 'h5barrage_mediator'
				});
