/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import $ from 'jquery';
import { H5CommonUtils } from "common/H5CommonUtils";
import H5PlayerEvent from "common/H5PlayerEvent";

const createValidator = function(target) {
	return new Proxy(target, {
								set(target, key, value, proxy) {
								    return Reflect.set(target, key, value, proxy);
								},
								get(target, key, proxy) {
									return Reflect.get(target, key, proxy);
								}
							});
}

let vConsole;

export default class Global {
	
	static isSingleton = false;
	static instance;

	constructor() {
		if (!Global.isSingleton) {
			throw new Error('只能用 getInstance() 来获取实例...');
		}
	}

	static getInstance() {
		if (!Global.instance) {
			Global.isSingleton = true;
			Global.instance = new Global();
			//Global.instance = createValidator(this); //由于 Android 手机兼容性问题暂不启用
			Global.isSingleton = false;
		}
		return Global.instance;
	}

	/**
	 * @type  事件类型  onready | onerror | nextvideo
	 * @obj   传递对象
	 */
	static postMessage(type, obj) {
		obj || (obj = {});
		if (!(type == H5PlayerEvent.VIDEO_ONNOTIFICATION && !$.isEmptyObject(obj) && obj['header'] && obj['header']['type'] == 'position') && type != H5PlayerEvent.VIDEO_ONPROGRESS_CHANGED) {
			Global.debug('对外抛出 ', type, ' 事件...... ', obj);
		}
		window.parent.postMessage(JSON.stringify({
													'type' : type,
													'data' : obj
												}), '*');
	}

	static m_log = '';
	static debug(...rest) {
		let args = [].slice.call(arguments),
			getLocalTime = function(time) {
							return new Date(parseInt(time)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
						},
			mix = function(obj) {
					var str = '', sign;
					for (var i in obj) {
						try{
							if (typeof obj[i] == 'object') {
								sign = (obj[i].length != undefined?'[,]':'{,}').split(',');
								str += '"' + i + '":' + sign[0] + mix(obj[i]) + sign[1] + ',\r';
							}else {
								str += '"' + i + '":' + obj[i] + ',';
							}
						}catch(e){
							continue;
						}
					}
					return str;
				},
			trace = function(arr) {
						var str = '', obj;
						for (var i in arr) {
							if (typeof arr[i] == 'object') {
								obj = arr[i];
							} else {
								str += arr[i];
							}
						}
						str = getLocalTime(new Date().valueOf()) + "  ===>>>  " + str;
						if (obj) str += mix(obj);
						return str;
					},$log;
		$log = trace(args);
		Global.m_log += $log + '***日志分割***\r\n';
		if (H5CommonUtils.getQueryString('player') == 'debug') {
			if(Global.getInstance().isMobile) {
				if (!vConsole) {//移动端调试面板
					vConsole = new (require('vconsole'))();
				}
			}
			console.log($log);
		}
	}
}