/**
 * ...
 * @author minliang_1112@foxmail.com
 */
;puremvc.define({
					name: 'cn.pplive.player.view.event.H5PlayerEvent'
				},
				{ },
				{
					ADS_STATUS   : 'ads_status',
					WEB_PLAY     : 'web_play',
					SKIN_TIPS    : 'skin_tips',
					SKIN_STATE   : 'skin_state',
					SKIN_RECOM   : 'skin_recom',
					CONTROL_STATE: 'control_state',
					VIDEO_TITLE  : 'video_title',
					VIDEO_STATE  : 'video_state',
					VIDEO_BARRAGE: 'video_barrage',
					VIDEO_UPDATE : 'video_update',
					VIDEO_SCREEN : 'video_screen',
					VIDEO_BUFFER : 'video_buffer',
					VIDEO_SEEK   : 'video_seek',
					VIDEO_REPLAY : 'video_replay',
					VIDEO_FAILED : 'video_failed',
					VIDEO_BIP    : 'video_bip',
					VIDEO_STORAGE: 'video_storage',
					VIDEO_ONLINE : 'video_online',
					START_RECORD : 'startRecord',//开始记录
					STOP_RECORD  : 'stopRecord',//结束记录
					ADD_VALUE    : 'addValue',//累加值
					ADS_EVENT    : 'ads_event',
					//
					// 原生兼容写法，以作参考：
					/* createEvent: function(eventType) {
						var event;
						if(document.createEvent) {
						   event = document.createEvent('Events');
						   event.initEvent(eventType, false, false);
						} else if (document.createEventObject) {
						   event = document.createEventObject();
						}
						return event;
					},
					addEventListener: function(target, eventType, listener, useCapture) {
						if (target.addEventListener) {
							target.addEventListener(eventType, listener, useCapture);
						} else if (target.attachEvent) {
							target.attachEvent('on' + eventType, listener);
						}
					},
					dispatchEvent : function(target, event) {
						if (target.dispatchEvent) {
						   target.dispatchEvent(event);
						} else if (target.fireEvent) {
						   target.fireEvent('on' + event.type, event);
						}
					} */
				});
                    
                    
