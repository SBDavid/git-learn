/**
 * ...
 * @author minliang_1112@foxmail.com
 */
'use strict';
let JcropManager = (()=>{

	let instance;

	class Jcrop {

		constructor() {
			this.img = null;
		}

		addImage(contain) {
					if (!this.img) {
						this.img = new Image();
						this.img.src = this.getUrl() + '/css/p-player.jpg';
						this.img.style.cssText = 'position:absolute;z-index:-100;';
						contain.prepend(this.img);
						this.img.onload = function() {
											this.setSize();
										}.bind(this);
					} else {
						this.setSize();
					}
				}

		getUrl() {
					let jsPath = document.scripts;
					for (let i = jsPath.length; i>0; i--) {
						let jsrc = jsPath[i-1].src;
					 	if (jsrc.indexOf('player-min.js') != -1) {
					   		jsPath = jsrc.substring(0, jsrc.lastIndexOf('/') - 3);
					   		break;
					 	}
					}
					return jsPath;
				}

		setSize() {
					let per = this.img.width / this.img.height,
						ow = puremvc.pbox.width(),
						oh = puremvc.pbox.height();
					if (ow / oh > per) {
						this.img.style.width = ow + 'px';
						this.img.style.height = ow / per + 'px';
					} else {
						this.img.style.height = oh + 'px';
						this.img.style.width = oh * per + 'px';
					}
					this.img.style.left = (ow - parseInt(this.img.style.width)) / 2 + 'px';
					this.img.style.top = (oh - parseInt(this.img.style.height)) / 2 + 'px';
				}
	}

	return {
	 		getInstance : function(){
				 			return instance || (instance = new Jcrop());
				 		}
	 	}
})();