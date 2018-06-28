/**
 * ...
 * @author minliang_1112@foxmail.com
 */
;puremvc.define(
				{
					name 		: 'cn.pplive.player.view.component.PlayerComponent',
					constructor : function() {
									player.CommonUI.videoHtml = player.CommonUI.videoHtml.replace(/\[WIDTH\]/g, puremvc.w)
																						.replace(/\[HEIGHT\]/g, puremvc.h)
																						.replace(/\[POSTER\]/g, puremvc.poster);
									$('.control').before(player.CommonUI.videoHtml);
									//$('.p-video-tip3').after(player.CommonUI.playerBtnHtml);
									this.video = puremvc.pbox.find('.p-video-player');
									this.player = this.video[0];
									this.player.removeAttribute("controls");
									if(puremvc.autoplay !== 0){
										this.player.setAttribute('autoplay', 'autoplay');
									}
									this.playUIPoster = puremvc.pbox.find('.p-video-poster');
									this.playUILoading = puremvc.pbox.find('.p-video-loading');
									this.playUIButton = puremvc.pbox.find('.p-video-button');
									//渠道策略 - 绕过播放限制（暂未处理）
									for (var i = 0, len = puremvc.whitelist.length; i < len; i++) {
										if(puremvc.ctx.o && puremvc.whitelist[i] && puremvc.whitelist[i] == puremvc.ctx.o) {
											//处理逻辑
										}
									}
									//
									this.stopInter = 0;
									this.bufferInter = 0;
									this.isRequestPlay = false;//是否作了play请求
									this.playData = null;
									this.firstPlay = true;//是否是首次播放
									puremvc.playstate = 'stopped';
									puremvc.posiTime = 0;
									puremvc.volume = 0;
									puremvc.video = this.video;
									puremvc.player = this.player;
									var self = this, basictime = NaN, codeObj = {};
									puremvc.isStart = true;
									puremvc.isEnd = false;
									puremvc.isReload = false;//视频请求是否重试备用ip
									this.abnormal = false;
									this.isSeek = false;
									this.isPlayClick = false;
									this.advInter = 0;
									this.onlineTime = 5 * 60;
									this.playUILoading.hide();
									this.pVideoBtnHide();
									this.playUIButton.on('click', function(e) {
																				self.autoPlay();
																			});
									this.video.on('loadstart', 	function(e) {
																				self.pVideoBtnHide();
																				if (!self.playAdv) {
																					debug('当前接收事件 ==>> ', e.type);
																					self.sendOnline({'J':1});
																					self.onlineInter = setInterval(function(){
																																if (puremvc.playstate == 'paused') {
																																	self.sendOnline({'J':3});
																																} else if(puremvc.playstate == 'playing') {
																																	self.sendOnline({'J':4});
																																}
																															}, self.onlineTime * 1000);
																				} else {
																					self.advStatusUpdate('videoStart');
																					self.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.ADS_EVENT, {'eventType':'showAdvDom'});
																				}
																			});
									this.video.on('loadedmetadata loadeddata durationchange', function(e) {
																				if (!self.playAdv) {
																					debug('当前接收事件 ==>> ', e.type);
																				} else {
																					if (e.type == 'durationchange') {
																						self.advStatusUpdate('videoDuration', Math.floor(self.player.duration));
																						debug('获取广告时长 ==>> ', self.player.duration);
																					}
																					return;
																				}
																				self.getDuration();
																				self.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_TITLE, {
																																						'display' : 'block'
																																					});
																				puremvc.pbox.on('touchstart', function(e) {
																								self.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.CONTROL_STATE, {
																																											'visible' : true
																																										});
																							 
																							});
																			});
									this.video.on('canplaythrough', function(e) {
																					self.playUIPoster.hide();
																					self.playUILoading.hide();
																					if (!self.playAdv) {
																						debug('当前接收事件 ==>> ', e.type);
																					} else {
																						self.clearAdvTimeout();
																						return;
																					}
																					puremvc.vde = +new Date();
																					puremvc.volume = self.player.volume;
																					self.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_BUFFER);
																					self.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_STATE, {
																																							'playstate' : puremvc.playstate
																																						});
																					self.isSeek = false;
																					if (puremvc.isStart) {
																						puremvc.isStart = false;
																						this.abnormal = false;
																						self.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.CONTROL_STATE, {
																																									'visible' : true
																																								});
																						self.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_BIP, {
																																								'dt' : 'sd'
																																							});
																						self.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_BIP, {
																																								'dt' : 'act',
																																								'data' : {
																																											'type' : 'pds'
																																										}
																																							});
																					} else {
																						if (self.bufferInter) clearTimeout(self.bufferInter);
																						self.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.STOP_RECORD, {
																																								'target' : player.BIPCommon.BS
																																							});
																						self.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.STOP_RECORD, {
																																								'target' : player.BIPCommon.OLBS
																																							});
																					}
																				});
									this.isStalled = false;
									this.video.on('seeking waiting stalled', function(e) {
																				if (!self.playAdv) {
																					debug('当前接收事件 ==>> ', e.type);
																				} else {
																					if (e.type == 'stalled') {
																						self.advTimeout();
																					}
																					return;
																				}
																				if (e.type == 'seeking' || e.type == 'waiting') { 
																					self.playUILoading.show();
																				}
																				if (self.bufferInter) clearTimeout(self.bufferInter);
																				if (e.type != 'seeking' && !puremvc.isStart && !self.isSeek) {
																					if (e.type == 'stalled') {
																						if (!self.isStalled) {
																							self.isStalled = true;
																						} else {
																							return;
																						}
																					} else {
																						self.isStalled = false;
																					}
																					self.bufferInter = setTimeout(function() {
																						self.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.START_RECORD, {
																																								'target' : player.BIPCommon.BS
																																							});
																						self.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.ADD_VALUE, {
																																								'target' : player.BIPCommon.BF
																																							});
																						//以下为5min中的卡顿相关（包括次数、时长）
																						self.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.ADD_VALUE, {
																																								'target' : player.BIPCommon.OLBF
																																							});
																						self.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.START_RECORD, {
																																								'target' : player.BIPCommon.OLBS
																																							});
																					}, 0.5 * 1000);
																				}
																			});//var tempEnd = false;
									this.video.on('timeupdate', player.H5CommonUtils.throttle(function(e) {
																					if (self.playAdv) {
																						self.advStatusUpdate('videoCurrentTime', Math.floor(self.player.currentTime));
																						return;
																					}
																					self.playUILoading.hide();
																					puremvc.posiTime = self.player.currentTime;
																					var timeObj = { };
																					if (puremvc.videoType != 10) {
																						timeObj['start'] = 0;
																						timeObj['end'] = puremvc.duration;
																						timeObj['posi'] = puremvc.posiTime;
																						if (puremvc.duration - puremvc.posiTime < 15) self.abnormal = true;
																					} else {
																						var timestamp = new Date().valueOf() - puremvc.playData['timestamp'];
																						timeObj['live'] = puremvc.playData['st'] + timestamp;
																					}
																					/*
																					var t = new Date().getTime() / 1000 >> 0;
																					if ((puremvc.cid == '300380' || puremvc.cid == '301819' || puremvc.cid == '301717') && t > 1490703900 && t < 1490704200 && tempEnd == false) {
																						tempEnd = true;
																						self.setVolume(0);
																						player.CommonUI.tempError(puremvc.pbox);
																						self.playErrors =  puremvc.pbox.find('#p-error');
																						self.feedbackBtns = self.playErrors.find('.feedbackbtn');
																						self.feedbackBtns.on('click', function(e) {
																							top.location.href = 'http://app.aplus.pptv.com/minisite/redirect/sports_sh_cmcc?from=yilang_sports_appdown';
																						})
																						setTimeout(function(){
																							self.setVolume(1);
																							self.playErrors.remove();
																						},5*60*1000);
																					}
																					*/
																					self.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_UPDATE, timeObj);
																					self.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.ADD_VALUE, {
																																							'target' : player.BIPCommon.VT
																																						});
																					if (self.bufferInter) clearTimeout(self.bufferInter);
																					if (self.isStalled) {
																						self.isStalled = false;
																						self.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.STOP_RECORD, {
																																								'target' : player.BIPCommon.BS
																																							});
																					}
																				}, 1000));
									this.video.on('ended', 			function(e) {
																					puremvc.isEnd = true;
																					if (!self.playAdv) {
																						debug('当前接收事件 ==>> ', e.type);
																					} else {
																						self.advStatusUpdate('videoEnd');
																						self.playAdv = false;
																						//15s等待时间如果广告没有给素材就把广告层删除
																						self.advTimeout();
																						return;
																					}
																					self.stopVideo();
																				});
									this.video.on('pause',			function(e) {
																					//android接收ended事件后仍能收到pause事件
																					if (!puremvc.isEnd) {
																						if(!self.playAdv) self.pVideoBtnShow();
																						puremvc.playstate = 'paused';
																						self.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_STATE, {
																																								'playstate' : puremvc.playstate
																																							});
																					}
																				});
									this.video.on('playing',		function(e) {
																					self.pVideoBtnHide();
																					self.playUILoading.hide();
																					puremvc.playstate = 'playing';
																					self.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_STATE, {
																																							'playstate' : puremvc.playstate
																																						});
																				});
									this.video.on('abort error', 	function(e) {
																					debug('video请求出错 >>>>>>' + self.playData.videoSrc);
																					//启用备用ip
																					if (self.playData.backip && !puremvc.isReload) {			
																						puremvc.isReload = true;																			
																						var rex = new RegExp(self.playData.ip, 'g');
																						self.playData.videoSrc = self.playData.videoSrc.replace(rex, self.playData.backip);
																						debug('启用备用ip请求video >>>>>' + self.playData.videoSrc)
																						self.replay();	
																						return;
																					}
																					
																					self.playUIPoster.hide();
																					self.playUILoading.hide();
																					if (self.onlineInter) clearInterval(self.onlineInter);
																					if (!self.playAdv) {
																						debug('当前接收事件 ==>> ', e.type, ' 当前总时长 ==>> ', puremvc.duration, ' 当前播放点 ==>> ', puremvc.posiTime);
																					} else {
																						self.advStatusUpdate('videoFail');
																						self.playAdv = false;
																						//15s等待时间如果广告没有给素材就把广告层删除
																						self.advTimeout();
																						return;
																					}
																					//兼容android手机环境下结束时仍然抛出abort事件，导致弹出错误信息和er报文发送
																					if (self.abnormal) {
																						self.endDone();
																						debug('视频播放接近结束收到异常：[' + e.type + ']事件，阻止错误信息显示和er报文发送...');
																						return;
																					}
																					self.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_BUFFER);
																					self.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_STATE, {
																																							'playstate' : puremvc.playstate
																																						});
																					codeObj = {
																								'errorcode' : player.H5CommonUtils.callCode.video[1],
																								'msg' 		: e.type,
																								'videosrc'	: ((self.player && self.player.src) ? self.player.src  : '')
																							}
																					self.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_FAILED, codeObj);
																					self.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_BIP, {
																																							'dt' : 'er',
																																							'data' : codeObj
																																						});
																					self.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_BIP, {
																																							'dt' : 'act',
																																							'data' : {
																																										'type' : 'pderr'
																																									}
																																					});
																				});
									this.video.on('doubleTap',      function(e) {
																					self.toggleVideo();
																				});
								}
				},
				{
					//视频自动播放
					autoPlay : function() {
								this.isPlayClick = true;
								if (this.playAdv) {
									puremvc.pbox.find('.p-video-vastad').css('z-index','99999');
									this.playAdvVideo();
								} else this.playVideo();   
					},
					//视频播放时长
					getDuration : function() {
						puremvc.realDuration = this.player.duration;
						if (puremvc.videoType == 1) {//点播
							puremvc.duration = Math.min(puremvc.realDuration, puremvc.totalDuration);
						} else if (puremvc.videoType == 20) {//伪点播
							puremvc.duration = puremvc.realDuration;
						} else puremvc.duration = 0;
						this.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_STORAGE, {
																									'key' : player.BIPCommon.DU, 
																									'value' : puremvc.duration * 1000
																								});
					},
					//设置视频音量
					setVolume : function(vol) {
						try {
							if (vol >= 0 && vol <= 1) {
								this.player.volume = vol;
							}
						}catch(e) { };
					},
					execute : function() {
						var noAdFlag = false;
						player.H5CommonUtils.noAdsList = window.adConfig || player.H5CommonUtils.noAdsList;
						for(var i = 0, l = player.H5CommonUtils.noAdsList.length; i < l; i++) {
							if(puremvc.ctx.o == player.H5CommonUtils.noAdsList[i]) {
								noAdFlag = true;
							}
						}
						puremvc.userInfo = player.H5CommonUtils.userInfo(player.H5CommonUtils.cookie());
						if (noAdFlag || (puremvc.userInfo && puremvc.userInfo.uid && puremvc.userInfo.isvip) || puremvc.isVipMovie) {
							debug('执行无广告 | VIP用户播放逻辑 ...');
							this.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.ADS_STATUS, {
																									'status':10
																								});
						} else {
							debug('执行有广告 | 非用户播放逻辑 ... ');
							puremvc.adConfig.vlen = puremvc.ctx.duration;
							this.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.ADS_STATUS);
						}
						this.video.show();
						this.playVideo();
					},
					//启动 或 重新播放
					replay : function(data) {
						this.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_BIP, {
																								'dt' : 'bfr'
																							});
						if (this.stopInter) clearTimeout(this.stopInter);
						if (data) this.playData = data;
						puremvc.isEnd = false;
						this.video.show();
						try{
							[{
							'key' : player.BIPCommon.S,
							'value' : puremvc.videoType
							},{
								'key' : player.BIPCommon.NOW,
								'value' : puremvc.st + (new Date().valueOf() - puremvc.originTime)
							},{
								'key' : player.BIPCommon.BWT,
								'value' : puremvc.stream[puremvc.ft]['dt']['bwt']
							},{
								'key' : player.BIPCommon.CFT,
								'value' : puremvc.ft
							},{
								'key' : player.BIPCommon.MN,
								'value' : (puremvc.title || '')
							},{
								'key' : player.BIPCommon.VH,
								'value' : (puremvc.ip || '')
							},{
								'key' : player.BIPCommon.CID,
								'value' : puremvc.adConfig.chid
							},{
								'key' : player.BIPCommon.CLD,
								'value' : puremvc.adConfig.clid
							},{
								'key' : player.BIPCommon.CTX,
								'value' : puremvc.adConfig.ctx
							}].forEach(function(item){
														this.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_STORAGE, item);
													}.bind(this));
						}catch(e){};
						debug('开始 video 请求  >>>>>> ', this.playData.videoSrc);
						this.player.src = this.playData.videoSrc;
						this.player.load();
						this.player.play();
					},
					//拖动播放
					seekVideo : function(time) {
						this.isSeek = true;
						this.player.currentTime = puremvc.posiTime;
						if (time) {
							this.player.currentTime = time;
						}
						this.playVideo();
					},
					//播放视频
					playVideo : function() {
						this.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.SKIN_TIPS, {'bool' : false});
						if (puremvc.playstate == 'stopped') {
							if (!this.isRequestPlay) {
								try{
									[{
										'key' : player.BIPCommon.GUID,
										'value' : puremvc.userInfo.guid
									},{
										'key' : player.BIPCommon.UID,
										'value' : puremvc.userInfo.uid
									},{
										'key' : player.BIPCommon.CID,
										'value' : puremvc.cid
									}].forEach(function(item){
													this.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_STORAGE, item);
												}.bind(this));
								}catch(e){};
								this.isRequestPlay = true;
								if (this.stopInter) clearTimeout(this.stopInter);
								this.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.WEB_PLAY);
							} else {
								debug('开始视频正片播放  >>>>>');
								puremvc.vds = +new Date();
								this.replay(puremvc.playData);
								try{
									player.CommonUI.showMark(this.video, puremvc.playData.mark);
								}catch(e){};
								try{
									player.CommonUI.showPno(this.video, puremvc.playData.pno);
								}catch(e){};
								puremvc.playstate = 'playing';
							}
						} else {
							debug('视频暂停后播放  >>>>>');
							this.player.play();
							puremvc.playstate = 'playing';
							this.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_BIP, {
																									'dt' : 'act',
																									'data' : {
																												'type' : 'pd'
																											}
																								});
						}
					},
					//停止视频
					stopVideo : function() {
						puremvc.posiTime = 0;
						puremvc.isStart = true;
						puremvc.playstate = 'stopped';
						this.sendOnline({'J':5});
						if (this.onlineInter) clearInterval(this.onlineInter);
						this.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_STATE, {
																								'playstate' : puremvc.playstate
																							});
						this.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.CONTROL_STATE, {
																									'visible' : false
																								});
						this.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_TITLE, {
																									'display' : 'none'
																								});
						this.stopInter = setTimeout(function() {
														this.player.pause();
														this.video.hide();
														this.pVideoBtnShow();
														this.playUIPoster.show();
													}.bind(this), 1 * 1000);
						//puremvc.duration >= puremvc.totalDuration [complete=1暂无用]，表示该节目不是被截取节目，属于完整视频，播放结束不提示任何弹窗
						//puremvc.duration < puremvc.totalDuration [complete=0暂无用]，表示该节目是被截取节目，播放完成时提示“预览结束，请下载PPTV客户端观看完整版”
						this.endDone();
						this.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_BIP, {
																								'dt' : 'act',
																								'data' : {
																											'type' : 'pde'
																										}
																							});
					},
					sendOnline : function(obj) {
						this.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.STOP_RECORD, {
																								'target' : player.BIPCommon.OLBS
																							});
						this.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_ONLINE, obj);
					},
					endDone : function() {
						if (puremvc.videoType == 1) {
							if (puremvc.duration < puremvc.totalDuration) {
								debug('视频预览播放结束，给出后续操作弹窗...');
								//判断是否在APP中观看视频
		                      	var $plt = /\?\s*(plt)=(\w+)/i.exec(top.location.href);
								if(!$plt || ($plt.length > 0 && $plt[2] != 'app')){
									this.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.SKIN_TIPS, {'bool' : true});
								}
								this.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.SKIN_RECOM);
							} else {
								try{
									debug('视频完整播放结束，准备进入下一集,抛出 nextvideo 事件...');
									window.parent.postMessage(JSON.stringify({
																				'type' : 'nextvideo',
																				'data' : {}
																			}), '*');
								}catch(e){};
							}
						}
					},
					toggleVideo : function() {
						if (this.player.paused) {
							this.playVideo();
						} else {
							this.player.pause();
							puremvc.playstate = 'paused';
							this.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_BIP, {
																									'dt' : 'act',
																									'data' : {
																												'type' : 'pdp'
																											}
																								});
						}
						this.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_STATE, {
																								'playstate' : puremvc.playstate
																							});
					},
					//全屏操作
					screenVideo : function() {
						if ($.isFunction(this.player.webkitEnterFullscreen)) {
							this.player.webkitEnterFullscreen();
						} else if ($.isFunction(this.player.mozRequestFullScreen)) {
							this.player.mozRequestFullScreen();
						} else {
							alert('Your browsers doesn\'t support fullscreen');
						}
					},
					//设置广告素材路径
					setAdvSrc : function(src) {
						if(src && src.length > 0) {
							debug('设置广告素材 setAdvSrc ===>>> ', src);
							this.playAdv = true;
							if (this.advSrc == undefined) {
								this.advSrc = src;
							} else {
								this.advSrc = src;
								this.playAdvVideo();
							}
						}
					},
					//播放广告
					playAdvVideo : function() {
						if (this.advSrc) {
							debug('播放广告素材 playAdvVideo ...');
							this.clearAdvTimeout();
							this.player.src = this.advSrc;
							this.player.load();
							this.player.play();
						}
					},
					advStatusUpdate : function(type, value) {
						this.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.ADS_EVENT, {
																								'eventType' : 'sendToAdvDom',
																								'type' : type,
																								'values' : value!==undefined?[value]:''
																							});
					},
					clearAdvTimeout : function() {
						if (this.advInter) clearTimeout(this.advInter);
					},
					//10s等待时间如果广告没有给素材就把广告层删除
					advTimeout : function() {
						this.clearAdvTimeout();
						this.advInter = setTimeout(function() {
																if (!this.playAdv && puremvc.playstate != 'playing') {
																	this.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.ADS_STATUS, {
																																			'status' : 100
																																		});
																}
															}.bind(this), 10*1000);
					},
					pVideoBtnHide : function(){
						this.playUIButton.hide();
					},
					pVideoBtnShow : function(){
						this.playUIButton.show();
					}
				},
				{
					NAME : 'videocomponent'
				});