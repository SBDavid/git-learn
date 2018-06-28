/**
 * ...
 * @author minliang_1112@foxmail.com
 */
;puremvc.define(
				{
					name 		: 'cn.pplive.player.view.component.SkinComponent',
					constructor : function() {
									player.CommonUI.boxHtml = player.CommonUI.boxHtml.replace(/\[TITLE\]/g, puremvc.title?puremvc.title:'');
									puremvc.pbox.html(player.CommonUI.boxHtml);
									//
									this.playTips = puremvc.pbox.find('.p-video-tip3'),
									this.playUIPlayContainer =  puremvc.pbox.find('.p-play-container');
									this.playUIPlayButton =  puremvc.pbox.find('.p-playPause-button');
									this.playUIControl = puremvc.pbox.find('.control');
									this.playUIZoomContainer =  puremvc.pbox.find('.p-zoom-container');
									this.playUIZoom = puremvc.pbox.find('.control .zoom');
									this.playUIBarrageContainer =  puremvc.pbox.find('.p-barrage-container');
									this.playUIBarrage = puremvc.pbox.find('.control .barrage');
									this.playUICurrentTime = puremvc.pbox.find('.control .current');
									this.playUIToTalTime = puremvc.pbox.find('.control .total');
									this.playUIProsser = puremvc.pbox.find('.control .progress');
									this.playUIBufferBar = puremvc.pbox.find('.control .bufferBar');
									this.playUIPosiBar = puremvc.pbox.find('.control .posiBar');
									this.playUITimer = puremvc.pbox.find('.control .time');
									this.playUIDrag = puremvc.pbox.find('.control .drag');
									this.playUIMinProsser = puremvc.pbox.find('.control .minprogress');
									this.playUIMinBufferBar = puremvc.pbox.find('.control .minbufferBar');
									this.playUIMinPosiBar = puremvc.pbox.find('.control .minposiBar');
									this.playUITitle = puremvc.pbox.find('.p-video-title');
									this.playUITips = puremvc.pbox.find('.p-tips');
									this.playUITipLogin = puremvc.pbox.find('.p-video-tip3 .rightCorner .tipLogin');
//									this.playError =  puremvc.pbox.find('.p-error');
									this.playUITipLogin.on('click', function() {
										top.window.open('//i.pptv.com/h5user/login?target=new&back=' + encodeURIComponent(top.window.location.href) + '&type=login&mobile=1&tab=login','_self');
									});
									//
									this.maxpercentage = 100 * (1 - (this.playUIDrag.width() / this.playUIControl.width()));
									this.delayTime = 5;
									this.fadeTime = 0.3;
									this.inter = null;
									this.bufferInter = null;
									this.timeObj = null;
									this.speedResult = null;
									var self = this;
									this.playUIPlayButton.on('click', 	function(e) {
																						self.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.SKIN_STATE);
																						/*TipsManager.getInstance().addTips(self.playUITips,{
																																			times : 1,
																									 										display : 10 * 1000,
																									 										content : '<span>这里是提示内容 00000</span>'
																																	 });
																						setTimeout(function(){
																							TipsManager.getInstance().addTips(self.playUITips,{
																																			times : 1,
																									 										display : 10 * 1000,
																									 										content : '<span>这里是提示内容 11111111</span>'
																																	 });
																						},5*1000);*/
																					});
									this.playUIZoom.on('click', 		function(e) {
																						self.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_SCREEN);
																					});
									this.playUIBarrage.on('click',      function(e) {
																						self.barrageDisplaystate();
																					});
									this.playUIProsser.on('click', 		function(e) {
																						if (puremvc.videoType == 10) return;
																						e.preventDefault();
																						self.updatePosition(e.clientX);
																						self.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_SEEK);
																					});
									this.playUIDrag.on('touchstart',    function(e) {
																						//console.log(e.type);
																						if (puremvc.videoType == 10) return;
																						e.preventDefault();
																						if(e.touches.length == 1){
																							var touch = e.touches[0];
																							puremvc.player.pause();
																							self.isTouching = true;
																							self.startX = touch.clientX;
																						}
																					});
									this.playUIDrag.on('touchmove',     function(e) {
																						if (puremvc.videoType == 10) return;
																						e.preventDefault();
																						if(self.isTouching && e.touches.length == 1){
																							var touch = e.touches[0];
																							self.currentX = touch.clientX;
																							self.updatePosition(self.currentX);
																						}
																					});
									this.playUIDrag.on('touchend',      function(e) {
																						if (puremvc.videoType == 10) return;
																						e.preventDefault();
																						self.startX = self.currentX;
																						self.isTouching = false;
																						self.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_SEEK);
																					});
									this.playTips.find('a').on('click', function(e) {
																						if (/know/gi.test(e.target.className)){
																							self.playTips.hide();
																							self.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_REPLAY);
																						} else if (/app/gi.test(e.target.className)) {
																							if (puremvc.isVipMovie) {
																								if (puremvc.userInfo && puremvc.userInfo.uid) {
																									//【登录用户】
																									if (puremvc.userInfo.isvip) {
																										//【会员用户】
																										self.download();
																									} else {
																										//【普通用户】
																										actPay(puremvc.cid, puremvc.ctx.o);
																									}
																								} else {
																									//【未登录用户】
																									actPay(puremvc.cid, puremvc.ctx.o);
																								}
																							} else {
																								//【非会员节目】
																								self.download();
																							}
																						}/* else if (/tipLogin/gi.test(e.target.className)) {
																							top.window.location.href = '//i.pptv.com/h5user/login?target=new&back=' + encodeURIComponent(top.window.location.href) + '&type=login&mobile=1&tab=login';
																						} */else if (/center/gi.test(e.target.className)) {
																							self.download();
																						}
																					});
									function actPay(cid,channel) {
										top.window.open('//pay.vip.pptv.com/actpayh5/?logintype=msite&aid=content_wap_neirongshikan&fromchannel=' + encodeURIComponent('cid=' + cid +'&channel=' + channel), '_self');
									}
								}
				},
				{
					download : function() {
						//puremvc.downloadType == 1 为体育节目
						var live = '';
						if (puremvc.downloadType == 1) {
							if (puremvc.videoType == 1) {
								//点播
								live = 'action=vod' + '&video_id=' + puremvc.cid  + '&channel_id=' + puremvc.adConfig.chid + '&startTime=' + puremvc.posiTime  ; 
							} else {
								//直播
								live = 'action=live' + '&channel_id=' + puremvc.cid + '&startTime=' + puremvc.posiTime ; 
							}
						} else {
    							live = 'page/player/halfscreen?type=vod&vid=' + puremvc.cid +'&sid=' + puremvc.adConfig.chid + '&startTime=' + puremvc.posiTime ;
						}
						DownloadManager.getInstance().goToApp('//app.aplus.pptv.com/minisite/pptvaphone/m_app_down/pg_2406', live , puremvc.downloadType);
					},
					//安装APP弹层显示
					showTip : function(bool) {
						if (bool){
							puremvc.pbox.off('touchstart');
							this.playUIControl.css({'bottom' : '-1.2rem'});
							this.playUITipLogin.hide();
							this.playTips.find('.btns').css('display', 'block');
							this.playTips.find('.oths').css('display', 'none');
							if (!this.apptempUI) this.apptempUI = this.playTips.find('.app');
							if (!this.knowtempUI) this.knowtempUI = this.playTips.find('.know');
							var appUI, knowUI, contentUI = this.playTips.find('.content'), centerUI = this.playTips.find('.center');
							JcropManager.getInstance().addImage(this.playTips);
							var tname = puremvc.downloadType == 1 ? '体育' : '视频';
							if (puremvc.videoType != 1) {
								this.playTips.find('.btns').css('display', 'none');
								this.playTips.find('.oths').css('display', 'block');
								contentUI.html('本节目为<span style="color:#ff9313;">付费</span>内容<br><br><span style="font-size:0.2rem;">请下载最新版聚力体育客户端付费观看</span>');
								centerUI.html('下载聚力体育');
								this.playTips.show();
								return;
							}
							knowUI = this.apptempUI.attr('class', 'know').addClass('left');
							appUI = this.knowtempUI.attr('class', 'app').addClass('right');
							knowUI.html('再看一次');
							if (puremvc.isVipMovie) {
								if (puremvc.userInfo && puremvc.userInfo.uid) {
									//【登录用户】
									if (puremvc.userInfo.isvip) {
										//【会员用户】
										appUI.html('观看完整版');
										contentUI.html('试看已结束<br />下载聚力'+tname+'APP观看完整版');
									} else {
										//【普通用户】
										appUI.html('开通VIP会员');
										contentUI.html('试看已结束<br />开通VIP会员可免费观看');
									}
								} else {
									//【未登录用户】
									this.playUITipLogin.show();
									appUI.html('开通VIP会员');
									contentUI.html('试看已结束<br />开通VIP会员可免费观看');
								}
							} else {
								//【非会员节目】
								appUI.html('观看完整版');
								contentUI.html('试看已结束<br />下载聚力'+tname+'APP观看完整版');
							}
							this.playTips.show();
						} else {
							this.playTips.hide();
						}
					},
					barrageDisplaystate : function() {
						if(this.playUIBarrage.hasClass('b-close')) {
							this.playUIBarrage.removeClass('b-close').addClass('b-open');
						} else {
							this.playUIBarrage.removeClass('b-open').addClass('b-close');
						}
						this.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_BARRAGE, {
																									'visible' : this.playUIBarrage.hasClass('b-open') && puremvc.barrageDisplay && puremvc.screen
																								});
					},
					//进度条适宽
					orientate : function() {
						this.standrad = parseInt(document.documentElement.style.fontSize);
						let $left = this.playUIPlayContainer.width() + this.playUIPlayContainer.position().left + 15,
							$width = (puremvc.video.width() - $left * 2 - (puremvc.barrageDisplay && puremvc.screen?50:0)) / this.standrad;
						this.playUIProsser.css({
													'left' : $left / this.standrad + 'rem',
													'width' : $width + 'rem'
												});
						this.playUITimer.css({
												'left' : $left / this.standrad + 'rem',
												'width' : $width + 'rem'
											});
						this.playUIBarrageContainer.css({
															'display' : puremvc.barrageDisplay && puremvc.screen?'block':'none'
														})
						this.sendEvent(cn.pplive.player.view.event.H5PlayerEvent.VIDEO_BARRAGE, {
																									'visible' : this.playUIBarrage.hasClass('b-open') && puremvc.barrageDisplay && puremvc.screen
																								});
						//设置minprogess宽度
						this.playUIMinProsser.css({
													'width' : puremvc.video.width() / this.standrad + 'rem'
												});
						JcropManager.getInstance().addImage(this.playTips);
					},
					//播控按钮状态更新
					displayState : function(playstate) {
						if(playstate == 'playing') {
							this.playUIPlayButton.removeClass('p-go').addClass('p-pause');
						} else {
							this.playUIPlayButton.removeClass('p-pause').addClass('p-go');
							if (playstate == 'stopped') this.showTime(0, 0);
						}
					},
					//播放控制栏效果
					controlAnimate : function(bool) {
						this.orientate();
						this.playUITitle.css({'display' : 'block'});
						this.playTitleTop = this.playUITitle.find('span').position().top;
						let animate = (dis0, dis1, dp) => {
										let cb = (display) => {
													this.playUIMinProsser.css({'display' : display});
												};
										this.playUIControl.animate({
																	'bottom' : dis0 + 'rem'
																}, 
																this.fadeTime * 1000, 'ease-out', cb(dp));
										this.playUITitle.animate({
																	'top' : dis1 + 'rem'
																}, 
																this.fadeTime * 1000, 'ease-out');
									};
						if (bool) {
							animate(0, 0, 'none');
							if (this.inter) clearTimeout(this.inter);
							this.inter = setTimeout(() => {
											animate(-1.2, (-this.playUITitle.height()-this.playTitleTop) / this.standrad, 'block');
										}, this.delayTime * 1000);
						} else {
							animate(-1.2, (-this.playUITitle.height()-this.playTitleTop) / this.standrad, 'block');
						}
					},
					//进度条更新
					position : function(per) {
						var linearObj = {
											'width' : per + '%',
											'background' : '-webkit-linear-gradient(left, #00ADEF '+ (per<20?0:60) + '%, #47CCFE)',
											'background': 'linear-gradient(to right, #00ADEF '+ (per<20?0:60) + '%, #47CCFE)'
										}
						this.playUIMinPosiBar.css(linearObj);
						this.playUIPosiBar.css(linearObj);
						per = 100 * (this.playUIProsser.width() * per / 100 - this.playUIDrag.width() / 2) / this.playUIProsser.width();
						this.playUIDrag.css('left', per + '%');
					},
					//时间、进度更新
					update : function(obj) {
						this.timeObj = obj;
						this.showTime(obj['posi'], obj['end'] - obj['start']);
						var per = 100;
						if (puremvc.videoType != 10) {
							per = 100 * obj['posi'] / (obj['end'] - obj['start']);
						}
						this.position(per);
					},
					updatePosition : function(x) {
						var position = x - this.playUIProsser.offset().left;
						var per = 100 * position / this.playUIProsser.width();
						per = (per >= 0) ? function () {
							if(per >= this.maxpercentage) {
								return this.maxpercentage;
							}
							return per;
						}() : 0;
						this.position(per);
						puremvc.posiTime = (this.timeObj['end'] - this.timeObj['start']) * per / 100;
						this.showTime(this.timeObj['posi'], this.timeObj['end'] - this.timeObj['start']);
					},
					//显示时间
					showTime : function(posi, dur) {
						if (puremvc.videoType != 10) {
							var total = player.H5CommonUtils.timeFormat(dur, false);
							this.playUICurrentTime.text(player.H5CommonUtils.timeFormat(posi, false, total.split(':').length > 2));
							this.playUIToTalTime.text(total);
						} else {
							this.playUICurrentTime.text('现场直播');
							this.playUIToTalTime.text(this.timeObj['live'] != undefined ? player.H5CommonUtils.timeFormat(this.timeObj['live'], true) : '');
						}
					},
					showBuffer : function() {
						if (this.bufferInter) clearTimeout(this.bufferInter);
						try {
							var currentBuffer = puremvc.player.buffered.end(0);
							var per = 100 * currentBuffer / puremvc.duration;
							if (per > 100) per = 100;
							this.playUIBufferBar.css('width', per + '%');
							this.playUIMinBufferBar.css('width', per + '%');
							if (currentBuffer < puremvc.duration) {
								this.bufferInter = setTimeout(function() {
																			this.showBuffer();
																		}.bind(this), 0.5 * 1000);
							}
						}catch(e){}
					},
					showError : function(errorcode) {
						try{
							player.CommonUI.showError(puremvc.pbox, errorcode);
							this.playError =  puremvc.pbox.find('#p-error');
							this.feedbackBtn = this.playError.find('.feedbackbtn');
							this.feedback = this.playError.find('.feedback');
							this.feedBackCloseBtn = this.feedback.find('.mask-close');
							this.feedbackSubmit = this.feedback.find('.submit');
							this.feedbackCancel = this.feedback.find('.cancel');
							this.qqInput = this.feedback.find('.qq input');
							this.telInput = this.feedback.find('.tel input');
							var self = this;
							this.feedbackBtn.on('click', function(e) {
									self.feedback.show()
							})
							
							this.feedbackSubmit.on('click', function(e) {
								
									self.feedbackAjax({'errorcode':errorcode,
														'extra1' : 'code=' + errorcode +  ((self.qqInput.val()) ? ('#qq=' + self.qqInput.val()) : '') + ((self.telInput.val()) ? ('#tel=' + self.telInput.val()) : '')});
									self.feedback.hide();	
									self.feedbackBtn.hide();
							})
							
							this.feedBackCloseBtn.on('click', function(e) {
									self.feedback.hide()								
							})
							
							this.feedbackCancel.on('click', function(e) {
									self.feedback.hide()								
							})
							
							this.qqInput.on('keyup',function(){
	    						this.value=this.value.replace(/[^0-9-]+/,'');
	    					});
	    					
	    					this.telInput.on('keyup',function(){
	    						this.value=this.value.replace(/[^0-9-]+/,'');
	    					});
						}
						catch(evt){}
						
					},
					feedbackAjax : function(obj) {
						debug('开始 提交feedback 请求 ');
						var $body = $('body');
				        var $iframe = $('<iframe name="shareIframe" id="shareIframe" style="display:none; height:0; width:0;" height="0" width="0"></iframe>');
				        $body.append($iframe);
				
				        var fromStr = [
				            '<form id="form_share" name="form_share" action="//feedback.client.pptv.com/api/errorlog" method="post" target="shareIframe">',
				            '   <input type="hidden" name="pfkw" id="pfkw" value="m_web_error">',
				            '   <input type="hidden" name="player" id="player" value="' + player.H5CommonUtils.version() + '">',
				            '   <input type="hidden" name="username" id="username" value="' + ((puremvc.userInfo && puremvc.userInfo.uid) ? encodeURIComponent(puremvc.userInfo.uid) : '') + '">',
				            '   <input type="hidden" name="vip" id="vip" value="' + ((puremvc.userInfo && puremvc.userInfo.isvip)? puremvc.userInfo.isvip : 'fasle') + '">',
				            '   <input type="hidden" name="channel" id="channel" value="' + puremvc.ctx.o + '">',
				            '   <input type="hidden" name="message" id="message" value="' + puremvc.title + '+' + puremvc.cid + '">',
				            '   <input type="hidden" name="backUrl" id="backUrl" value="' + encodeURIComponent(decodeURIComponent(puremvc.pageUrl) || window.top.location.href) + '">',
				            '   <input type="hidden" name="ikanlog" id="ikanlog" value="'+ ((m_log) ? encodeURIComponent(m_log) : '' )+'">',
				            '   <input type="hidden" name="errorcode" id="errorcode" value="' + obj['errorcode'] + '">',
				            '   <input type="hidden" name="extra1" id="extra1" value="' + obj['extra1'] + '">',
				            '   <input type="hidden" name="error" id="error" value="h5视频错误码日志">',
				            '</form>'
				        ].join('');
				        var $from = $(fromStr);
				        $body.append($from);
				        $from[0].submit();
				        setTimeout(function(){
							$iframe.remove();
							$from.remove();
				        },2000)
					}
				},
				{
					NAME : 'skincomponent' 
				});







