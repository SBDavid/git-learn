/**
 * ...
 * @author minliang_1112@foxmail.com
 */
;puremvc.define({
					name  : 'cn.pplive.player.view.H5ViewMediator',
					parent: puremvc.Mediator
				},
				{
					listNotificationInterests : function() {
						return [];
					},
					handleNotification : function(note) {
						//
					},
					onRemove : function() {
						//
					},
					onRegister : function() {
						debug('H5SkinMediator | H5AdverMediator | H5PlayerMediator 模块开始注册...');
						this.facade.registerMediator(new cn.pplive.player.view.H5SkinMediator());
						this.facade.registerMediator(new cn.pplive.player.view.H5AdverMediator());
						this.facade.registerMediator(new cn.pplive.player.view.H5PlayerMediator());
						//this.facade.registerMediator(new cn.pplive.player.view.H5BarrageMediator());
						//
						var self = this;
						this.orient();
						$(window).on('orientationchange' in window? 'orientationchange':'resize', function(e) {
																												recalc();
																												self.orient();
																											});
					},
					//横屏、竖屏执行
					orient : function() {
						puremvc.screen = false;
						var skinMediator = this.facade.retrieveMediator(cn.pplive.player.view.H5SkinMediator.NAME);
						var ua = navigator.userAgent.toLowerCase();
						debug('横屏、竖屏切换 ==>> ', window.orientation);
						if (window.orientation == 180 || window.orientation == 0) {
							//竖屏
							puremvc.screen = false;
							skinMediator.view().orientate();
						} 
						if (window.orientation == 90 || window.orientation == -90 ) {
							//横屏
							puremvc.screen = true;
							skinMediator.view().orientate();
						}
					}
				},
				{
					NAME : 'h5view_mediator'
				});