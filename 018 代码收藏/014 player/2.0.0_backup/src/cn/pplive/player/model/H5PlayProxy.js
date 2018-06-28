/**
 * ...
 * @author minliang_1112@foxmail.com
 */
;puremvc.define({
					name  : 'cn.pplive.player.model.H5PlayProxy',
					parent: puremvc.Proxy
				},
				{
					onRegister : function() {
						this.dindex = 0;
					},
					getVodDt : function(nodes) {
						var item = { };
						for (var i in nodes) {
							if (nodes[i].tagName === 'sh') item[nodes[i].tagName] = nodes[i].childNodes[0];
							if (nodes[i].tagName === 'st') item[nodes[i].tagName] = Date.parse(nodes[i].childNodes[0]);
							if (nodes[i].tagName === 'bwt') item[nodes[i].tagName] = Number(nodes[i].childNodes[0]);
							if (nodes[i].tagName === 'key') item[nodes[i].tagName] = nodes[i].childNodes[0];
							if (nodes[i].tagName === 'bh') item[nodes[i].tagName] = nodes[i].childNodes[0];
						}
						return item;
					},
					limit : 4,//点播【流畅、高清、超清、蓝光】  直播【流畅、高清、超清】
					getVodStream : function(nodes, dt) {
						var item = [];
						for (var i = 0,len = nodes.length; i < len; i++) {
							//ft=22  表示杜比【eac3编码】播放码流
							if ((Number(nodes[i]['ft']) < this.limit || Number(nodes[i]['ft']) == 22) && dt[Number(nodes[i]['ft'])]) {
								item[Number(nodes[i]['ft'])] = {
																'rid' : nodes[i]['rid'],
																'ft' : Number(nodes[i]['ft']),
																'dt' : this.getVodDt(dt[Number(nodes[i]['ft'])])
															};
							}
						}
						return item;
					},
					getLiveStream : function(nodes, dt) {
						var item = [];
						for (var i = 0,len = nodes.length; i < len; i++) {
							if (Number(nodes[i]['ft']) < this.limit - 1) {
								item[Number(nodes[i]['ft'])] = {
																'rid' : nodes[i]['rid'],
																'ft' : Number(nodes[i]['ft']),
																'dt' : this.getVodDt(dt)
															};
							}
						}
						return item;
					},
					loadData : function() {
						var playUrl, title, duration, begin, end, vt, streamNode, dtNode = [], codeObj = {}, stream, cft, info, mark;
						var self = this, queryString = '';
						puremvc.ftps = +new Date();
						puremvc.ctx.rcc_id = puremvc.ctx.o;
						queryString = '&' + $.param(puremvc.ctx);
						/*** 测试开始 ***/
						/*var aa = ['158476336', '158476538', '158354674', '158468085', '158473230', '158354670', '158353926', '158353657', '158349771', '158304730'];
						var indexs = 0;
						var storage = window.localStorage;
						if (storage) {
							if (storage.getItem('cid') != undefined) {
								var bb = storage.getItem('cid');
								if (aa.indexOf(bb) == aa.length) {
									indexs = 0;
								} else {
									indexs = aa.indexOf(bb) + 1;
								}
							}
							storage.removeItem('cid');
							storage.setItem('cid', aa[indexs]);
						}
						puremvc.cid = aa[indexs];*/
						/*** 测试结束 ***/
						//puremvc.cid = '24899259';//某付费节目
						//测试使用该域名http://webapi.h5.ppqa.com/
						if(player.H5CommonUtils.getQueryString("h5cryopt")){//测试防盗链加入该参数
							playUrl = '//webapi.h5.ppqa.com/webplay3-0-' + puremvc.cid + '.xml?version=4&type=' + puremvc.loadType + queryString + '&appplt=wap&appid=pptv.wap&appver=' + player.H5CommonUtils.version();
						}else
							playUrl = player.H5CommonUtils.playDomain[this.dindex] + '/webplay3-0-' + puremvc.cid + '.xml?version=4&type=' + puremvc.loadType + queryString + '&appplt=wap&appid=pptv.wap&appver=' + player.H5CommonUtils.version();
						if(puremvc.userInfo && puremvc.userInfo.uid){
						    playUrl += '&token=' + encodeURIComponent(puremvc.userInfo.token) + '&username=' + encodeURIComponent(puremvc.userInfo.uid);
						}
						playUrl += '&vvid=' + puremvc.bip.vvid;
						//判断是否在微信中观看视频
						var $from_ua;
						if (/MicroMessenger/i.test(navigator.userAgent)) {
							$from_ua = 'weixin';
						}
                        if($from_ua) playUrl += '&from_ua=' + $from_ua;
						//签名
						var key = pptvH5Crypto.SC_KEY;
						var uu = puremvc.ctx.kk || "";//scver=1 ,与密钥相对应
						var signObj = pptvH5Crypto.getSignature(uu,key);
						debug('签名地址 uu  >>>>> ', uu);
						debug('签名地址 随机数  >>>>> ', signObj.random);
						debug('签名地址 签名  >>>>> ', signObj.sign);
						if(signObj && signObj.sign && signObj.random){
							playUrl = playUrl+"&scver=1&scRandom="+signObj.random+"&scSignature="+signObj.sign;
						}
						if(puremvc.purl) playUrl = puremvc.purl;
						debug('开始 webplay 请求  >>>>> ', playUrl);
						$.ajax({
										dataType 	  : 'jsonp',
										type          : 'GET',
										cache         : true,
										jsonpCallback : 'getPlayEncode',
										jsonp         : 'cb',
										timeout       : 15 * 1000,
										url           : playUrl,
										success       : function(data) {
															debug('play返回数据 ==>> ', data);
															if (puremvc.purl) {//PP云的play接口请求，为二次元预留
																try {
																	self.sendNotification(player.H5Notification.PLAY_SUCCESS, {
																																'vt'         :  data['info']['videoType'],
																																'duration'   :  data['info']['duration'],
																																'title'      :  data['info']['title'],
																																'videoSrc'   :  data['info']['mobile_url']
																															});
																} catch(e){
																	codeObj = {
																				'errorcode' : player.H5CommonUtils.callCode.play[4],
																				'msg' 		: 'play返回数据异常'
																			}
																	self.sendNotification(player.H5Notification.VIDEO_BIP, {
																															'dt' : 'er',
																															'data' : codeObj
																														});
																	debug('ajax的play请求返回数据异常：[' + e.type + ']');
																	self.sendNotification(player.H5Notification.PLAY_FAILED, codeObj);
																}
															} else {
																try{
																	for (var i in data.childNodes) {
																		var node = data.childNodes[i];
																		if (node.tagName === 'error' && node.code != 0) {
																			if ( /^[1-8]\d{2}$/g.test(node.code)) {
																				if (('' + node.code).split('')[0] == 3) {
																					debug('play返回付费节目，用户未付费进入  ==>> ', node);
																					if (puremvc.videoType != 1) {
																						self.sendNotification(player.H5Notification.SKIN_TIPS);
																						return;
																					}
																				} else {
																					codeObj = {
																					 	        'errorcode' : node.code,
																					 	        'msg'       : node.message
																					 		}
																					self.sendNotification(player.H5Notification.VIDEO_BIP, {
																																			'dt' : 'er',
																																			'data' : codeObj
																																		});
																					self.sendNotification(player.H5Notification.PLAY_FAILED, codeObj);
																					return;
																				}
																			} else {
																				if (node.code == 3 && node.pay != 1) {
																					debug('play返回付费节目,用户未付费进入试看阶段 ==>> ', node);
																				} else {
																					if (node.code == 1) {
																						codeObj = {
																									'errorcode' : player.H5CommonUtils.callCode.play[8],
																									'msg' 		: '地区屏蔽'
																								}
																					} else if (node.code == 2) {
																						codeObj = {
																									'errorcode' : player.H5CommonUtils.callCode.play[6],
																									'msg' 		: '无该节目信息'
																								}
																					} else if (node.code == 5) {
																						codeObj = {
																									'errorcode' : player.H5CommonUtils.callCode.play[9],
																									'msg' 		: '用户token验证失败'
																								}
																					}
																					self.sendNotification(player.H5Notification.VIDEO_BIP, {
																																			'dt' : 'er',
																																			'data' : codeObj
																																		});
																					self.sendNotification(player.H5Notification.PLAY_FAILED, codeObj);
																					return;
																				}
																			}
																		} else if (node.tagName === 'channel') {
																			vt = node.vt;
																			title = node.sectionTitle || node.nm;
																			duration = node.dur;
																			pno = node.pno;//节目备案号
																			puremvc.adConfig.chid = node.id;
																			puremvc.adConfig.clid = node.cl;
																			for (var j in node.childNodes) {
																				var file = node.childNodes[j];
																				if(file.tagName === 'live') {
																					begin = file.start;
																					end = file.end;
																				}
																				if (file.tagName === 'file' || file.tagName === 'stream') {
																					// file for vod, stream for live; cur for vod, cft for live
																					cft = file.tagName === 'file' ? file.cur : file.cft;
																					streamNode = file.childNodes;
																				}
																				/*if (file.tagName === 'barrage') {
																					puremvc.barrageDisplay = file.default_display;
																				}*/
																			}
																		} else if (node.tagName === 'dt') {
																			if (vt == 3) {
																				dtNode[node.ft] = node.childNodes;
																			} else {
																				dtNode = node.childNodes;
																			}
																		} else if (node.tagName === 'logo') {
																			mark = {
																					'align': node.align,
																					'width': Number(node.width),
																					'ax'   : Number(node.ax),
																					'ay'   : Number(node.ay)
																				}
																			try {
																				for (var k in node.childNodes) {
																					var k_item = node.childNodes[k];
																					if (k_item.ext === 'png') {
																						mark['url'] = k_item.childNodes[0];
																						break;
																					}
																				}
																			}catch(e){};
																		} else if (node.tagName === 'itemList') {
																			for (var m in node.childNodes) {
																				var m_item = node.childNodes[m];
																				if (m_item.id == '229') {
																					debug('当前 VR 视频播放 ...');
																				}
																			}
																		} 
																	}
																	info = {
																			'vt'      : vt,
																			'title'   : title,
																			'duration': duration,
																			'pno'     : (pno && pno.length > 0) ? pno : null
																		}
																	if (begin) info['begin'] = begin;
																	if (end) info['end'] = end;
																	//
																	if (dtNode.length == 0) {
																		codeObj = {
																					'errorcode' : player.H5CommonUtils.callCode.play[4],
																					'msg' 		: 'play返回无dt数据'
																				}
																		self.sendNotification(player.H5Notification.VIDEO_BIP, {
																																'dt' : 'er',
																																'data' : codeObj
																															});
																		debug('play返回无dt数据...');
																		self.sendNotification(player.H5Notification.PLAY_FAILED, codeObj);
																		return;
																	}
																	if (vt == 3) {
																		stream = self.getVodStream(streamNode, dtNode);
																	} else if (vt == 4 || vt == 5) {
																		stream = self.getLiveStream(streamNode, dtNode);
																	}
																	puremvc.ftpe = +new Date();
																	self.sendNotification(player.H5Notification.PLAY_SUCCESS, {
																																'stream' : stream,
																																'mark'   : mark,
																																'info'   : info,
																																'cft'    : cft
																															});
																}catch(e) {
																	codeObj = {
																				'errorcode' : player.H5CommonUtils.callCode.play[4],
																				'msg' 		: 'play返回数据异常'
																			}
																	self.sendNotification(player.H5Notification.VIDEO_BIP, {
																															'dt' : 'er',
																															'data' : codeObj
																														});
																	debug('ajax的play请求返回数据异常：[' + e.type + ']');
																	self.sendNotification(player.H5Notification.PLAY_FAILED, codeObj);
																}
															}
														},
														//XMLHttpRequest 对象，错误信息，（可能）捕获的错误对象
										error		  : function(xhr, errorType, error) {
															if (self.dindex < player.H5CommonUtils.playDomain.length - 1) {
																self.dindex++;
																self.loadData();
															} else {
																codeObj = {
																			'errorcode' : player.H5CommonUtils.callCode.play[1],
																			'msg' 	   : 'play请求错误'
																		}
																self.sendNotification(player.H5Notification.VIDEO_BIP, {
																															'dt' : 'er',
																															'data' : codeObj
																														});
																debug('ajax的play请求错误：[' , xhr, '|' + errorType + ']', error);
																self.sendNotification(player.H5Notification.PLAY_FAILED, codeObj);
															}
														}
										
						});
						/*if (puremvc.videoType == 'live') {
							puremvc.videoType = 10;
							//
							this.sendNotification(player.H5Notification.PLAY_SUCCESS, {
																					'title'    : puremvc.title || '',
																					'duration' : 0,
																					'videoSrc' : player.H5CommonUtils.playDomain[0] + '/web-m3u8-' + puremvc.cid + '.m3u8?type=' + puremvc.loadType + '&playback=0' + queryString,
																					'ip'       : 0
																				});
						}*/
					},
					reset		  : function(){
									this.dindex = 0;
					}
				},
				
				{
					NAME : 'h5play_proxy'
				});