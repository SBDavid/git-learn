/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import puremvc from "puremvc";
import Global from "manager/Global";
import { H5PayProxy } from "model/H5PayProxy";
import { H5PlayProxy } from "model/H5PlayProxy";
import { H5RecomProxy } from "model/H5RecomProxy";
import { H5PreSnapshotProxy } from "model/H5PreSnapshotProxy";

export class H5ModelCommand extends puremvc.SimpleCommand {

	/**
	 * @override
	 */
	execute(note) {
		Global.debug('H5PlayProxy H5PayProxy H5RecomProxy H5PreSnapshotProxy 模块开始注册...');
		this.facade.registerProxy(new H5PlayProxy(H5PlayProxy.NAME));
		this.facade.registerProxy(new H5PayProxy(H5PayProxy.NAME));
		this.facade.registerProxy(new H5RecomProxy(H5RecomProxy.NAME));
		this.facade.registerProxy(new H5PreSnapshotProxy(H5PreSnapshotProxy.NAME));
	}
}