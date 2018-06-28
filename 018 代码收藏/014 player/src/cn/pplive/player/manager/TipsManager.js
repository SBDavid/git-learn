/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import $ from 'jquery';

class PlayerTips {

	constructor(con, obj){
		this.obj = obj;
		this.id = 'tip_' + new Date().valueOf();
		$('<div/>', {
						'id' : this.id,
						'style' : 'position:absolute;width:'+(this.obj['fill']?'auto':'100%')+';height:auto;display:block;background-color:rgba(51,51,51,0.9);padding: 5px 0 5px 0;'
					}).appendTo(con);
		let $content = this.obj['content'];
		$content += '<span class="w-close">X</span>';
		$('#' + this.id).html($content);
		this.box.find('.w-setup').on('click', (e) => {
			this.box.trigger('_setup_');
		});
		this.box.find('.w-close').on('click', (e) => {
			this.box.trigger('_close_', this.obj);
		});
	}

	show() {
		if (this.obj['times'] == undefined || this.obj['times'] <= 0) return;
		let inter = setTimeout(() => {
						this.box.trigger('_close_', this.obj);
					}, this.obj['display']);
	}

	get box() {
		return $('#' + this.id);
	}

}

export default class TipspManager {
	
	tipVec = null;
	originObj = {
					display : 5000
				};

	static isSingleton = false;
	static instance;

	constructor() {
		if (!TipspManager.isSingleton) {
			throw new Error('只能用 getInstance() 来获取实例...');
		}
	}

	static getInstance() {
		if (!TipspManager.instance) {
			TipspManager.isSingleton = true;
			TipspManager.instance = new TipspManager();
			TipspManager.isSingleton = false;
		}
		return TipspManager.instance;
	}

	/**
	 * 显示新提示，并添加到提示队列中
	 * @param	con 承载容器
	 * @param	obj = {
	 *                  content [必选]: 提示内容,
	 *                  times   [可选]: 显示次数( <=0 或 undefined为常驻),
	 *                  display [可选]: 每次显示时长(毫秒),
	 *                  type    [可选]: 提示类型,
	 *                  fill    [可选]: 是否内容自适应
	 *                }
	 */
	addTips (con, obj){
		if (!con || !obj['content']) return;
		this.contain = con;
		//判断已存在相同提示类型，则不重复显示
		if (this.checkTips(obj)) return;
		//新建提示队列
		if (!this.tipVec) this.tipVec = [];
		//继续逻辑处理...
		obj = $.extend({}, this.originObj, obj);
	    let tip = new PlayerTips(con, obj);
	    tip.box.on('_close_', (e, data) => {
									this.delTips(data['type']);
								});
	    tip.box.data('info', JSON.stringify(obj));   
	    tip.show();
	    //提示定位
	    if (this.tipVec.length == 0) {
	    	tip.box.css('bottom', 0);
		} else {
			tip.box.css('bottom', parseFloat(this.tipVec[this.tipVec.length - 1]['target'].css('bottom')) 
								+ (this.tipVec[this.tipVec.length - 1]['target'].outerHeight() + 1));
		}
		this.tipVec.push({
							'target' : tip.box,
							'data' : obj
						});
	}

	/**
	 * 获取某一提示的容器
	 * @param {*} type 
	 */
	getTip(type) {
		try{
			for (let i in this.tipVec) {
				if (this.tipVec[i]['data']['type'] == type) {
					return this.tipVec[i]['target'];
				}
			}
		}catch(e){};
		return null;
	}

	/**
	 * 删除某一类型的提示
	 * @param	type
	 */
	delTips(type) {
		// 全部清除
		if (!type) {
			if (this.contain) this.contain.empty();
			if (this.tipVec) this.tipVec = null;
			return;
		}
		// 部分关闭
		try{
			for (let i in this.tipVec) {
				if (this.tipVec[i]['data']['type'] == type) {
					this.currIndex = i;
					this.updateTips(this.tipVec[i]['target'], {'alpha' : 0}, () =>{
																				//UI删除处理
																				this.disH = this.tipVec[i]['target'].outerHeight();
												 								this.tipVec[i]['target'].remove();
												 								//队列删除处理
												 								this.tipVec.splice(i, 1);
																				this.resizeTips();
										 									});
					break;
				}
			}
		}catch(e){};
	}

	/**
	 * 更新提示定位
	 * @param	target            目标提示
	 * @param	alphaObj          透明度对象  {'alpha' : 0}
	 * @param   completecallback  定位后回调
	 */
	updateTips(target, alphaObj = null, completecallback = null){
		let currBom = parseFloat(target.css('bottom')),
		    animateObj = {
					    	'bottom' : (currBom - this.disH)
					    };
		if (alphaObj) animateObj['opacity'] = alphaObj['alpha'];
		target.animate(animateObj, 
						0.2 * 1000, 
						'swing', 
						completecallback);
	}

	/**
	 * 重置提示定位
	 */
	resizeTips(){
		if (!isNaN(this.currIndex) && this.currIndex < this.tipVec.length) {
			for(let i = this.currIndex; i<this.tipVec.length; i++){
				this.updateTips(this.tipVec[i]['target']);
			}
		}
	}

	checkTips(obj){
		try{
			for (let i in this.tipVec) {
				if (this.tipVec[i]['data']['type'] && this.tipVec[i]['data']['type'] == obj['type']) {
					return true;
				}
			}
		}catch(e){};
		return false;
	}
}

