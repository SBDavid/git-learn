/**
 * ...
 * @author minliang_1112@foxmail.com
 */
;puremvc.define(
				{
					name 		: 'cn.pplive.player.view.component.AdverComponent',
					constructor : function() {
									$('.control').before(player.CommonUI.adverHtml);
									this.vastAdBox = puremvc.pbox.find('.p-video-vastad');
									//
									this.finished = false;
									$(window).on('message', function(e) {
																			//source – 消息源，消息的发送窗口/iframe。
																			//origin – 消息源的URI(可能包含协议、域名和端口)，用来验证数据源。
																			//data – 发送方发送给接收方的数据。
																			//e.data ==>> {"type":"finish","values":["-1"]}  (Pad环境下，由广告播放器抛出)
																			debug('监听到广告播放器抛出事件 ==>> ', e.data);
																			this.finished = true;
																			try{
																				var $data = $.parseJSON(e.data);
																				switch($data['type']) {
																					case 'finish':
																						this.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.ADS_STATUS, {
																																								'status' : parseInt($data['values'][0])
																																							});
																						break;
																					case 'videoSrc':
																						this.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.ADS_EVENT, {
																																								'eventType':'advSrc',
																																								'src' : $data['values'][0]
																																							});
																						break;
																				}
																			}catch(e){}
																			this.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.ADS_EVENT, {
																																					'eventType':'advConnect',
																																					'type' : $data['type']
																																				});
																		}.bind(this));
								}
				},
				{
					execute : function(src) {
								var queryToString = function(object) {
													if (!object || $.isEmptyObject(object)) return '';
													return $.param(object);
												}
								src += queryToString(puremvc.adConfig) + '&o=' + puremvc.ctx.o;
								try{
									debug('广告播放器url ==>> ', src);
									this.vastAdBox.html('<iframe id="adiframe" name="adiframe" src="'+ src +'" width="100%" height="100%"  scrolling="no" frameborder="0"></iframe>');
									this.showDom(false);
									this.vastAdBox.find('iframe')[0].onerror = function() {
																							this.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.ADS_STATUS, {
																																									'status' : 11
																																								});
																						}.bind(this);
								}catch(e){}
					},
					showDom : function(bl) {
						if (bl) {
							setTimeout(function() {
													debug('广告移除 ==>> ', !this.finished);
													if(this.finished) return;
													this.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.ADS_STATUS, {
																															'status' : 100
																														});
												}.bind(this), 15*1000);
							this.vastAdBox.show();
						} else this.vastAdBox.hide();
					},
				},
				{
					NAME : 'advercomponent',
				});