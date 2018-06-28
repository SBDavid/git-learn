/**
 * ...
 * @author minliang_1112@foxmail.com
 */

'use strict';
let global = (function(){
	
	let _instance = null;
	let _isSingleton = false;
	
	class Singleton {
		constructor() {
			if (!_isSingleton) {
				throw new Error('只能用 getInstance() 来获取实例...');
			}
		}	
	}
		
	return {
			getInstance() {
				if (!_instance) {
					_isSingleton = true;
					_instance = new Singleton();
					_isSingleton = false;
				}
				return _instance;
			}
		}
})();

class BIPReport {
	
	constructor(bipencode) {
		this.cookie = player.H5CommonUtils.cookie();
		this.storage = window.localStorage;
		this.bipencode = bipencode;
		this.vvid = null;
		this.updateSession();
	}
	
	updateSession() {
		this.sessionid = this.bipencode.createVVID();
		this.currVVID = this.vvid;
	}
	
	set sessionid(value) {
		this.vvid = value;
	}
	
	sendMobileReport(dt, data) {
		if (dt == 'bfr') {
			try{
				let storageObj = this.storage?this.storage:player.H5CommonUtils.queryToObject(document.cookie.replace(/(^|;)( |$)/g, '&'));
				for (let i in storageObj) {
					this._send_bfr(i);
				}
			}catch(e){}
		} else if (dt == 'sd') {
			this._sendReport(dt, [
									'tds=' + (puremvc.vde - puremvc.vds), //成功播放时延，单位：毫秒
									'pds=' + (puremvc.ftpe - puremvc.ftps), //play请求时延，单位：毫秒
									'ftps=' + puremvc.ftps, //请求起始点（first webplay start）单位：毫秒
									'url=' + encodeURIComponent(puremvc.playData['videoSrc'])
								]);
		} else if (dt == 'er') {
			this._sendReport(dt, [
									'er=' + data['errorcode'],
									'msg=' + encodeURIComponent(data['msg'])
								]);
		} else if (dt == 'act') {
			this._sendReport(dt, [
									'at=' + data['type']
								]);
		}
	}

	sendOnlineReport(obj) {
		this._send_online(obj['J']);
	}

	_send_online(jid, sid) {
		if (!sid) sid = this.vvid;
		let temp = [
					'A=' + (puremvc.videoType == 1 ? 0 : 1),
					'B=' + this._getValue(player.BIPCommon.GUID, sid),
					'vvid=' + sid,
					'C=' + this._getValue(player.BIPCommon.CID, sid),
					'D=' + this._getValue(player.BIPCommon.MN, sid),
					'E=' + this._getValue(player.BIPCommon.CLD, sid),
					'G=' + new Date().valueOf(),
					'J=' + jid,
					'h=' + this._getValue(player.BIPCommon.VH, sid),
					'v=' + player.H5CommonUtils.version(),
					'vt=' + Number(this._getValue(player.BIPCommon.VT, sid)) * 1000,
					'ft=' + this._getValue(player.BIPCommon.CFT, sid),
					'bwt=' + this._getValue(player.BIPCommon.BWT, sid),
					'passportid=' + encodeURIComponent(puremvc.userInfo.uid?puremvc.userInfo.uid:''),
					"bf=" + ((Number(this._getValue(player.BIPCommon.OLBS, sid)) >= 0) ? Number(this._getValue(player.BIPCommon.OLBF, sid)) : 0),
					"bs=" + ((Number(this._getValue(player.BIPCommon.OLBS, sid)) >= 0) ? Number(this._getValue(player.BIPCommon.OLBS, sid)) : 0),
					'appplt=wap'
				];
		if (this._getValue(player.BIPCommon.CTX, sid)) {
			temp.push(decodeURIComponent(this._getValue(player.BIPCommon.CTX, sid)));
		}
		let log = temp.join('&');
		debug('online日志 : 加密前 ==>> ', log);
		log = this.bipencode.encodeOnlineLog(log, '&#$EOQWIU31!DA421');
		new Image().src = `//ol.synacast.com/2.html?${log}`;
		this.setValue(player.BIPCommon.OLBF, 0);
		this.setValue(player.BIPCommon.OLBS, 0);
	}
	
	_send_bfr(sid) {
		let vt = Number(this._getValue(player.BIPCommon.VT, sid));
		if (vt > 0) {
			let temp = [
						'du=' + this._getValue(player.BIPCommon.DU, sid), //视频时长毫秒数，对直播该值为0
						'vt=' + vt * 1000, //观看时长毫秒数
						'now=' + this._getValue(player.BIPCommon.NOW, sid), //当前播放时间
						'bwtype=' + this._getValue(player.BIPCommon.BWT, sid),
						'ft=' + this._getValue(player.BIPCommon.CFT, sid),//多码流
						'bf=' + this._getValue(player.BIPCommon.BF, sid),//卡顿总次数
						'bs=' + this._getValue(player.BIPCommon.BS, sid)//卡顿总时长
					];
			this._sendReport('bfr', temp, sid);
		}
		if (sid != this.currVVID) {
			this._clearVVID(sid);
		}
	}
	
	_sendReport(dt, arr, sid) {
		if (!sid) sid = this.vvid;
		let temp = [
					'guid=' + this._getValue(player.BIPCommon.GUID, sid),
					'uid=' + this._getValue(player.BIPCommon.UID, sid),
					's=' + this._getValue(player.BIPCommon.S, sid),
					'v=' + player.H5CommonUtils.version(),
					'n=' + this._getValue(player.BIPCommon.MN, sid),
					'h=' + this._getValue(player.BIPCommon.VH, sid),
					'cid=' + this._getValue(player.BIPCommon.CID, sid),
					'clid=' + this._getValue(player.BIPCommon.CLD, sid),
					'vvid=' + sid,
					'apptype=' + puremvc.loadType,
					'scr=' + encodeURIComponent(window.screen.width+'*'+window.screen.height)
				];
		if (this._getValue(player.BIPCommon.CTX, sid)) {
			temp.push(decodeURIComponent(this._getValue(player.BIPCommon.CTX, sid)));
		}
		if (arr && arr.length > 0) temp = temp.concat(arr);
		let log = temp.join('&');
		log += '&rnd=' + Math.random();
		debug('BIP日志类型 : '+ dt, ' 加密前 ==>> ',log);
		log = this.bipencode.encodeLog(log, 'mobile');
		new Image().src = `//mobile.synacast.com/${dt}/1.html?${log}`;
	}
	
	startRecord(key) {
		global.getInstance()[key] = {
										'time' : new Date().valueOf(),
										'bool' : true
									}
	}
	
	stopRecord(key) {
		let pre, now = new Date().valueOf();
		if (global.getInstance()[key] && global.getInstance()[key]['bool']) {
			pre = global.getInstance()[key]['time'];
			global.getInstance()[key]['bool'] = false;
			global.getInstance()[key]['time'] = (now - pre < 20000 * 1000)?(now - pre):1;
			switch(key){
				case player.BIPCommon.BS:
					this.addValue(key, global.getInstance()[key]['time']);
					break;
				case player.BIPCommon.OLBS:
					this.addValue(key, global.getInstance()[key]['time']);
					debug('卡顿停止计时 本次卡顿时间' + global.getInstance()[key]['time'] + ',本次卡顿开始时间：' + pre + ',本次卡顿结束时间：' + now + ', 卡顿总时间:' + int(this._getValue(key, this.vvid)));
					break;
			}
		}
	}
	
	_clearVVID(sid) {
		try{
			let storage = this.storage?this.storage:this.cookie;
			storage.removeItem(sid);
		}catch(e){}
	}
	
	/**
	 * 数据累积存储
	 * @key   
	 * @value  递增器
	 */
	addValue(key, value = 1) {
		let curr = 0, gv = this._getValue(key);
		if (!this._isNullOrUndefined(gv)) {
			curr = parseInt(gv);
		}
		curr += value;
		this.setValue(key, curr);
		if (key == player.BIPCommon.BS) {
			debug('当前记录卡顿时长 : ', value, ' 总时长 : ', curr);
		}
		if (key == player.BIPCommon.BF) {
			debug('当前记录卡顿总次数 : ', curr);
		}
	}
	
	/**
	 * 数据存储
	 * @key   
	 * @value
	 */
	setValue(key, value) {
		try{
			let storage = this.storage?this.storage:this.cookie, ssObj = {}, sid = this.vvid;
			if (this._isEmptyObj(storage.getItem(sid))) {
				ssObj = JSON.parse(storage.getItem(sid));
			}
			ssObj[key] = value;
			storage.setItem(sid, JSON.stringify(ssObj));
		}catch(e){}
	}
	
	_isEmptyObj(obj) {
		for (let i in obj) {
			return true;
		}
		return false;
	}
	
	/**
	 * 数据获取
	 * @key
	 */
	_getValue(key, sid) {
		try{
			let storage = this.storage?this.storage:this.cookie, ssObj = null;
			if (!sid) sid = this.vvid;
			try{
				ssObj = JSON.parse(storage.getItem(sid));
				if (!this._isNullOrUndefined(ssObj[key])) {
					return encodeURIComponent(ssObj[key]);
				}
			}catch(e){}
		}catch(e){}
		return null;
	}
	
	_isNullOrUndefined(data) { 
		return data === undefined || data === null;
	}
}