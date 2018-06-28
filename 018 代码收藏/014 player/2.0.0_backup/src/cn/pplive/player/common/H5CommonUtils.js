/**
 * ...
 * @author minliang_1112@foxmail.com
 */
;puremvc.define({
					name: 'player.H5CommonUtils'
				},
				{ },
				{
					version     : function() {
									return '2.2.6';
								},
					getQueryString:function(name) {  
							        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");  
							        try{
							        	var r = (window.top.location.search || window.top.location.hash).substr(1).match(reg);  
							        }
							        catch(e){
							        	r = (window.location.search || window.location.hash).substr(1).match(reg);
							        }
							        if (r != null) return unescape(r[2]);  
							        return null;  
							    },
					/**
					 *  函数节流阀
					 *  @cb   	回调函数
					 *  @scope	作用域
					 *  @wait 	延迟时间|毫秒
					 */
					throttle	: function(cb, wait, scope) {
									var last, timer;
									scope || (scope = this);
									wait || (wait = 0.5 * 1000);
									return function() {
											var args = arguments,
												now = +new Date();
											if (last && now < last + wait) {
												clearTimeout(timer);
												timer = setTimeout(function(){
																				last = now;
																				cb.apply(scope, args);
																			},wait);
											} else {
												last = now;
												cb.apply(scope, args);
											}
										}
								},
					//函数扩展参数
					delegate 	: function(f, rest) {
									return function(e) { f.apply(null, [e].concat(rest)); };
								},
					//判断平台确定请求m3u8使用的后缀
					platform 	: function() {
									var agent = window.navigator.userAgent;
									var node = /(iPhone|iPad|iPod)/i.exec(agent);
									switch(node?node[0].toLowerCase():'ipad') {
										case 'iphone' :
											return 'm3u8.web.phone';
										case 'ipod' :
											return 'm3u8.web.pod';
										case 'ipad' :
										default:
											return 'm3u8.web.pad';
									}
								},
					/**
					 *	时间格式化
					 *	@millisecond	时间
					 *	@isTimestamp    是否为时间戳
					 *	@digit			时间显示到秒位 || 分位
					 */
					timeFormat 	: function(millisecond, isTimestamp, digit) {
									var date = new Date(millisecond);
									var hou = isTimestamp ? date.getHours() : Math.floor(millisecond / 3600);
									var min = isTimestamp ? date.getMinutes() : Math.floor(millisecond % 3600 / 60);
									var sec = isTimestamp ? date.getSeconds() : Math.floor(millisecond % 3600 % 60);
									var int2str = function(num) {
										return (num < 10? '0' : '') + num;
									}
									var arr = [int2str(min), int2str(sec)];
									if (!isTimestamp) {
										if (hou > 0 || digit) arr.unshift(int2str(hou));
									} else arr = [int2str(hou), int2str(min), int2str(sec)];
									return arr.join(':');
								},
					//queryString串转为object对象
					queryToObject: function(str) {
									var o = { };
									if(!str || str === '') return o;
									try{
										var list = str.split('&'), i = 0, item;
										while(list[i]) {
											item = list[i].split('=');
											o[item[0]] = decodeURIComponent(item[1]).replace(/{[p|d|a|v|s]+}/g, '');
											i++;
										}
									}catch(e){};
									return o;
								},
					//判断浏览器类型前缀
					prefix 		: function() {
									var getCompStyle = function(elem, classes) {
														return (window.getComputedStyle ? window.getComputedStyle(elem, classes || null) : elem.currentStyle) || null;
													}
									var styles = getCompStyle(document.documentElement),
										pre = (Array.prototype.slice
												.call(styles)
												.join('')
												.match(/-(moz|webkit|ms)-/) || ['', 'o']
											)[1],
										dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
									return {
											'dom'      : dom,
											'lowercase': pre,
											'css'      : '-' + pre + '-',
											'js'       : pre[0].toUpperCase() + pre.substr(1)
										};
								},
					userInfo 	: function(cookie) {
						            var $obj = {
						            			guid : cookie.getItem('PUID')
						            		}
						            if(!cookie.getItem('UDI')) return $obj;
									var $udi   =  cookie.getItem('UDI'),
										$uid   =  cookie.getItem('PPName'),
										$token =  cookie.getItem('ppToken'),
										$isvip;
									$isvip = Boolean($udi ? Number($udi.split('$')[17]) : 0);
									$uid   = $uid ? $uid.split('$')[0] || $udi.split('$')[16] : '';
									$obj['uid'] = $uid;
									$obj['token'] = $token;
									$obj['isvip'] = $isvip;
									return $obj;
								},
					//cookie的存储、读取
					cookie 		: function() {
									return {
										setItem : function (name, value, expires) {
											var text = encodeURIComponent(value), MILLISECONDS_OF_DAY = 24 * 60 * 60 * 1000;
											if(typeof expires === 'number') {
												var date = expires;
												date = new Date();
												date.setTime(date.getTime() + expires * MILLISECONDS_OF_DAY);
												if (expires) {
													text += '; expires=' + date.toUTCString();
												}
											}
											document.cookie = name + '=' + text;
										},
										getItem : function (name) {
											var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
											if(arr !== null) {
												return decodeURIComponent(arr[2]);
											}
											return null;
										},
										removeItem : function(name) {
											var date = new Date(); 
											date.setTime(date.getTime() - 10000);
											document.cookie = name + "=a; expires=" + date.toGMTString();
										}
									}
								},
					/**
					 *  play  请求  2000(成功) 2001(错误) 2002(安全错误) 2003(超时) 2004(无dt数据或无drag值) 2005(检测阀值) 2006(没有该频道信息) 2007(Play返回视频禁用分享功能) 2008(地区屏蔽) 2009(token验证失败)
					 * video  请求  3000(成功) 3001(错误)
					 */
					callCode    : {
									'play' : ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009'],
									'video': ['3000', '3001']
								},
					mobileRegExp: /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|WebOS|Windows Phone)/i,
					adsUrl      : '//player.as.pptv.com/html5/player.html#',
					noAdsList   : ['sale.suning.com', 'm.ijiasu.com', 'www.coca-cola.com.cn'],
					playDomain 	: ['//web-play.pptv.com', '//web-play.pplive.cn', '//211.151.82.252'],
					defaultCFG  : {
									//id : "454", //必填 - 视频播放ID
									//title : "xxx", //视频标题
									//videoSrc : "", //视频播放地址
									//duration : '', //视频时长
									videoType : '', //1-vod | 10-live | 20-live回看
									ctx : "o=0", //可选
									//autoplay : 0,  //可选 - 是否自动播放，默认自动播放
									poster : "//s1.pplive.cn/v/cap/[CHANNELID]/w640.jpg",
									skin : {
												canResize : true,
												captionBar : true,
												controlBar : true
											},
									adConfig : {
													plat : "ik", //平台 | ikan 传ik | mpptv 传mbs
													pos : 1, //广告位
													vvid : "", //视频曝光id  
													chid : "", //频道id -> 合集或剧集id
													clid : "", //分类id
													sid : "", //单集id -> 频道id
													vlen : "", //播放时长
													//slen : "", //上次广告播放完毕到现在的观看视频时长
													//o : "", //渠道   可以不传
													ctx : "", //拓展参数 可以不传
													//ctype : "", //请求策略渠道标识 可以不传
													pageUrl : "" //页面地址
													//预览相关参数 都可以不传
													//cs = 0;
													//duration = 0;
													//url = '';
												}
							},
				});