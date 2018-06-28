/**
 * ...
 * @author minliang_1112@foxmail.com
 */
;puremvc.define({
					name  : 'cn.pplive.player.controller.H5StartupCommand',
					parent: puremvc.MacroCommand
				},
				{
					initializeMacroCommand : function() {
						this.addSubCommand(cn.pplive.player.controller.H5ViewCommand);
					}
				});