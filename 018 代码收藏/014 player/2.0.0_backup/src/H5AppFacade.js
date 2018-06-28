/**
 * ...
 * @author minliang_1112@foxmail.com
 */
;puremvc.define({
					name  : 'player.H5AppFacade',
					parent: puremvc.Facade
				},
				{
					startup	: 	function(cfg, pid) {
									//获取承载容器
									puremvc.pbox = $('#' + pid);
									debug('启动播放器 v' + player.H5CommonUtils.version() + ' 所需承载容器 ===>>> ', pid,' 配置信息 : ', cfg);
									//合并对象至puremvc域下
									$.extend(true, puremvc, player.H5CommonUtils.defaultCFG, cfg);
									puremvc.cid = puremvc.id;
									delete puremvc.id;
									puremvc.videoType = puremvc.videoType == 'vod' ? 1 : 10; 
									puremvc.ctx = [
													puremvc.ctx,
													'pageUrl=' + encodeURIComponent(decodeURIComponent(puremvc.pageUrl) || window.top.location.href),
													'referrer=' + encodeURIComponent(decodeURIComponent(puremvc.pageRefer) || document.referrer)
												].join('&');
									puremvc.adConfig.ctx = puremvc.ctx;
									puremvc.adConfig.sid = puremvc.cid;
									//序列化为ctx对象
									puremvc.ctx = player.H5CommonUtils.queryToObject(puremvc.ctx) || { };
									if (!puremvc.ctx.o) puremvc.ctx.o = -1;
									puremvc.isVipMovie = puremvc.ctx.isVipMovie ? Boolean(parseInt(puremvc.ctx.isVipMovie)) : false;
									puremvc.purl = puremvc.ctx.purl;//'http://v.pptvyun.com/player/swf_api/?id=0a2dnq6YoqGhoqqL4K2dnaqa7KGgmquYqaM';
									puremvc.isMpptv = player.H5CommonUtils.mobileRegExp.test(navigator.userAgent);
									puremvc.islumia = navigator.userAgent.match(/Windows Phone/i);//lumia不支持ts
									puremvc.loadType = puremvc.isMpptv ? ((puremvc.islumia || player.H5CommonUtils.getQueryString('debug') == 'ikan') ? 'mpptv.wp' : 'mpptv') : player.H5CommonUtils.platform();
									if (puremvc.isMpptv) {
										puremvc.adConfig.plat = 'mbs';
									}
									//封面图支持外部ctx中的poster设置
									puremvc.poster = puremvc.ctx.poster != undefined && puremvc.ctx.poster.length > 0 ? puremvc.ctx.poster : puremvc.poster.replace(/\[CHANNELID\]/g, puremvc.cid);
									puremvc.autoplay = puremvc.ctx.autoplay != undefined ? puremvc.ctx.autoplay : 0;
									//视频真实时长
									puremvc.totalDuration = puremvc.ctx.duration != undefined ? puremvc.ctx.duration : 0;
									//播放限时白名单
									puremvc.whitelist = window.whitelist || [];
									if(!cfg.id || puremvc.pbox.length == 0) {
										alert('缺少频道ID 或 承载容器支持！！')
										return;
									}
									debug('puremvc.adConfig 对象挂载相关属性 ===>>> ', puremvc.adConfig);
									//Startup播放器
									if (!this.initialized) {
										this.initialized = true;
										debug('正式启动播放器 ...');
										this.registerCommand(player.H5Notification.STARTUP, cn.pplive.player.controller.H5StartupCommand);
										this.sendNotification(player.H5Notification.STARTUP);
									}
							},
					playVideo :	function(obj) {
								this.sendNotification(player.H5Notification.VIDEO_TOGGLE, obj);
							},
					pauseVideo: function() {
								this.sendNotification(player.H5Notification.VIDEO_TOGGLE);
							},
					stopVideo :	function() {
								this.sendNotification(player.H5Notification.VIDEO_STOP);
							},
					seekVideo :	function(time) {
								this.sendNotification(player.H5Notification.VIDEO_SEEK, {
																							'seektime' : time 
																						});
							},
					switchVideo:function(ft) {
								this.sendNotification(player.H5Notification.VIDEO_SWITCH, {
																							'ft' : ft 
																						});
							},
					setVolume : function(vol) {
								this.sendNotification(player.H5Notification.VIDEO_VOLUME, {
																							'volume' : vol 
																						});
							},
					getVolume : function() {
								return puremvc.volume;
							},
					playTime  : function() {
								return puremvc.posiTime;
							},
					duration  : function() {
								return puremvc.duration;
							},
					version   : function() {
								return player.H5CommonUtils.version();
							},
					playState : function() {
								return puremvc.playstate;
							}
				},
				{
					getInstance : function(multitonKey) {
									var instanceMap = puremvc.Facade.instanceMap;
									instance = instanceMap[multitonKey];
									if (instance) return instance;
									return instanceMap[multitonKey]= new player.H5AppFacade(multitonKey);
								},
					NAME : 'h5app_facade'
				});
