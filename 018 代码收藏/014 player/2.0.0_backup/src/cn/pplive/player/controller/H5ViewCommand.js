/**
 * ...
 * @author minliang_1112@foxmail.com
 */
;puremvc.define({
					name  : 'cn.pplive.player.controller.H5ViewCommand',
					parent: puremvc.SimpleCommand
				},
				{
					execute : function() {
						debug('H5PlayProxy | H5BipMediator | H5ViewMediator 模块开始注册...');
						this.facade.registerMediator(new cn.pplive.player.bip.H5BipMediator());
						this.facade.registerProxy(new cn.pplive.player.model.H5PlayProxy());
						this.facade.registerMediator(new cn.pplive.player.view.H5ViewMediator());
					}
				}); 