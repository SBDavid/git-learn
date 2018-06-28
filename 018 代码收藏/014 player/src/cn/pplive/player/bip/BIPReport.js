/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import BIPCommon from "./BIPCommon";
import Global from "manager/Global";
import { H5Common } from "common/H5Common";
import H5PlayerEvent from "common/H5PlayerEvent";
import { H5CommonUtils } from "common/H5CommonUtils";

const storageName = 'pp_common_storage';//播放常用属性存储key

export class BIPReport {

	constructor(bipencode) {
		this.cookie = H5CommonUtils.cookie();
		//android 原生浏览器不支持 localStorage，做如下兼容处理
		try{
			this.storage = window.localStorage;
		}catch(e){
			this.storage = this.cookie;
		}
		this.bipencode = bipencode;
		this.vvid = null;
		this.updateSession();
	}
	
	updateSession() {
		this.sessionid = this.bipencode.createVVID();
		this.currVVID = this.vvid;
		Global.getInstance().adConfig.vvid = this.vvid;
	}
	
	set sessionid(value) {
		this.vvid = value;
	}
	
	sendBIPReport(dt, data) {
		if (dt == 'bfr') {
			try{
				let storageObj = this.storage?this.storage:H5CommonUtils.queryToObject(document.cookie.replace(/(^|;)( |$)/g, '&'));
				for (let i in storageObj) {
					this.send_coreInfo(i);
					this.send_bfr(i);
				}
			}catch(e){}
		} else if (dt == 'sd') {
			this.setValue('tds', Global.getInstance().vde - Global.getInstance().vds); //存储播放启动时延
			this.sendReport(dt, [
									'tds=' + (Global.getInstance().vde - Global.getInstance().vds), //成功播放时延，单位：毫秒
									'pds=' + (Global.getInstance().ftpe - Global.getInstance().ftps), //play请求时延，单位：毫秒
									'ftps=' + Global.getInstance().ftps, //请求起始点（first webplay start）单位：毫秒
									'vde=' + (Global.getInstance().vde - Global.getInstance().ftps),
									'vds=' + (Global.getInstance().vds - Global.getInstance().ftps),
									'stps=' + (Global.getInstance().stps - Global.getInstance().ftps),
									//'url=' + encodeURIComponent((Global.getInstance().playData && Global.getInstance().playData['videoSrc'])?Global.getInstance().playData['videoSrc']:Global.getInstance().playUrl)
								]);
		} else if (dt == 'er') {
			this.sendReport(dt, [
									'er=' + data['errorcode'],
									'msg=' + encodeURIComponent(data['msg']),
									'tds=' + (Global.getInstance().vde - Global.getInstance().vds), //成功播放时延，单位：毫秒
									'pds=' + (Global.getInstance().ftpe - Global.getInstance().ftps), //play请求时延，单位：毫秒
									'ftps=' + Global.getInstance().ftps, //请求起始点（first webplay start）单位：毫秒
									//'url=' + encodeURIComponent(Global.getInstance().playData && Global.getInstance().playData['videoSrc']?Global.getInstance().playData['videoSrc']:Global.getInstance().playUrl)
								]);
		} else if (dt == 'act') {
			this.sendReport(dt, [
									'at=' + data['type']
								]);
		}else if (dt == 'pv')
		{
			this.sendReport(dt);
		}
		else if (dt == 'livestop')
		{
			this.send_coreInfo(dt);
		}
	}

	sendOnlineReport(obj) {
		this.send_online(obj['J']);
	}

	/*
	 *  @param	jid 播放状态：1=开始播放，2=缓存，3=暂停，4=正常播放，5=结束播放
	 */
	send_online(jid, sid) {
		if (!sid) sid = this.vvid;
		let temp = [
					'A=' + (Global.getInstance().videoType == 1 ? 0 : 1),
					'B=' + this.getValue(BIPCommon.GUID, sid),
					'vvid=' + sid,
					'C=' + this.getValue(BIPCommon.CID, sid),
					'E=' + this.getValue(BIPCommon.CLD, sid),
					'G=' + new Date().valueOf(),
					'J=' + jid,
					'h=' + this.getValue(BIPCommon.VH, sid),
					'v=' + H5Common.version(),
					'vt=' + Number(this.getValue(BIPCommon.VT, sid)) * 1000,
					'ft=' + this.getValue(BIPCommon.CFT, sid),
					'bwt=' + this.getValue(BIPCommon.BWT, sid),
					'passportid=' + encodeURIComponent(Global.getInstance().userInfo.uid?Global.getInstance().userInfo.uid:''),
					"bf=" + ((Number(this.getValue(BIPCommon.OLBS, sid)) >= 0) ? Number(this.getValue(BIPCommon.OLBF, sid)) : 0),
					"bs=" + ((Number(this.getValue(BIPCommon.OLBS, sid)) >= 0) ? Number(this.getValue(BIPCommon.OLBS, sid)) : 0),
					'appplt=wap',
					'sectionid=' + this.getValue(BIPCommon.SECTIONID, sid)
				];
		
		if (!Global.getInstance().isMobile) {
			var tempPC = [
							'F=',
							'D=' + this.getValue(BIPCommon.VID, sid),
							'ilt=' + (jid == 1 ? 1 : 0),
							'lt=' + (Global.getInstance().vde - Global.getInstance().vds), //成功播放时延，单位：毫秒
							'type=mhpptv',
							'dc=' +((this.getValue(BIPCommon.OLDST, sid) && this.getValue(BIPCommon.OLDST, sid) >= 0) ? (this.getValue(BIPCommon.OLDC, sid)) : 0),
							'dst=' +((this.getValue(BIPCommon.OLDST, sid) && this.getValue(BIPCommon.OLDST, sid) >= 0) ? (this.getValue(BIPCommon.OLDST, sid)) : 0),
							'md=h5mse',
							'ifid='    + this.getValue(BIPCommon.IFID, sid),
							'cataid1=' + this.getValue(BIPCommon.CATAID1, sid),
							'cataid2=' + this.getValue(BIPCommon.CATAID2, sid)
						]
			temp = temp.concat(tempPC);
		} else {
			temp.push('D=' + this.getValue(BIPCommon.MN, sid));
		}
		
		if (this.getValue(BIPCommon.CTX, sid)) {
			temp.push(decodeURIComponent(this.getValue(BIPCommon.CTX, sid)));
		}
		let log = temp.join('&');
		Global.debug('online日志 : 加密前 ==>> ', log);
		log = this.bipencode.encodeOnlineLog(log, '&#$EOQWIU31!DA421');
		let url = `//ol.synacast.com/2.html?${log}`;
		Global.debug('online日志 : 加密后 ==>> ', url);
		new Image().src = url;
		this.setValue(BIPCommon.OLBF, 0);
		this.setValue(BIPCommon.OLBS, 0);
		this.setValue(BIPCommon.OLDST, 0);
		this.setValue(BIPCommon.OLDC, 0);
		
		try{
			//苏宁(实时在线)
			let tempObj = {
				'vdid' : this.getValue(BIPCommon.CID, sid),
				'cate'  : '',
				'plid'  : sid,
				'psts'  : jid,
				'pbc'   : ((Number(this.getValue(BIPCommon.OLBS, sid)) >= 0) ? Number(this.getValue(BIPCommon.OLBF, sid)) : 0) + '',   //  卡顿次数（缓冲次数）
				'pbt'   : ((Number(this.getValue(BIPCommon.OLBS, sid)) >= 0) ? Number(this.getValue(BIPCommon.OLBS, sid)) : 0) + '',   //  卡顿时间（缓冲时间）
				'cdnip' : this.getValue(BIPCommon.VH, sid),
				'br'    : this.getValue(BIPCommon.CFT, sid),        // 多码流
				'bwtp'  : this.getValue(BIPCommon.BWT, sid),        // 带宽调度类型
				'chge'  : Global.getInstance().pt + '',             // 是否收费  1、是   0、否
				'pgnt'  : '',   //  节目性质（推流、自制）
				'ctp'   : '',   //  运营商套餐
				'ptp'   : (Global.getInstance().videoType == 1 ? 2 : 1),
				'dgbc'  : '',   //  拖动缓冲次数
				'dgbt'  : '',   //  拖动缓冲时间
				'pdl'   : '',   //  从播放器启动到开始播放所花的时间,确认 播放器是不是秒开
				'ext'	: JSON.stringify({'pgid':'','err':String(this.getValue(BIPCommon.ERROR_CODE, sid))})
			}
			Global.debug('suning online ==>> ', tempObj);
			Global.postMessage(H5PlayerEvent.VIDEO_SUNING_BIP,  {
																	type : 2,
																	param : tempObj
																});
		}catch(e){}
		
		try{
			if(jid == 1 || jid == 5)
			{
				let vt = Number(this.getValue(BIPCommon.VT, sid));
				//苏宁(播放开始/结束统计)
				let tempObj = {
					'vdid' : this.getValue(BIPCommon.CID, sid),
					'cate'  : '',
					'plid'  : sid,
					'pt'    : jid == 1 ? 0 : vt * 1000,
					'pte'   : jid == 1 ? 0 :((vt - Number(this.getValue(BIPCommon.PTE, sid))) * 1000),  // 去除广告播放时间的WatchTime，不计暂停时间
					'psr'   : Global.getInstance().ctx.o,
					'pbt'   : Number(this.getValue(BIPCommon.BS, sid)) + '',    						//卡顿总时长
					'pbc'   : Number(this.getValue(BIPCommon.BF, sid)) + '',    						//卡顿总次数
					'pdl'   : this.getValue('tds', sid), 	//从播放器启动到开始播放所花的时间
					'dgc'   : this.getValue(BIPCommon.DG, sid),    // 拖动次数
					'dgbt'  : this.getValue(BIPCommon.TDD, sid),    // 由拖动产生的缓冲时长
					'adls'  : '',    // 平均下载速度
					'isps'  : this.getValue(BIPCommon.ERROR_CODE, sid) ? 2 : 1,     // 播放是否成功  1、是   0、否
					'ptp'   : (Global.getInstance().videoType == 1 ? 2 : 1),
					'br'    : this.getValue(BIPCommon.CFT, sid),   //多码流
					'chge'  : Global.getInstance().pt + '',        // 是否收费  1、是   0、否
					'pgnt'  : '',    // 节目性质（推流、自制）  1、推流   2、自制
					'ctp'   : '',    // 运营商套餐
					'um'    : '',    // 海沟相关,-1，未返回;0,黑名单用户;1,非真实用户;2,真实用户;3,白名单用户;10,强制普通;11,强制真实用户pptv特有,用来播盗版内容防止别人取证用的
					'ext'   : JSON.stringify({'pgid':'', 'err':String(this.getValue(BIPCommon.ERROR_CODE, sid)), 'psts':jid})
				}
				Global.debug('suning play ==>> ', tempObj);
				Global.postMessage(H5PlayerEvent.VIDEO_SUNING_BIP,  {
																	type : 1,
																	param : tempObj
																});
			}
		}catch(e){}
	}
	
	send_coreInfo(sid)
	{
		if (!sid) sid = this.vvid;
		if (this.getValue(BIPCommon.COREINFO, sid))
		{
			let coreinfo = decodeURIComponent(this.getValue(BIPCommon.COREINFO, sid));
			this.sendReport('livestop',coreinfo.split('&'), sid);				
		}
	}
	
	send_bfr(sid) {
		let vt = Number(this.getValue(BIPCommon.VT, sid));
		if (vt > 0) {
			let temp = [
						'du=' + this.getValue(BIPCommon.DU, sid),    //视频时长毫秒数，对直播该值为0
						'vt=' + vt * 1000,                           //观看时长毫秒数
						'now=' + this.getValue(BIPCommon.NOW, sid),  //当前播放时间
						'bwtype=' + this.getValue(BIPCommon.BWT, sid),
						'ft=' + this.getValue(BIPCommon.CFT, sid),   //多码流
						'bf=' + Number(this.getValue(BIPCommon.BF, sid)),    //卡顿总次数
						'bs=' + Number(this.getValue(BIPCommon.BS, sid)),    //卡顿总时长
						'ss=' + this.getValue(BIPCommon.SS, sid)     //字段：ss：(SourceSite) ;<Int> 播放来源
					];
					
			if (!Global.getInstance().isMobile)
			{
				temp.push('dg=' + this.getValue(BIPCommon.DG, sid));
				temp.push('sr=' + this.getValue(BIPCommon.SR, sid));
			}
			this.sendReport('bfr', temp, sid);
		}
		if (sid != this.currVVID && sid != storageName) {
			this.clearVVID(sid);
		}
	}

	sendReport(dt, arr, sid) {
		if (!sid) sid = this.vvid;
		let temp = [
					'guid='  + this.getValue(BIPCommon.GUID, sid),
					'uid='   + this.getValue(BIPCommon.UID, sid),
					's='     + this.getValue(BIPCommon.S, sid),
					'v='     + H5Common.version(),
					'n='     + this.getValue(BIPCommon.MN, sid),
					'h='     + this.getValue(BIPCommon.VH, sid),
					'cid='   + this.getValue(BIPCommon.CID, sid),
					'clid='  + this.getValue(BIPCommon.CLD, sid),
					'vvid='  + sid,
					'apptype=' + Global.getInstance().loadType,
					'scr='   + encodeURIComponent(window.screen.width+'*'+window.screen.height),
					'ut='    + this.getValue(BIPCommon.UT, sid),
					'sectionid=' + this.getValue(BIPCommon.SECTIONID, sid)
				];
		if (!Global.getInstance().isMobile){
			let tempPC= [
							'cvid='    + this.getValue(BIPCommon.CVID, sid),
							'vid='     + this.getValue(BIPCommon.VID, sid),
							'isvip='   + ((this.getValue(BIPCommon.ISVIP, sid) == 'true') ? 1: 0),
							'pl='      + this.getValue(BIPCommon.PL, sid),
							'type='    + Global.getInstance().loadType,
							'ifid='    + this.getValue(BIPCommon.IFID, sid),
							'cataid1=' + this.getValue(BIPCommon.CATAID1, sid),
							'cataid2=' + this.getValue(BIPCommon.CATAID2, sid),
							'md=h5mse'
						]
			temp = temp.concat(tempPC);
		}
	    if (this.getValue(BIPCommon.USERTO, sid)) {
	    	temp.push('sf=' + this.getValue(BIPCommon.USERTO, sid))
	    }
	    
		if (this.getValue(BIPCommon.CTX, sid)) {
			temp.push(decodeURIComponent(this.getValue(BIPCommon.CTX, sid)));
		}
		
		if (this.getValue(BIPCommon.DCTX, sid)) {
			temp.push(decodeURIComponent(this.getValue(BIPCommon.DCTX, sid)));
		}
		
		if (arr && arr.length > 0) temp = temp.concat(arr);
		if (!Global.getInstance().isMobile) {
			temp.unshift(`dt=${dt}`);
		}
		let log = temp.join('&');
		log += '&rnd=' + Math.random();
		Global.debug('BIP日志类型 : '+ dt, ' 加密前 ==>> ',log);
		let url;
		if (Global.getInstance().isMobile) {
			log = this.bipencode.encodeLog(log, 'mobile');
			url = `//mobile.synacast.com/${dt}/1.html?${log}`;
		} else {
			log = this.bipencode.encodeLog(log, 'pplive');
			url = `//ik.synacast.com/1.html?${log}`;
		}
		Global.debug('BIP日志类型 : '+ dt, ' 加密后 ==>> ', url);
		new Image().src = url;
	}			
	
	startRecord(key) {
		Global.getInstance()[key] = {
										'time' : new Date().valueOf(),
										'bool' : true
									}
	}
	
	stopRecord(key) {
		let pre, now = new Date().valueOf();
		if (Global.getInstance()[key] && Global.getInstance()[key]['bool']) {
			pre = Global.getInstance()[key]['time'];
			Global.getInstance()[key]['bool'] = false;
			Global.getInstance()[key]['time'] = (now - pre < 20000 * 1000)?(now - pre):1;
			switch(key){
				case BIPCommon.BS:
					this.addValue(key, Global.getInstance()[key]['time']);
					break;
				case BIPCommon.OLBS:
					this.addValue(key, Global.getInstance()[key]['time']);
					Global.debug('卡顿停止计时 本次卡顿时间' + Global.getInstance()[key]['time'] + ',本次卡顿开始时间：' + pre + ',本次卡顿结束时间：' + now + ', 卡顿总时间:' + parseInt(this.getValue(key, this.vvid)));
					break;
				case BIPCommon.DTT: 
					this.sendReport("dtt", ['dtt=' + Global.getInstance()[BIPCommon.DTT]['time']]);
					break;
				case BIPCommon.TDD: 
					this.addValue(key, Global.getInstance()[key]['time']);
					this.sendReport("dd", ['dd=' + Global.getInstance()[BIPCommon.TDD]['time']]);
					break;
				case BIPCommon.OLDST:
					this.addValue(key, Global.getInstance()[key]['time']);
					break;
			}
		}
	}
	
	clearVVID(sid) {
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
		let curr = 0, gv = this.getValue(key, this.vvid);
		if (!this.isNullOrUndefined(gv)) {
			curr = parseInt(gv);
		}
		curr += value;
		this.setValue(key, curr);
		if (key == BIPCommon.BS) {
			Global.debug('当前记录卡顿时长 : ', value, ' 总时长 : ', curr);
		}
		if (key == BIPCommon.BF) {
			Global.debug('当前记录卡顿总次数 : ', curr);
		}
	}
	
	/**
	 * 数据存储
	 * @key   
	 * @value
	 * @isBip   是否是bip报文存储
	 */
	setValue(key, value, isBip=true) {
		try{
			let storage = this.storage?this.storage:this.cookie, ssObj = {}, sid = isBip?this.vvid:storageName;
			if (this.isEmptyObj(storage.getItem(sid))) {
				ssObj = JSON.parse(storage.getItem(sid));
			}
			ssObj[key] = value;
			storage.setItem(sid, JSON.stringify(ssObj));
		}catch(e){}     									 
	}
	
	isEmptyObj(obj) {
		for (let i in obj) {
			return true;
		}
		return false;
	}
	
	/**
	 * 数据获取
	 * @key
	 */
	getValue(key, sid) {
		try{
			let storage = this.storage?this.storage:this.cookie, ssObj = null;
			if (!sid) sid = storageName;
			try{
				ssObj = JSON.parse(storage.getItem(sid));
				if (!this.isNullOrUndefined(ssObj[key])) {
					return encodeURIComponent(ssObj[key]);
				}
			}catch(e){}
		}catch(e){}
		return null;
	}
	
	isNullOrUndefined(data) { 
		return data === undefined || data === null;
	}
}