/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import Global from "./Global";
import { H5CommonUtils } from "common/H5CommonUtils";

export default class JcropManager {   

	static isSingleton = false;
	static instance;

	constructor() {
		if (!JcropManager.isSingleton) {
			throw new Error('只能用 getInstance() 来获取实例...');
		}
	}

	static getInstance() {
		if (!JcropManager.instance) {
			JcropManager.isSingleton = true;
			JcropManager.instance = new JcropManager();
			JcropManager.isSingleton = false;
		}
		return JcropManager.instance;
	}

	/**
	 *  容器中添加图片
	 *  @contain  承载容器
	 *  @img   	  img元素
	 * @isFill    是否等比例填充
	 */
	addImage(contain, img, isFill = false) {
		isFill = Boolean(isFill);
		if (img) {
			var image = contain.find('#'+img.id);
			if (image.length == 0) {
				contain.prepend(img);
				img.onload = (e) => {
									this.setSize(e.target, isFill);
								};
			} else {
				this.setSize(image[0], isFill);
			}
		}
	}

	/**
	 * 容器中图片自适应
	 * @img    图片对象
	 * @isFill 是否等比例填充
	 */
	setSize(img, isFill) {
		let per = (typeof img.naturalWidth == 'undefined') ? img.width/img.height : img.naturalWidth/img.naturalHeight,
			ow = Global.getInstance().pbox.width(),
			oh = Global.getInstance().pbox.height();
		if (ow / oh > per) {
			if (isFill) {
				img.style.width = ow + 'px';
				img.style.height = ow / per + 'px';
			} else {
				img.style.height = oh + 'px';
				img.style.width = oh * per + 'px';
			}			
		} else {
			if (isFill) {
				img.style.height = oh + 'px';
				img.style.width = oh * per + 'px';
			} else {
				img.style.width = ow + 'px';
				img.style.height = ow / per + 'px';
			}			
		}
		img.style.left = (ow - parseFloat(img.style.width)) / 2 + 'px';
		img.style.top = (oh - parseFloat(img.style.height)) / 2 + 'px';
	}

}