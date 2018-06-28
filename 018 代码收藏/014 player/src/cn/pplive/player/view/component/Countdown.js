/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import $ from 'jquery';
import Global from "manager/Global";
import { UIComponent } from "./UIComponent";
import { H5CommonUtils } from "common/H5CommonUtils";
import H5ComponentEvent from "../event/H5ComponentEvent";

export class Countdown extends UIComponent {

	constructor(container) {
		super();
		this.ctid = (Global.getInstance().mobile?'p':'w') + '-countdown';
		if ($('#' + this.ctid).length == 0) {
			$('<div/>', {
							'id' : this.ctid
						}).appendTo(container);
		}
		this.target = $('#' + this.ctid);
	}

	set content(value) {
		$('#' + this.ctid).html('<span>节目还有 ' + H5CommonUtils.timeFormat(value, false, true) + ' 开始播放</span>');
	}

	addTime(cd) {
		this.cd = cd;
		this.content = this.cd;
		this.inter = setInterval(() => {
										if (this.cd > 0) {
											this.cd--;
											this.content = this.cd;
										} else {
											if(this.inter) clearInterval(this.inter);
    										this.sendEvent(H5ComponentEvent.VIDEO_COUNTDOWN);
										}
									}, 1 * 1000);
	}

    remove() {
    	try{
    		this.target.remove();
    	}catch(e){}
    }

}