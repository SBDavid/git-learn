/**
 * ...
 * @author minliang_1112@foxmail.com
 */

try {
	document.domain = 'pptv.com';
}catch(e) { };

if (!this.Zepto) {
	alert('Zepto library is not found');
}

;$(function() {
		'use strict';
		(function(G) {
			G.debug = function(rest) {
						var args = [].slice.call(arguments),
							getLocalTime = function(time) {
											return new Date(parseInt(time)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
										},
							mix = function(obj) {
									var str = '', sign;
									for (var i in obj) {
										try{
											if (typeof obj[i] == 'object') {
												sign = (obj[i].length != undefined?'[,]':'{,}').split(',');
												str += '"' + i + '":' + sign[0] + mix(obj[i]) + sign[1] + ',\r\n';
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
						G.m_log += $log + '***日志分割***';
						console.log($log);
					}
			//新增CSS rem支持
			!function (designW) {
				var docEl = document.documentElement,
					recalc = function () {
						var clientWidth = docEl.clientWidth;
						if (!clientWidth) return;
						docEl.style.fontSize = 100 * (clientWidth / designW) + 'px';
					};
				G.recalc = recalc;
				recalc();
				document.addEventListener('DOMContentLoaded', recalc, false);
			}(750);
			
			var H5Player = function(cfg, pid) {
				this.player = player.H5AppFacade.getInstance(player.H5AppFacade.NAME);
				this.player.startup(cfg, pid);
			}
			H5Player.prototype = {
				'playVideo' : function(obj) {
								debug('接口 playVideo 被执行 ==>> ', obj);
								this.player.playVideo(obj);
							},
				'pauseVideo': function() {
								debug('接口 pauseVideo 被执行 ==>>');
								this.player.pauseVideo();
							},
				'stopVideo' : function() {
								debug('接口 stopVideo 被执行 ==>>');
								this.player.stopVideo();
							},
				'seekVideo' : function(time) {
								debug('接口 seekVideo 被执行 ==>> ', time);
								this.player.seekVideo(time);
							},
				'switchVideo': function(ft) {
								debug('接口 switchVideo 被执行 ==>> ', ft);
								this.player.switchVideo(ft);
							},
				'setVolume' : function(vol) {
								debug('接口 setVolume 被执行 ==>> ', vol);
								this.player.setVolume(vol);
							},
				'getVolume' : function() {
								debug('接口 getVolume 被执行 ==>>');
								return this.player.getVolume();
							},
				'playTime' 	: function() {
								debug('接口 playTime 被执行 ==>>');
								return this.player.playTime();
							},
				'duration'	: function() {
								debug('接口 duration 被执行 ==>>');
								return this.player.duration();
							},
				'version'   : function() {
								debug('接口 version 被执行 ==>>');
								return this.player.version();
							},
				'playState' : function() {
								debug('接口 playState 被执行 ==>>');
								return this.player.playState();
							}
			}
			
			//播放器核心逻辑
			if (!G.ppliveplayer) G.ppliveplayer = { };
			G.ppliveplayer.H5Player = H5Player;
			//
			var isMobile = G.navigator.userAgent.match(/(iPhone|iPod|Android|iPad|BlackBerry|webOS|Windows Phone)/i) ? true : false,
				mix = function(o1, o2){
				        for(var i in o2) {
				            o1[i] = o2[i];
				        }
				        return o1;
					},
				SharePlayer = function(opts, plbox){
				        var config = {
							            "ap":1,  // 是否自动播放，默认自动播放,
							            "w":'100%', //默认100%
							            "h":'100%'  //默认100%
							        };
				        this.config = mix(config, opts);
				        this.playboxID = plbox;
				        //debug('SharePlayer >> ',opts, this.config, plbox);
				        this.initPlayer();
				    };

		    SharePlayer.prototype = {
								        initPlayer : function(){
								            try{
								                if(isMobile){
								                    ppliveplayer.sharePlayer = new ppliveplayer.H5Player(this.config, this.playboxID);
								                }
								            }catch(e){}
								        }
								    }
			//					    
		    G.ppliveplayer.SharePlayer = function(config, plbox){
		        return new SharePlayer(config, plbox);
		    };
			
		})(window);
});