/**
 * ...
 * @author minliang_1112@foxmail.com
 */
;puremvc.define({
					name  : 'cn.pplive.player.view.H5AdverMediator',
					parent: puremvc.Mediator
				},
				{
					listNotificationInterests : function() {
						return [
								player.H5Notification.ADS_STATUS,
								player.H5Notification.ADS_EVENT
							];
					},
					/**
					 * status :
					 *     -1(没有广告)，
					 *     -2(有广告，但一个都没有播放)
					 *     0(所有广告都正常播放完成) - 在暂停广告时也表示手动关闭广告
					 *     1(有部分广告没有播放出来)
					 *     10(登录会员跳广告)
					 *     11(广告iframe加载出错)
					 *     100(初始广告等待超时)
					 */
					handleNotification : function(note) {
						switch (note.getName()) {
							case player.H5Notification.ADS_STATUS:
								try{
									if (note.getBody()['status'] != undefined) {
										puremvc.advStatus = note.getBody()['status'];
										debug('删除广告容器 status ', puremvc.advStatus);
										if (this.viewComponent.vastAdBox) {
											this.viewComponent.vastAdBox.remove();
											this.viewComponent.vastAdBox = null;
										}
										this.sendNotification(player.H5Notification.ADV_OVER);
										return;
									}
								}catch(e){ };
								debug('展示广告容器 ...');
								delete puremvc.advStatus;
								this.viewComponent.execute(player.H5CommonUtils.adsUrl);
								break;
							case player.H5Notification.ADS_EVENT:
								try{
									var eObj = note.getBody();
									if (eObj['eventType'] == 'advSrc'){
										if(eObj['src']!= undefined && eObj['src']!='') {
											this.sendNotification(player.H5Notification.ADV_PLAY, {src:eObj['src']});
										}
									} else if(eObj['eventType'] == 'sendToAdvDom') {
										var win = $('#adiframe')[0].contentWindow;
										win.postMessage(JSON.stringify(note.getBody()),'*');
										return;
									} else if(eObj['eventType'] == 'showAdvDom') {
										this.viewComponent.showDom(true);
									} else if(eObj['eventType'] == 'advConnect') {
										this.sendNotification(player.H5Notification.ADV_CONNECT, {type:eObj['type']});
									}
								}catch(e){};
								break;
						}
					},
					onRemove : function() {
						this.setViewComponent(null);
					},
					onRegister : function() {
						//
						var UICom = cn.pplive.player.view.component.core.UIComponent;
						var Adver = cn.pplive.player.view.component.AdverComponent;
						UICom.call(Adver);
						$.extend(Adver.prototype , UICom.prototype);
						this.setViewComponent(new cn.pplive.player.view.component.AdverComponent());
						this.viewComponent.target = this.viewComponent.vastAdBox;
						//
						this.viewComponent.addEventListener(cn.pplive.player.view.event.H5PlayerEvent.ADS_STATUS, this);
						this.viewComponent.addEventListener(cn.pplive.player.view.event.H5PlayerEvent.ADS_EVENT, this);
					},
					handleEvent : function (event, data) {
						var self = event.data.self;
						switch(event.type) {
							case cn.pplive.player.view.event.H5PlayerEvent.ADS_STATUS:
								self.sendNotification(player.H5Notification.ADS_STATUS, data);
								break;
							case cn.pplive.player.view.event.H5PlayerEvent.ADS_EVENT:
								self.sendNotification(player.H5Notification.ADS_EVENT, data);
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
					NAME : 'h5adver_mediator'
				});