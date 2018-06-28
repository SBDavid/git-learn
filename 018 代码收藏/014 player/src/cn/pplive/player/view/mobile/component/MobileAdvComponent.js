/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import $ from 'jquery';
import Global from "manager/Global";
import H5ComponentEvent from "../../event/H5ComponentEvent";
import { UIComponent } from "../../component/UIComponent";
import { H5CommonUtils } from "common/H5CommonUtils";
import { CommonUI } from "../../component/CommonUI";

export class MobileAdvComponent extends UIComponent {
	
	constructor() {
		super();
		let ad_box = CommonUI.adverHtml;
		ad_box = H5CommonUtils.replaceClassPrefix(ad_box, 'p-');
		$('.control').before(ad_box);
		this.vastAdBox = Global.getInstance().pbox.find('div[class$="video-vastad"]');
		this.finished = false;
		//
		$(window).on('message', (e) => {
										//source – 消息源，消息的发送窗口/iframe。
										//origin – 消息源的URI(可能包含协议、域名和端口)，用来验证数据源。
										//data – 发送方发送给接收方的数据  ==>> {"type":"finish","values":["-1"]}  (wap环境下，由广告播放器抛出)
										Global.debug('监听到广告播放器抛出事件 ==>> ', e.originalEvent.data);
										this.finished = true;
										try{
											this.$data = JSON.parse(e.originalEvent.data);
											switch(this.$data['type']) {
												case 'finish':
													this.sendEvent(H5ComponentEvent.ADS_STATUS, {
																								'status' : parseInt(this.$data['values'][0])
																							});
													break;
												case 'videoSrc':
													this.sendEvent(H5ComponentEvent.ADV_EVENT, {
																								'eventType':'advSrc',
																								'src' : this.$data['values'][0]
																							});
													break;
											}
											this.sendEvent(H5ComponentEvent.ADV_EVENT, {
																						'eventType':'advConnect',
																						'type' : this.$data['type']
																					});
										}catch(e){}
									});
	}

	execute(src) {
		var queryToString = function(object) {
								if (!object || $.isEmptyObject(object)) return '';
								return $.param(object);
							}
		src += queryToString(Global.getInstance().adConfig);
		src += `&o=${Global.getInstance().ctx.o}`;
		src += `&userUnique=${Global.getInstance().userInfo.guid}`;
		try{
			Global.debug('广告播放器url ==>> ', src);
			this.vastAdBox.html('<iframe id="adiframe" name="adiframe" src="'+ src +'" width="100%" height="100%"  scrolling="no" frameborder="0"></iframe>');
			this.showDom(false);
			this.vastAdBox.find('iframe')[0].onerror = () => {
															this.sendEvent(H5ComponentEvent.ADS_STATUS, {
																										'status' : 11
																									});
														};
		}catch(e){}
	}

	showDom(bl) {
		if (bl) {
			setTimeout(() => {
							Global.debug('广告移除 ==>> ', !this.finished);
							if(this.finished) return;
							this.sendEvent(H5ComponentEvent.ADS_STATUS, {
																		'status' : 100
																	});
						}, 15*1000);
			this.vastAdBox.show();
		} else this.vastAdBox.hide();
	}

	resize() {
		
	}

}