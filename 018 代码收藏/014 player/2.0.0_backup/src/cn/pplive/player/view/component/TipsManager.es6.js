/**
 * ...
 * @author minliang_1112@foxmail.com
 * 
 * TipsManager.getInstance().addTips(box,{
 *										times : 1,
 * 										display : 10 * 1000,
 *										content : '<span>这里是提示内容</span>'
 *									 });
 */
'use strict';

let TipsManager = (()=>{

	let instance,
	    tipVec,
	    originObj = {
 						display : 5000
 					};

 	class PlayerTips{

 		constructor(con, obj){
 			this.obj = obj;
			this.id = 'tip_' + new Date().valueOf();
			$('<div/>', {
							'id' : this.id,
							'style' : 'position:absolute;width:100%;height:20px;display:block;background-color:rgba(51,51,51,0.5);'
						}).appendTo(con);
			$('#' + this.id).html(this.obj['content']);
 		}

 		box() {
    		return $('#' + this.id);
    	}

    	show() {
			if (this.obj['times'] == undefined || this.obj['times'] <= 0) return;
			let inter = setTimeout(function(){
												$('#' + this.id).trigger('_close_');
											}.bind(this), this.obj['display']);
    	}

 	}

 	class Tips{

 		constructor(){}

 		/**
		 * 显示新提示，并添加到提示队列中
		 * @param	con 承载容器
		 * @param	obj = {
		 *                  content [必选]: 提示内容,
		 *                  times   [可选]: 显示次数( <=0 或 undefined为常驻),
		 *                  display [可选]: 每次显示时长(毫秒),
		 *                  type    [可选]: 提示类型
		 *                }
		 */
 		addTips (con, obj){
			if (!con || !obj['content']) return;
			//判断已存在相同提示类型，则不重复显示
			if (this.checkTips(obj)) return;
			//新建提示队列
			if (!tipVec) tipVec = [];
			//继续逻辑处理...
			obj = $.extend(originObj, obj);
	        let tip = new PlayerTips(con, obj);
	        tip.box().on('_close_', function(){
	            								this.delTips(obj['type']);
	           	 							}.bind(this));
	        tip.show();
	        //提示定位
	        if (tipVec.length == 0) {
	        	tip.box().css('bottom', 0);
			} else {
				tip.box().css('bottom', parseInt(tipVec[tipVec.length - 1]['target'].css('bottom')) + tipVec[tipVec.length - 1]['target'].height() + 1 + 'px');
			}
			tipVec.push({
 						'target' : tip.box(),
 						'data' : obj
 					});
 		}

 		/**
		 * 删除某一类型的提示
		 * @param	type
		 */
 		delTips(type) {
			try{
				for (let i in tipVec) {
					if (tipVec[i]['data']['type'] == type) {
						this.updateTips(tipVec[i]['target'], {'alpha' : 0}, function(){
									 										//UI删除处理
											 								tipVec[i]['target'].remove();
											 								//队列删除处理
											 								tipVec.splice(i, 1);
																				this.resizeTips();
									 									}.bind(this));
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
 		updateTips(target, alphaObj, completecallback){
			let currBom = parseInt(target.css('bottom')),
			    currHei = target.height(),
			    animateObj = {'bottom' : currBom - currHei + 'px'};
			if (alphaObj) animateObj['opacity'] = alphaObj['alpha'];
			target.animate(animateObj, 
							0.5 * 1000, 
							'ease-out', 
							completecallback);
 		}

 		/**
 		 * 重置提示定位
 		 */
 		resizeTips(){
			for(let i = 0; i<tipVec.length; i++){
				this.updateTips(tipVec[i]['target']);
			}
 		}

 		checkTips(obj){
			try{
				for (let i in tipVec) {
					if (tipVec[i]['data']['type'] && tipVec[i]['data']['type'] == obj['type']) {
						return true;
					}
				}
			}catch(e){};
			return false;
 		}

 	}

 	return {
	 		getInstance : function(){
				 			return instance || (instance = new Tips());
				 		}
	 	}
})();