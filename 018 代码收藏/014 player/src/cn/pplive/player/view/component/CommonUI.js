/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import $ from 'jquery';
import Global from "manager/Global";
import { H5CommonUtils } from "common/H5CommonUtils";
import { H5Common } from "common/H5Common";

export const CommonUI = {

	initError(des) {
		des || (des = `播放器初始化数据错误，请刷新后重试`);
		let con = `<div style="text-align: center;position: relative;top: 50%;font-size: 0.3rem;color: #3299ff;margin: -0.15rem auto;"><span>${des}</span></div>`;
		$(document.body).css({'background' : '#000000'});
		$(document.body).html(con);
	},

	/**
	 * 
	 * @param {*} container  承载容器
	 * @param {*} mark       水印对象 {
	 *									'align': node.align,           显示位置
	 *									'width': Number(node.width),   宽度偏移量
	 *									'ax'   : Number(node.ax),      横向偏移量
	 *									'ay'   : Number(node.ay)       纵向偏移量
	 *								}
	 */
	showMark(container, mark) {
		try{
			Global.debug('添加视频水印  >>>>> ', mark);
			let $markid = 'p-mark',
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
					'id'   : $markid,
					'style': $style
				}).insertAfter(container).html('<img src="'+ mark['url'] +'" style="width:100%;height:auto;position:absolute;"/>');
			}
		}catch(e){};
	},

	/**
	 * 
	 * @param {*} container 承载容器
	 * @param {*} pno       节目备案号
	 */
	showPno(container, pno) {
		try{
			if (!pno) return;
			Global.debug('添加节目备案号 >>>>> ', pno);
			let $pnoid = 'p-pno',
				$style = 'position:absolute;bottom:2%;right:1%;font-size:0.26rem;opacity:0.6;max-width:80%;';
			if ($('#' + $pnoid).length == 0) {
				$('<div/>', {
					'id' : $pnoid,
					'style' : $style
				}).insertAfter(container).html('<span>' + pno + '</span>');
				setTimeout(() => {
					$('#'+$pnoid).animate({
											opacity : 0,
										},
										0.5*1000,
										'swing',
										function(){
											this.remove();
										});
				}, 10*1000);
			}
		}catch(e){};
	},

	//pc的web端控件容器
	pcboxHtml : [
					'<div class="w-video-title">',
						'<span></span>',
					'</div>',
					'<div class="w-tips" />',
					'<div class="w-handy">',
						'<div class="w-handy-child w-share"><i>分享</i></div>',
						'<div class="w-handy-child w-qrcode"><i>手机看</i></div>',
					'</div>',
					'<div class="w-video-button" />',
					'<div class="w-control">',
						'<div class="w-progress">',
							'<div class="w-progress-slider">',
								'<div class="w-bufferBar" />',
								'<div class="w-posiBar" />',
								'<div class="w-active" />',
								'<div class="w-drag" />',
							'</div>',
						'</div>',
						'<div class="w-control-left">',
							'<div class="w-play-container">',
								'<div class="w-playPause-button w-play" />',
							'</div>',
							'<div class="w-next-container">',
								'<div class="w-next" />',
							'</div>',
							'<div class="w-stop-container">',
								'<div class="w-stop" />',
							'</div>',
							'<div class="w-time">',
								'<span class="w-current">00:00:00</span>',
								'<span class="w-total" />',
							'</div>',
						'</div>',
						'<div class="w-control-right">',
							'<div class="w-barrage-container">',
								'<div class="w-barrage">',
									'<div class="w-barrage-open">弹幕</div>',
								'</div>',
							'</div>',
							'<div class="w-lang">',
								'<div class="w-btn-text">国 语</div>',
							'</div>',
							'<div class="w-ft">',
								'<div class="w-btn-text">流 畅</div>',
							'</div>',
							'<div class="w-sound-container">',
								'<div class="w-sound" />',
								'<div class="arc_2">',
									'<div class="arc_1">',
										'<div class="arc_0" />',
									'</div>',
								'</div>',
							'</div>',
							'<div class="w-setup-container">',
								'<div class="w-setup" />',
							'</div>',
							'<div class="w-expand-container">',
								'<div class="w-expandIn" />',
							'</div>',
							'<div class="w-zoom-container">',
								'<div class="w-zoomIn" />',
							'</div>',
						'</div>',
					'</div>'
				].join(''),

	//mobile端控件容器
	mobileboxHtml : [
						'<div class="p-video-tip3">',
						    '<div class="rightCorner">',
						    	'<span class="tipLogin">已是VIP会员请登录</span>',
						    '</div>',
						    '<div class="wrap">',
								'<p class="content">试看已结束<br/>请下载PP视频APP，观看完整版</p>',
								'<div class="btns">',
									'<a href="javascript:void(0);" class="app left">观看完整版</a>',
									'<a href="javascript:void(0);" class="know right">我知道了</a>',
								'</div>',
								'<div class="oths">',
									'<a href="javascript:void(0);" class="center">打开PP视频</a>',
								'</div>',
							'</div>',
						'</div>',
						'<div class="p-video-title">',
						    '<span></span>',
						'</div>',
						'<div class="p-video-countdown">',
						    '<span></span>',
						'</div>',	
						'<div class="p-tips" />',
						'<div class="countdown-btn">',
							'<a href="javascript:void(0);" class="app">观看完整版直播</a>',
						'</div>',
						'<div class="p-video-button" />',
						'<div class="control">',
							'<div class="progress">',
								'<div class="bufferBar" />',
								'<div class="posiBar" />',
								'<div class="drag" />',
							'</div>',
							'<div class="p-play-container">',
								'<div class="p-playPause-button p-go" />',
							'</div>',
							'<div class="time">',
								'<span class="current">00:00:00</span>',
								'<span class="total">00:00:00</span>',
							'</div>',
							'<div class="p-zoom-container">',
								'<div class="zoomIn" />',
							'</div>',
						'</div>'
					].join(''),

	//视频容器
	videoHtml : [
					'<div class="p-video">',
						'<div class="p-video-box">',
							'<video class="p-video-player" width=[WIDTH] height=[HEIGHT] preload="auto" playsinline="true" webkit-playsinline="true" x-webkit-airplay="allow">您的浏览器不支持HTML5，无法观看我们提供的视频！建议使用高版本浏览器观看，谢谢！</video>',
						'</div>',
						'<div class="p-video-poster" />',
						'<div class="p-video-loading" />',
					'</div>'
				].join(''),
	//广告容器
	adverHtml : '<div class="video-vastad" />',

}
