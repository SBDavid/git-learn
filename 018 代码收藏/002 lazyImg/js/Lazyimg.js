/**
 * ...
 * @author minliang_1112@foxmail.com
 *
 * for example:
 *		var lazy = new Lazyimg({
 *								el: 'app',
 *								loading: 'http://static9.pplive.cn/mobile/msite/dist/assets/vertical_def.png',
 *								fadein: true, //是否开启淡入效果的全局选项
 *								nohori: false, //是否忽略横向懒加载的全局选项
 *								speed: 20, //对屏幕滚动的速度的阈值，滚动速度高于此值时，不加载图片
 *								srcparam: 'value'  //放置真是src的参数名
 *							});
 *
 *		lazy.updateImgRender()  【若需要二次渲染更新】
 * 
 */

'use strict';
	
let g = {
		//合并对象
		merge(o, n) {
			n = n || {};
			for (let i in o) {
				if (o.hasOwnProperty(i) && !n.hasOwnProperty(i)) n[i] = o[i];
			}
			return n;
		},
		//获取dom对象
		getDom(id, doc = document) {
			try {
				return doc.querySelector('#' + id);
			} catch (e) {};
			return doc.getElementById(id);
		}
	}

export default class Lazyimg {
	constructor(option) {
		this.options = g.merge({
								'fadein': false,
								'nohori': false,
								'speed': 20
							}, option);
		this.options.el = this.options.el.replace(/#/ig, '');
		this.loading = this.options.loading ? this.options.loading : '';
		//
		this.lastPosY = document.body ? document.body.getBoundingClientRect().top : document.head.parentNode.getBoundingClientRect().top;
		this.lastPosX = document.body ? document.body.getBoundingClientRect().left : document.head.parentNode.getBoundingClientRect().left;
		this.lastSpeeds = [];
		this.aveSpeed = 0;
		this.cntr = 0;
		this.lastCntr = 0;
		this.diff = 0;
		this.scrollEnd = document.createEvent('HTMLEvents');
		this.scrollEnd.initEvent('scrollEnd');
		this.scrollEnd.eventType = 'message';
		this._requestAnimationFrame();
		this._enterFrame();
		this._init();
	}
	
	updateImgRender() {
		if(!g.getDom(this.options.el)) return;
		let temp = g.getDom(this.options.el).querySelectorAll('img');
		try{
			this.els = Array.from(temp);
		}catch(e){
			this.els = Array.prototype.slice.call(temp);
		}
		this.els.forEach((item)=>{
				if (item.getAttribute(this.options.srcparam)) {
					this._render(item, item.getAttribute(this.options.srcparam));
				}
			});
	}
	
	_init() {
		this.updateImgRender();
		document.addEventListener('scroll', function(e) {
			this.lastCntr = this.cntr;
			this.diff = 0;
			this.cntr++;
			let el = null;
			for (let i = 0, len = e.target.childNodes.length; i < len; i++) {
				if (e.target.childNodes[i].nodeType == 1) {
					el = e.target.childNodes[i];
					break;
				}
			}
			this._getSpeed(el);
		}.bind(this));
	}
	
	_render(el, src) {
		let {fadein, nohori} = this.options;
		if (this.loading && this.loading.length > 0) el.src = this.loading;
		if (fadein) {
			var tempId = 'tempImg', newImg;
			if (g.getDom(tempId, el.parentNode)) {
				newImg = g.getDom(tempId, el.parentNode);
			} else {
				newImg = document.createElement('img');
				newImg.setAttribute('id', tempId);
				newImg.style.cssText = 'position: absolute;';
				el.parentNode.insertBefore(newImg, el);
				newImg.src = el.getAttribute('src');
				newImg.style.opacity = 1;
				newImg.style.transition = 'opacity .3s';
				newImg.style.webkitTransition = 'opacity .3s';
				//
				el.style.opacity = 0;
				el.style.transition = 'opacity .3s';
				el.style.webkitTransition = 'opacity .3s';
			}
		}
		//滚动结束执行
		var onloadEnd = ()=>{
			if (fadein) {
				newImg.style.opacity = 0;
				el.style.opacity = 1;
			}
			el.removeEventListener('load', onloadEnd);
		};

		//图片渲染加载
		let compute = ()=>{
			let rect = el.getBoundingClientRect();
			let vpWidth = document.head.parentNode.clientWidth;
			let vpHeight = document.head.parentNode.clientHeight;
			let loadImg = ()=>{
				el.src = src;
				el.addEventListener('load', onloadEnd);
				window.removeEventListener('scrollEnd', compute, true);
				window.removeEventListener('resize', compute, true);
				window.removeEventListener('scroll', computeBySpeed, true);
				this.lastSpeeds = [];
			};
			if (el.src == src) return;
			if (nohori) {
				if (rect.bottom >= 0 && rect.top <= vpHeight) {
					loadImg();
				}
			} else if (rect.bottom >= 0 && rect.top <= vpHeight && rect.right >= 0 && rect.left <= vpWidth) {
				loadImg();
			}
		};
		//滚动执行
		let computeBySpeed = ()=>{
			if (this.options.speed && this.aveSpeed > this.options.speed) return;
			compute();
		};
		let onload = ()=>{
			compute();
			el.removeEventListener('load', onload);
			window.addEventListener('scrollEnd', compute, true);
			window.addEventListener('resize', compute, true);
			window.addEventListener('scroll', computeBySpeed, true);
		};
		onload();
	}
	
	_getSpeed(el) {
		let curPosY = el ? el.getBoundingClientRect().top : 0;
		let curPosX = el ? el.getBoundingClientRect().left : 0;
		let speedY = this.lastPosY - curPosY;
		let speedX = this.lastPosX - curPosX;
		if (this.lastSpeeds.length < 10) {
			this.lastSpeeds.push((speedY + speedX) / 2);
		} else {
			this.lastSpeeds.shift();
			this.lastSpeeds.push((speedY + speedX) / 2);
		}
		let sumSpeed = 0;
		this.lastSpeeds.forEach(function(speed) {
			sumSpeed += speed;
		})
		this.aveSpeed = Math.abs(sumSpeed / this.lastSpeeds.length);
		this.lastPosY = curPosY;
		this.lastPosX = curPosX;
	}
	
	_enterFrame() {
		if (this.cntr != this.lastCntr) {
			this.diff++;
			if (this.diff == 5) {
				window.dispatchEvent(this.scrollEnd);
				this.cntr = this.lastCntr;
			}
		}
		requestAnimationFrame(function(){
										this._enterFrame();
									}.bind(this));
	}
	//帧动画
	_requestAnimationFrame() {
		let requestAnimationFrame = window.requestAnimationFrame;
		if (!requestAnimationFrame) {
			requestAnimationFrame = (cb)=>{
				let currTime = new Date().getTime(),
					lastTime = 0;
				let delayTime = Math.max(0, 16 - (currTime - lastTime));
				let id = setTimeout(()=>{
										cb(currTime + delayTime);
									}, delayTime);
				lastTime = currTime + delayTime;
			}
		}
		window.requestAnimationFrame = requestAnimationFrame;
	}
	
}