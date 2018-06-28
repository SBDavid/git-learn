/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import puremvc from "puremvc";
import Global from "manager/Global";
import H5Notification from "common/H5Notification";
import { H5PlayCommand } from "../H5PlayCommand";

export class H5ControllerCommand extends puremvc.SimpleCommand {

	/**
	 * @override
	 */
	execute(note) {
		Global.debug('H5PlayCommand 模块开始注册...');
		this.facade.registerCommand(H5Notification.PLAY_COMPLETE, H5PlayCommand);
	}
}