/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import $ from 'jquery';
import puremvc from "puremvc";
import Global from "manager/Global";
import { H5Common } from "common/H5Common";
import H5Notification from "common/H5Notification";
import { H5CommonUtils } from "common/H5CommonUtils";
import { CommonUI } from "view/component/CommonUI";
import BIPCommon from "bip/BIPCommon";

export class H5PlayCommand extends puremvc.SimpleCommand {

	static white_domains = ['pptv.com', 'pplive.cn', 'synacast.com', 'suning.com', 'weibo.com'];//超级白名单
	
	getCDN(ip) {
		let _ip = ip;
		if (H5CommonUtils.getQueryString('isBusinessCDN')==1 && /\b(pptv.com)\b/ig.test(ip)) {
			_ip = ['114.80.186.156', '58.220.11.172', '58.220.11.176'][Math.random()*3 >> 0]
		}
		return _ip;
	}

	getDtData(nodes) {
		let item = { };
		for (let i in nodes) {
			if (nodes[i].tagName === 'sh') item[nodes[i].tagName] = this.getCDN(nodes[i].childNodes[0]);
			if (nodes[i].tagName === 'st') item[nodes[i].tagName] = Date.parse(nodes[i].childNodes[0]);
			if (nodes[i].tagName === 'bwt') item[nodes[i].tagName] = Number(nodes[i].childNodes[0]);
			if (nodes[i].tagName === 'key') item[nodes[i].tagName] = nodes[i].childNodes[0];
			if (nodes[i].tagName === 'bh') item[nodes[i].tagName] = this.getCDN(nodes[i].childNodes[0]);
		}
		return item;
	}

	getDragData(nodes) {
		let list = [];
		try {
			nodes.forEach((item, index) => {
				if (item['tagName'] === 'sgm') {
					list[index] = {};
					list[index]['offset'] = item['os'];
					list[index]['duration'] = item['dur'];
					list[index]['rid'] = item['rid'];
					list[index]['no'] = item['no'];
					list[index]['filesize'] = item['fs'];
					list[index]['headlength'] = item['hl'];
				}
			});
		} catch (err) {}
		return list;
	}

	getStream(nodes, dt, drag) {
		let item = [];
		for (let i = 0,len = nodes.length; i < len; i++) {
			//ft=22  表示杜比【eac3编码】播放码流
			if ((nodes[i]['ft'] < this.limit || nodes[i]['ft'] == 22) && dt[nodes[i]['ft']]) {
				item[nodes[i]['ft']] = {
										'rid'    : nodes[i]['rid'],
										'ft'     : nodes[i]['ft'],
										'width'  : nodes[i]['width'],
										'height' : nodes[i]['height'],
										'bitrate': nodes[i]['bitrate'],
										'vip'    : nodes[i]['vip'],
										'dt'     : this.getDtData(dt[nodes[i]['ft']]),
										'drag'   : this.getDragData(drag[nodes[i]['ft']]),
									};
			}
		}
		return item;
	}
	
	checkDomain() {
    	//检查是否有referrer或者在超级白名单；否则线上获取
		let isrequest = true;
		if (window.parent && Global.getInstance().pageRefer) {
			for (let t in H5PlayCommand.white_domains) {
				if (Global.getInstance().pageRefer.indexOf(H5PlayCommand.white_domains[t]) != -1) {
					Global.debug('domain在超级白名单上');
					isrequest = false;
					break;
				}
			}
		}
		if (isrequest) {
			let self = this,
			refDomain = '//player.aplus.pptv.com/bwlist/ref_domain';
			Global.debug('domain不在超级白名单上，线上获取白名单>' + refDomain );
			$.ajax({
				dataType 	  : 'jsonp',
				type          : 'GET',
				cache         : true,
				jsonpCallback : 'getRefDomain',
				jsonp         : 'cb',
				timeout       : 15 * 1000,
				url           : refDomain,
				success       : function(data) {
								Global.debug('获取在线黑白名单成功>>',data)
								let canPlay = true;
								for (let t in data['black_domains']) {
									if (Global.getInstance().pageRefer.indexOf(data['black_domains'][t]) != -1) //在黑名单全部不播放，不在黑名单判断白名单
									{
										Global.debug('domain在黑名单中')
										canPlay = false;
										break;
									}
								}	
								if(canPlay) {
									for (let t in data['white_domains']) {
										if (Global.getInstance().pageRefer.indexOf(data['white_domains'][t]) != -1) {
											Global.debug('domain在白名单中')
											break;
										}
									}
									for (let i = 0 ; i < data['special_channels'].length ; i++){
										let sp = data['special_channels'][i];
										if (sp['channel_id'] == Global.getInstance().cid) {
											for (let t in sp['allow_domain']) {
												if (Global.getInstance().pageRefer.indexOf(sp['allow_domain'][t]) != -1) {
													Global.debug('domain在special_channels中的allow_domain')
													canPlay = true;
												} else {
													Global.debug('domain不在special_channels中的allow_domain')
													canPlay = false;
													break;
												}													
											}
										}
									}	
									
								}
								if (!canPlay) {
									let $title = self.playData.info.title.slice(0, 24);
									self.sendNotification(H5Notification.PLAY_BLACK_DOMAINS, {
										'errorcode' : H5Common.callCode.play[5],
										'title': $title,
										'link' : self.playData.info.lk
									});
								} else {
									Global.getInstance().ftpe = +new Date();
									self.sendNotification(H5Notification.PLAY_SUCCESS, self.playData);
								}
								
							},
								//XMLHttpRequest 对象，错误信息，（可能）捕获的错误对象
				error		  : function(xhr, errorType, error) {
								Global.debug('黑白名单返回数据  error==>> ', error);
								Global.getInstance().ftpe = +new Date();
								self.sendNotification(H5Notification.PLAY_SUCCESS, self.playData);
							}
			});
		} else {
			Global.getInstance().ftpe = +new Date();
			this.sendNotification(H5Notification.PLAY_SUCCESS, this.playData);
		}
    }

	/**
	 * @override
	 */
	execute(note) {
		this.limit = 4;//点播【流畅、高清、超清、蓝光】  直播【流畅、高清、超清】
		H5Common.isPay = 1;
		let title, duration, begin, end, vt, streamNode, langNode, pointNode, stream, cft, delay, interval, info, mark, pno, olt, ts, lk,
			codeObj = {}, dtNode = [], dragNode = [];
		let data = note.getBody();
		//
		for (let i in data.childNodes) {
			let node = data.childNodes[i];
			if (node.tagName === 'error' && node.code != 0) {
				if (/^[1-8]\d{2}$/g.test(node.code)) {
					if (('' + node.code).split('')[0] == '3') {
						Global.debug('play返回付费节目，用户未付费进入  ==>> ', node);
						H5Common.isPay = 0;
					} else {
						codeObj = {
							'errorcode'  : node.code,
							'msg': node.message
						}
						this.sendNotification(H5Notification.PLAY_FAILED, codeObj);
						this.sendNotification(H5Notification.VIDEO_BIP, {
																			'dt' : 'er',
																			'data' : codeObj
																		});
						return;
					}
				} else {
					if (node.code == 3 && node.pay != 1) {
						Global.debug('play返回付费节目,用户未付费进入试看阶段 ==>> ', node);
						H5Common.isPay = 0;
					} else {
						if (node.code == 1) {
							codeObj = {
										'errorcode' : H5Common.callCode.play[8],
										'msg' 		: '地区屏蔽'
									}
						} else if (node.code == 2) {
							codeObj = {
										'errorcode' : H5Common.callCode.play[6],
										'msg' 		: '无该节目信息'
									}
						} else if (node.code == 5) {
							codeObj = {
										'errorcode' : H5Common.callCode.play[9],
										'msg' 		: '用户token验证失败'
									}
						}
						this.sendNotification(H5Notification.PLAY_FAILED, codeObj);
						this.sendNotification(H5Notification.VIDEO_BIP, {
																			'dt' : 'er',
																			'data' : codeObj
																		});
						return;
					}
				}
			} else if (node.tagName === 'channel') {
				vt = node.vt;
				title = node.sectionTitle || node.nm;
				duration = node.dur;
				pno = node.pno;//节目备案号
				olt = node.olt;
				ts = node.ts;
				lk = node.lk;
				H5Common.snapshotVersion = node.mv;
				H5Common.sectionId = node.sectionId;
				H5Common.sectionTitle = node.sectionTitle;
				H5Common.sectionCp = node.sectionCp;
				H5Common.outLinkPay = node.outLinkPay;
				H5Common.outLink = node.outLink || null;
				Global.getInstance().ifid = node.bt; //百科id
				Global.getInstance().cataid1 = node.tbcid; //基础一级分类id
				Global.getInstance().cataid2 = node.bcid; //基础二级分类id
				Global.getInstance().pt = node.pt; //是否收费 1: 收费  0: 免费
				Global.getInstance().rcl = node.rcl;//rcl == 5 是体育
				Global.getInstance().rid = node.rid;
				Global.getInstance().adConfig.chid = node.id;
				Global.getInstance().adConfig.clid = node.cl;
				if (node.fd > 0) Global.getInstance().fd = node.fd; //试看时长 秒级
				for (let j in node.childNodes) {
					let file = node.childNodes[j];
					if(file.tagName === 'live') {
						begin = file.start;
						end = file.end;
					}
					if (file.tagName === 'file' || file.tagName === 'stream') {
						// file for vod, stream for live; cur for vod, cft for live
						if (file.tagName == 'file') {
							cft = file.cur;
						}
						if (file.tagName == 'stream') {
							delay = parseInt(file.delay);
							interval = parseInt(file.interval);
							cft = file.cft;
						}
						streamNode = file.childNodes;
					}
					if (file.tagName == 'point') {
						if (file.childNodes.length > 0) {
							pointNode = [];
							file.childNodes.filter((item)=>{
								return item['type'] == 1 || item['type'] == 2 || item['type'] == 5;
							}).forEach((item)=>{
								let pitem = {
									'time' : item['time'],
									'type' : item['type']
								}
								if (item['type'] == 1) {
									pitem['title'] = '片头';
								}else if (item['type'] == 2) {
									pitem['title'] = '片尾';
								} else pitem['title'] = item['title'];
								pointNode.push(pitem);
							});
						}
					}
					/* if (file.tagName === 'barrage') {
						Global.getInstance().barrage = true;
						Global.getInstance().barrageDisplay = file.default_display;
					} */
				}
				 this.sendNotification(H5Notification.VIDEO_STORAGE, {'key' : BIPCommon.CVID,'value' : Global.getInstance().rid});
			} else if (node.tagName === 'dt') {
				dtNode[node.ft] = node.childNodes;
			} else if (node.tagName === 'dragdata') {
				dragNode[node.ft] = node.childNodes;
			} else if (node.tagName === 'langList') {
				langNode = node.childNodes;
			} else if (node.tagName === 'logo') {
				mark = {
					'align': node.align,
					'width': node.width,
					'ax'   : node.ax,
					'ay'   : node.ay
				}
				try {
					for (let k in node.childNodes) {
						let k_item = node.childNodes[k];
						if (k_item.ext === 'png') {
							mark['url'] = k_item.childNodes[0];
							break;
						}
					}
				}catch(e){};
			} else if (node.tagName === 'itemList') {
				for (let m in node.childNodes) {
					let m_item = node.childNodes[m];
					if (m_item.id == '229' && m_item.intValue == 0) {
						Global.debug('当前 VR 视频播放 ...');
					}
					if (m_item.id == '121' && !Global.getInstance().isMobile) {//pc端禁止分享
						H5Common.shareDisable = 1;
					}
					if (m_item.id == '126' && Global.getInstance().isMobile) {//phone端禁止分享
						H5Common.shareDisable = 1;
					}
				}
			} else if (node.tagName === 'img') {
				H5Common.row = node.r;
				H5Common.column = node.c;
				H5Common.snapshotHeight = node.h;
				if (node.i) interval = node.i;
			} else if (node.tagName === 'lang') {
				try {
					for (let m in node.childNodes) {
						let m_item = node.childNodes[m];
						if (m_item.tagName === 'start') {
							H5Common.paystime = new Date(m_item.childNodes[0]).valueOf();
						}
						if (m_item.tagName === 'end') {
							H5Common.payetime = new Date(m_item.childNodes[0]).valueOf();
						}
					}
				}catch(e){};
			}
		}
		info = {
			    'fd'	  : (vt == 4 && Global.getInstance().pt == 0 && Global.getInstance().rcl == 5) ? 5 *60 : 0,//体育免费直播试看
				'vt'      : vt,
				'title'   : title,
				'duration': duration,
				'lk'	  : lk,
				'pno'     : (pno && pno.length > 0) ? pno : null,
				'lang'    : langNode,
				'point'   : pointNode
			}
		if (begin) info['begin'] = begin;
		if (end) info['end'] = end;
		//
		if (!H5Common.isPay && !H5Common.isPayPass) {
			if (Global.getInstance().isMobile) {
				if (vt != 3) {
					this.sendNotification(H5Notification.SKIN_TIPS);
					return;
				}
			} else {
				this.sendNotification(H5Notification.VIDEO_PAY, {
																	'vt' : vt
																});
				if (vt != 3) {// 非点播付费直接return
					return;
				}
			}
		}
		//
		if (olt - ts > 0) {
			Global.debug('play返回定时上线节目 开始倒计时...');
			this.sendNotification(H5Notification.VIDEO_COUNTDOWN, {
																	'time' : olt - ts
																});
			return;
		}
		//
		if (dtNode.length == 0) {
			codeObj = {
						'errorcode' : H5Common.callCode.play[4],
						'msg' 		: 'play返回无dt数据'
					}
			this.sendNotification(H5Notification.VIDEO_BIP, {
																'dt' : 'er',
																'data' : codeObj
															});
			Global.debug('play返回无dt数据...');
			this.sendNotification(H5Notification.PLAY_FAILED, codeObj);
			return;
		}
		stream = this.getStream(streamNode, dtNode, dragNode);
		Global.getInstance().localTime = Math.floor(new Date().valueOf() / 1000);
		Global.getInstance().ftpe = +new Date();
		let serverTime = Math.floor(stream[cft]['dt']['st'] / 1000 - delay);
		serverTime -= serverTime % interval;
		this.playData = {
							'stream'    : stream,
							'mark'      : mark,
							'info'      : info,
							'cft'       : cft,
							'delay'     : delay,
							'interval'  : interval,
							'serverTime': serverTime
						}
		this.checkDomain();
	}
}