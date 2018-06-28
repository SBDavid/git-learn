/**
 * ...
 * @author minliang_1112@foxmail.com
 */
;puremvc.define({
					name: 'player.CommonUI'
				},
				{ },
				{
					//显示错误提示
					showError	: function(container, errorcode) {
									var $errorid = 'p-error', $tempCont = '',
										$style = 'position:absolute;width:100%;height:100%;background-color:#181818;top:0px;left:0px;z-index:100;',
										$con = ['<div style="position:absolute;width:80%;height:2.5rem;top:0;right:0;bottom:0;left:0;margin:auto;">',
													'<div class="p-error-img"/>',
													'<div class="p-error-txt">很抱歉，[TITLE]<br>熊小猫正在请程序员哥哥来帮忙<br>[BUTTON]<br><a href="javascript:void(0);" class="feedbackbtn">提交反馈</a><br>错误代码：%code%</div>',
												'</div>',
												'<div class="feedback" style="display:none;">',
													'<div class="mask">',
														'<div class="mask-hd">',
															'<h3>我要反馈</h3>',
															'<a class="mask-close" href="javascript:;">X</a>',
														'</div>',
														'<div class="mask-bd">',
															'<p>点击提交     我们将排查您遇到的问题<br>留下联系方式       以便更好地为您解决问题</p>',
															'<form id="mask_form">',
																'<div class="con qq">',
																	'<span>Q Q :</span><input type="text" placeholder="请输入QQ">',																
																'</div>',
																'<div class="con tel">',
																	'<span>电话 :</span><input type="text" maxlength="11" placeholder="请输入手机号码">',																
																'</div>',
																'<div class="mask-btn">',
																	'<a href="javascript:;" class="submit">提&nbsp;交</a>',
																	'<a href="javascript:;" class="cancel">取&nbsp;消</a>',
																'</div>',
															'</form>',
														'</div>',
													'</div>',
												'</div>'].join('');
									$con = $con.replace(/%code%/g, errorcode);
									if(errorcode == '510') {
 										$tempCont = $con.replace(/\[TITLE\]/g, '一大波人排队进来中...').replace(/\[BUTTON\]/g, '<a class="update">点我刷新试试</a>');
									}else{
										$tempCont = $con.replace(/\[TITLE\]/g, '该节目信息加载异常').replace(/\[BUTTON\]/g, '<a href="//m.pptv.com" target="_top">去首页</a> 换个心情吧');	
									}
									try {
										if ($('#' + $errorid).length == 0) {
											$('<div/>', {
														'id' : $errorid,
														'style' : $style
													}).appendTo(container);
										}
										$('#' + $errorid).html($tempCont);
									}catch(e){ }
									let $tmp = '',num = 5;
									if($(".update").length != 0) {
										$(".update").on("click",function(e) {
											$tempCont = $con.replace(/\[TITLE\]/g, '一大波人排队进来中...').replace(/\[BUTTON\]/g, '<font style="color:#666;">点我刷新试试 [NUM]</font>');
											$tmp = $tempCont.replace(/\[NUM\]/g,num);
											$('#' + $errorid).html($tmp);
											Countdown();
										});
									};
									function Countdown() {
										let timer = setInterval(function(){
											if(num > 0){
												num--;
												$tmp = $tempCont.replace(/\[NUM\]/g, num);
												$('#' + $errorid).html($tmp);
											}else {
												clearInterval(timer);
												window.location.reload();
											}
										},1 * 1000);
									}
								},
					//显示视频水印
					showMark 	: function(container, mark) {
									try{
										debug('添加视频水印  >>>>> ', mark);
										var $markid = 'p-mark',
											$ax = mark['ax'] * 100 + '%',
											$ay = mark['ay'] * 100 + '%',
											$style = 'position:absolute;width:' + mark['width'] * 100 + '%;height:' + container.width()*mark['width'] / 5 / container.height() * 100 + '%;';
										switch(mark['align']) {
											case 'lefttop':
												$style += 'top:' + $ay + ';left:' + $ax;
												break;
											case 'leftbottom':
												$style += 'bottom:' + $ay + ';left:' + $ax;
												break;
											case 'rightbottom':
												$style += 'bottom:' + $ay + ';right:' + $ax;
												break;
											case 'righttop':
											default:
												$style += 'top:' + $ay + ';right:' + $ax;
												break;
										}
										if ($('#' + $markid).length == 0) {
											$('<div/>', {
														'id' : $markid,
														'style' : $style
													}).insertAfter(container).html('<img src="'+ mark['url'] +'" style="width:100%;height:auto;position:absolute;"/>');
										}
									}catch(e){};
					},
					//显示节目备案号
					showPno     : function(container, pno) {
									try{
										if (!pno) return;
										debug('添加节目备案号 >>>>> ', pno);
										var $pnoid = 'p-pno',
											$style = 'position:absolute;bottom:2%;right:1%;font-size:0.26rem;opacity:0.6;max-width:80%;';
										if ($('#' + $pnoid).length == 0) {
											$('<div/>', {
														'id' : $pnoid,
														'style' : $style
													}).insertAfter(container).html('<span>' + pno + '</span>');
											setTimeout(function(){
																	$('#'+$pnoid).animate({
																							opacity : 0,
																						},
																						0.5*1000,
																						'ease-out',
																						function(){
																							this.remove();
																						});
																}, 10*1000);
										}
									}catch(e){};
								},
					//控件容器
					boxHtml     : [
									'<div class="p-video-tip3">',
									    '<div class="rightCorner">',
									    	'<span class="tipLogin">已是VIP会员请登录</span>',
									    '</div>',
									    '<div class="wrap">',
											'<p class="content">试看已结束<br/>请下载聚力视频APP，观看完整版</p>',
											'<div class="btns">',
												'<a href="javascript:void(0);" class="app left">观看完整版</a>',
												'<a href="javascript:void(0);" class="know right">我知道了</a>',
											'</div>',
											'<div class="oths">',
												'<a href="javascript:void(0);" class="center">打开聚力视频</a>',
											'</div>',
										'</div>',
									'</div>',
									'<div class="p-video-title">',
									    '<span></span>',
									'</div>',
									'<div class="p-tips"></div>',
									'<div class="control">',
										'<div class="progress">',
											'<div class="bufferBar"></div>',
											'<div class="posiBar"></div>',
											'<div class="drag"></div>',
										'</div>',
										'<div class="minprogress">',
											'<div class="minbufferBar"></div>',
											'<div class="minposiBar"></div>',
										'</div>',
										'<div class="p-play-container">',
											'<div class="p-playPause-button p-go"></div>',
										'</div>',
										'<div class="time">',
											'<span class="current">00:00:00</span>',
											'<span class="total">00:00:00</span>',
										'</div>',
										'<div class="p-barrage-container">',
											'<div class="barrage b-open"></div>',
										'</div>',
										'<div class="p-zoom-container">',
											'<div class="zoom"></div>',
										'</div>',
									'</div>'
								].join(''),
					//视频容器
					videoHtml   : [
									'<div class="p-video" id="p-video">',
										'<video class="p-video-player" width=[WIDTH] height=[HEIGHT] preload="auto" playsinline="true" webkit-playsinline="true" x-webkit-airplay="allow">您的浏览器不支持HTML5，无法观看我们提供的视频！建议使用高版本浏览器观看，谢谢！</video>',
										'<div class="p-video-poster"><img src=[POSTER] alt="" /></div>',
										'<div class="p-video-loading"></div>',
										'<div class="p-video-button"></div>',
									'</div>'
								].join(''),
					//广告容器
					adverHtml   : '<div class="p-video-vastad"></div>',
				});