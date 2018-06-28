/**
 * ...
 * @author minliang_1112@foxmail.com
 */
;puremvc.define({
					name  : 'cn.pplive.player.view.H5PlayerMediator',
					parent: puremvc.Mediator
				},
				{
					listNotificationInterests : function() {
						return [
								player.H5Notification.PLAY_SUCCESS,
								player.H5Notification.PLAY_FAILED,
								player.H5Notification.VIDEO_SCREEN,
								player.H5Notification.SKIN_STATE,
								player.H5Notification.VIDEO_SEEK,
								player.H5Notification.VIDEO_REPLAY,
								player.H5Notification.VIDEO_VOLUME,
								player.H5Notification.VIDEO_TOGGLE,
								player.H5Notification.VIDEO_STOP,
								player.H5Notification.VIDEO_SWITCH,
								player.H5Notification.ADV_PLAY,
								player.H5Notification.ADV_OVER,
								player.H5Notification.ADV_CONNECT
							];
					},
					handleNotification : function(note) {
						switch (note.getName()) {
							case player.H5Notification.PLAY_SUCCESS:
								puremvc.originTime = new Date().valueOf();
								debug('播放数据信息  >>>>>  ', note.getBody());
								this.playObj = note.getBody();
								if (this.playObj['videoSrc'] != undefined) {
									this.playObj['timestamp'] = new Date().valueOf();
									puremvc.playData = this.playObj;
									if (puremvc.playData) {
										puremvc.videoType = puremvc.playData.vt;
										puremvc.totalDuration = puremvc.playData.duration;
										puremvc.title = puremvc.playData.title;
									}
								} else {
									puremvc.stream = this.playObj['stream'];
									puremvc.ft = this.playObj['cft'];
									puremvc.playData = this.videoData(this.playObj, puremvc.ft);
									if (puremvc.playData) {
										puremvc.totalDuration = puremvc.playData.duration;
										puremvc.title = puremvc.playData.title;
										puremvc.ip = puremvc.playData.ip;
										puremvc.st = puremvc.playData.st;
									}
								}
								if (this.viewComponent.firstPlay) {
								  	if(puremvc.advConnect){
								  		this.showPlayBtn();
								  	}else{
								  		this.connectAdvTimeOut = setTimeout(function(){
								  			if(this.connectAdvTimeOut>0){
								  				this.showPlayBtn();
								  			}
											this.connectAdvTimeOut = -1;
								  		}.bind(this), 1 * 1000)
								  	}
								} else {
									this.viewComponent.playVideo();
								}
								break;
							case player.H5Notification.PLAY_FAILED:
								debug('异常错误代码  >>>>>  ', note.getBody());
//								player.CommonUI.showError(puremvc.pbox, note.getBody()['errorcode']);
//								this.viewComponent.showError(note.getBody()['errorcode']);
								try {
									var skinMediator = this.facade.retrieveMediator(cn.pplive.player.view.H5SkinMediator.NAME);  
									skinMediator.view().showError(note.getBody()['errorcode']);
								} catch(e){};
								
								break;
							case player.H5Notification.VIDEO_SCREEN:
								this.viewComponent.screenVideo();
								break;
							case player.H5Notification.SKIN_STATE:
								this.viewComponent.toggleVideo();
								break;
							case player.H5Notification.VIDEO_SEEK:
								//外部调用seekVideo接口判断处理
								if (puremvc.videoType != 10 && note.getBody() && note.getBody()['seektime'] != undefined) {
									var $seektime = Number(note.getBody()['seektime']);
									if ($seektime > 0 && $seektime < puremvc.duration) {
										this.viewComponent.seekVideo($seektime);
										return;
									}
								}
								this.viewComponent.seekVideo();
								break;
							case player.H5Notification.VIDEO_REPLAY:
								this.sendNotification(player.H5Notification.VIDEO_SESSION_UPDATE);
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
												this.sendNotification(player.H5Notification.VIDEO_STORAGE, item);
											}.bind(this));
								}catch(e){};
								this.viewComponent.replay();
								break;
							case player.H5Notification.VIDEO_SWITCH:
								var tempFt = note.getBody()['ft'];
								if (tempFt == puremvc.ft) {
									debug('当前正播放此码流 ft  >>>>>  ', puremvc.ft, ' 无需切换...');
									return;
								}
								puremvc.playData = this.videoData(this.playObj, tempFt);
								if (puremvc.playData) {
									puremvc.ft = tempFt;
									puremvc.totalDuration = puremvc.playData.duration;
									puremvc.title = puremvc.playData.title;
									puremvc.ip = puremvc.playData.ip;
									puremvc.st = puremvc.playData.st;
									debug('正在切换码流 ft  >>>>>  ', puremvc.ft);
									this.viewComponent.replay(puremvc.playData);
								}
								break;
							case player.H5Notification.VIDEO_VOLUME:
								this.viewComponent.setVolume(note.getBody()['volume']);
								break;
							case player.H5Notification.VIDEO_TOGGLE:
								if (note.getBody()) {
									puremvc.cid = note.getBody()['cid'];
									puremvc.isReload = false;
									this.viewComponent.firstPlay = false;
									this.viewComponent.isRequestPlay = false;
									this.viewComponent.playVideo();
								} else {
									this.viewComponent.toggleVideo();
								}
								break;
							case player.H5Notification.VIDEO_STOP:
								this.viewComponent.stopVideo();
								break;
							case player.H5Notification.ADV_PLAY:
								this.viewComponent.setAdvSrc(note.getBody()['src']);
								break;
							case player.H5Notification.ADV_OVER:
								if (this.viewComponent.isPlayClick) {
									puremvc.playstate = 'stopped';
									this.viewComponent.playVideo();
									this.viewComponent.playAdv = false;
								}
								break;
							case player.H5Notification.ADV_CONNECT:
								puremvc.advConnect = true;
								if(this.connectAdvTimeOut && this.connectAdvTimeOut>0){
					  				this.showPlayBtn();
					  			}
								this.connectAdvTimeOut = -1;
								break;
								
						}
					},
					showPlayBtn : function(){
						this.viewComponent.pVideoBtnShow();
						debug('播放器初始化完毕 ...');
				  		window.parent.postMessage(JSON.stringify({
																	'type' : 'onready',
																	'data' : {}
																}), '*');
				  		if (puremvc.autoplay != 0 && DownloadManager.getInstance().isIos(navigator.userAgent)) {
				  			debug('可能满足自动播放的条件 ==>>【autoplay非0，iphone|ipad|ipod|ios】...');
				  			this.viewComponent.autoPlay();
				  		}
					},
					videoData : function(obj, ft) {
						if (!puremvc.stream[ft]) {
							debug('播放 ft ==>> ', ft, ' 不存在，无法 播放 || 切换 该码流...');
							return null;
						}
						var data = {
									'vt' : obj['info']['vt'],
									'title' : obj['info']['title'],
									'duration' : obj['info']['duration'],
									'timestamp' : new Date().valueOf(),
									'mark' : obj['mark'],
									'pno' : obj['info']['pno']
								};
						puremvc.stream[ft]['rid'] = puremvc.stream[ft]['rid'].replace('.mp4', '');
						//VT=0:直播,3:点播,4:二代直播,5:伪点播,21:剧集,22:合集,23:榜单
						debug('播放类型 vt ==>> ', obj['info']['vt']);
						var key = puremvc.stream[ft]['dt']['key'],cipher_text,plain_text,random_hex;
						try{
							if(key){
								var arr = key.split("|");
								if(arr.length>0){
									if(arr[0] == 0){
										random_hex = arr[1];
										cipher_text = arr[2];
										plain_text = pptvH5Crypto.secure_key_decrypt(pptvH5Crypto.SC_KEY,cipher_text,random_hex);
									}
								}
							}
						}catch(e){}
						debug('加密key ', key);
						debug('解密key ', plain_text);
						if(plain_text) key = plain_text;
						
						if (obj['info']['vt'] == 3) {
							puremvc.videoType = 1;
							data['videoSrc'] = '//' + puremvc.stream[ft]['dt']['sh'] + ((puremvc.islumia || player.H5CommonUtils.getQueryString('debug') == 'ikan') ? '/w/' : '/') + puremvc.stream[ft]['rid'] + '.m3u8?type=' + puremvc.loadType + '&k=' + key;
							data['videoSrc'] = (puremvc.islumia || player.H5CommonUtils.getQueryString('debug') == 'ikan') ? data['videoSrc'].replace('m3u8', 'mp4') : data['videoSrc'];
						} else if (obj['info']['vt'] == 4) {
							puremvc.videoType = 10;
							data['videoSrc'] = '//' + puremvc.stream[ft]['dt']['sh'] + '/live/5/60/' + puremvc.stream[ft]['rid'] + '.m3u8?type=' + puremvc.loadType + '&k=' + key + '&playback=0';//puremvc.stream[ft]['dt']['key']
						} else if (obj['info']['vt'] == 5) {
							puremvc.videoType = 20;
							data['videoSrc'] = '//' + puremvc.stream[ft]['dt']['sh'] + '/live/5/60/' + puremvc.stream[ft]['rid'] + '.m3u8?type=' + puremvc.loadType + '&k=' + key + '&begin=' + obj['info']['begin'] + '&end=' + obj['info']['end'];
						}
						data['st'] = puremvc.stream[ft]['dt']['st'];
						data['ip'] = puremvc.stream[ft]['dt']['sh'];
						if(puremvc.stream[ft]['dt']['bh']) data['backip'] = puremvc.stream[ft]['dt']['bh'];//备用ip
						data['videoSrc'] += '&vvid=' + puremvc.bip.vvid;
						return data;
					},
					onRemove : function() {
						this.setViewComponent(null);
					},
					onRegister : function() {
						//
						var UICom = cn.pplive.player.view.component.core.UIComponent;
						var Player = cn.pplive.player.view.component.PlayerComponent;
						UICom.call(Player);
						$.extend(Player.prototype , UICom.prototype);
						this.setViewComponent(new cn.pplive.player.view.component.PlayerComponent());
						this.viewComponent.target = this.viewComponent.video;
						//
						this.viewComponent.addEventListener(cn.pplive.player.view.event.H5PlayerEvent.ADS_STATUS, this);
						this.viewComponent.addEventListener(cn.pplive.player.view.event.H5PlayerEvent.WEB_PLAY, this);
						this.viewComponent.addEventListener(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_UPDATE, this);
						this.viewComponent.addEventListener(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_STATE, this);
						this.viewComponent.addEventListener(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_BUFFER, this);
						this.viewComponent.addEventListener(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_FAILED, this);
						this.viewComponent.addEventListener(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_TITLE, this);
						this.viewComponent.addEventListener(cn.pplive.player.view.event.H5PlayerEvent.CONTROL_STATE, this);
						this.viewComponent.addEventListener(cn.pplive.player.view.event.H5PlayerEvent.SKIN_TIPS, this);
						this.viewComponent.addEventListener(cn.pplive.player.view.event.H5PlayerEvent.SKIN_RECOM, this);
						//
						this.viewComponent.addEventListener(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_BIP, this);
						this.viewComponent.addEventListener(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_STORAGE, this);
						this.viewComponent.addEventListener(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_ONLINE, this);
						this.viewComponent.addEventListener(cn.pplive.player.view.event.H5PlayerEvent.START_RECORD, this);
						this.viewComponent.addEventListener(cn.pplive.player.view.event.H5PlayerEvent.STOP_RECORD, this);
						this.viewComponent.addEventListener(cn.pplive.player.view.event.H5PlayerEvent.ADD_VALUE, this);
						this.viewComponent.addEventListener(cn.pplive.player.view.event.H5PlayerEvent.ADS_EVENT, this);
						this.viewComponent.execute();
						this.playObj = null;
					},
					handleEvent : function (event, data) { 
					    var self = event.data.self;
						var skinMediator = self.facade.retrieveMediator(cn.pplive.player.view.H5SkinMediator.NAME);  
						switch(event.type) {
							case cn.pplive.player.view.event.H5PlayerEvent.ADS_STATUS:
								self.sendNotification(player.H5Notification.ADS_STATUS, data);
								break;
							case cn.pplive.player.view.event.H5PlayerEvent.WEB_PLAY:
								var playProxy = self.facade.retrieveProxy(cn.pplive.player.model.H5PlayProxy.NAME);
								playProxy.reset();
								playProxy.loadData();
								break;
							case cn.pplive.player.view.event.H5PlayerEvent.CONTROL_STATE:
								self.sendNotification(player.H5Notification.CONTROL_STATE, data);
								break;
						    case cn.pplive.player.view.event.H5PlayerEvent.VIDEO_TITLE:
								self.sendNotification(player.H5Notification.VIDEO_TITLE, data);
								break;
							case cn.pplive.player.view.event.H5PlayerEvent.VIDEO_UPDATE:
								self.sendNotification(player.H5Notification.VIDEO_UPDATE, data);
								break;
							case cn.pplive.player.view.event.H5PlayerEvent.VIDEO_STATE:
								self.sendNotification(player.H5Notification.VIDEO_STATE, data);
								break;
							case cn.pplive.player.view.event.H5PlayerEvent.VIDEO_BUFFER:
								try {
									skinMediator.view().showBuffer();
								} catch(e){};
								break;
							case cn.pplive.player.view.event.H5PlayerEvent.VIDEO_FAILED:
								self.sendNotification(player.H5Notification.PLAY_FAILED, data);
								break;
							case cn.pplive.player.view.event.H5PlayerEvent.SKIN_TIPS:
								try {
									skinMediator.view().showTip(data['bool']);
								} catch(e){};
								break;
							case cn.pplive.player.view.event.H5PlayerEvent.SKIN_RECOM:
								self.sendNotification(player.H5Notification.SKIN_RECOM);
								break;
							case cn.pplive.player.view.event.H5PlayerEvent.VIDEO_BIP:
								self.sendNotification(player.H5Notification.VIDEO_BIP, data);
								break;
							case cn.pplive.player.view.event.H5PlayerEvent.START_RECORD:
								self.sendNotification(player.H5Notification.START_RECORD, data);
								break;
							case cn.pplive.player.view.event.H5PlayerEvent.STOP_RECORD:
								self.sendNotification(player.H5Notification.STOP_RECORD, data);
								break;
							case cn.pplive.player.view.event.H5PlayerEvent.ADD_VALUE:
								self.sendNotification(player.H5Notification.ADD_VALUE, data);
								break;
							case cn.pplive.player.view.event.H5PlayerEvent.VIDEO_STORAGE:
								self.sendNotification(player.H5Notification.VIDEO_STORAGE, data);
								break;
							case cn.pplive.player.view.event.H5PlayerEvent.VIDEO_ONLINE:
								self.sendNotification(player.H5Notification.VIDEO_ONLINE, data);
								break;
							case cn.pplive.player.view.event.H5PlayerEvent.ADS_EVENT:
								self.sendNotification(player.H5Notification.ADS_EVENT, data);
								break;
						 }
						
					},
					view : function() {
						if (this.viewComponent) {
							return this.viewComponent;
						}
						return null;
					}
				},
				{
					NAME : 'h5player_mediator'
				});