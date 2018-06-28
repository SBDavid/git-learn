/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import puremvc from "puremvc";
import Global from "manager/Global";
import {H5BipMediator} from "bip/H5BipMediator";
import {H5ViewMediator} from "view/H5ViewMediator";

export class H5ViewCommand extends puremvc.SimpleCommand {

	/**
	 * @override
	 */
	execute(note) {
		Global.debug('H5BipMediator | H5ViewMediator 模块开始注册...');
		this.facade.registerMediator(new H5BipMediator(H5BipMediator.NAME));
		this.facade.registerMediator(new H5ViewMediator(H5ViewMediator.NAME));
	}
}