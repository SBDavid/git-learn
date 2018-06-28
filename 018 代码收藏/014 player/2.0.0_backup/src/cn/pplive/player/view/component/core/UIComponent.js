/**
 * ...
 * @author minliang_1112@foxmail.com
 */
;puremvc.define(
				{
					name 		: 'cn.pplive.player.view.component.core.UIComponent',
					constructor : function() {
									this.target = null;
								}
				},
				{
					addEventListener : function (eventType, listener, useCapture) {
						//cn.pplive.player.view.event.H5PlayerEvent.addEventListener(this.target, eventType, listener, useCapture);
						this.target.on(eventType, { 
							                        self : listener 
						                          }, listener.handleEvent);
					},
					sendEvent : function(eventType, obj) {
						/*var componentEvent = this.createEvent(eventType);
						componentEvent.data = obj;
						this.dispatchEvent(componentEvent);*/					
						this.target.trigger(eventType, obj);
					},
					// 原生兼容写法，以作参考：
					/*createEvent : function(eventType) {
						return cn.pplive.player.view.event.H5PlayerEvent.createEvent(eventType);
					},
					dispatchEvent : function(event) {
						if(this.target) cn.pplive.player.view.event.H5PlayerEvent.dispatchEvent(this.target, event);
					},*/
				},
				{
					NAME : 'uicomponent',
				});