/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import BIPMD5Encode from "./BIPMD5Encode";

export class BIPEncode {

	constructor() {
		this.table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
		this.regexp = /([^\u0000-\u00ff])/;
	}
	
	encodeLog(log, key) {
		let en_str = '';
		for (let i=0; i<log.length; i++) {
			en_str += String.fromCharCode(log.charAt(i).charCodeAt(0) + key.charAt(i%key.length).charCodeAt(0));
		}
		return this.base64(en_str);
	}
	
	encodeOnlineLog(log, key) {
		let en_str = '';
		for (let i=0; i<log.length; i++) {
			en_str += String.fromCharCode(log.charAt(i).charCodeAt(0));
		}
		let onlinestr = this.base64(en_str);
		return 'data=' + onlinestr + '&md5=' + BIPMD5Encode.getInstance().hex_md5(onlinestr + key);
	}
	
	//生成vvid
	createVVID() {
		let getCharAt = (count)=>{
							let $charAt = '',
								ALPHA_CHARS = "0123456789abcdef";
							for (let i = 0; i < count; i++) {
								$charAt += ALPHA_CHARS.charAt(Math.random() * (ALPHA_CHARS.length - 1) >> 0);
							}
							return $charAt;
						}
		let arr = [];
		arr.push(getCharAt(8));
		for (let i = 0; i < 3; i++) {
			arr.push(getCharAt(4));
		}
		let time = new Date().getTime();
		arr.push(("0000000" + time.toString(16)).substr( -8) + getCharAt(4));
		return arr.join('-');
	}
	
	base64(str) {
		if (this.regexp.test(str)) return;
		let i = 0,
			cur, prev, byteNum,
			result=[];
		while(i<str.length) {
			cur = str.charCodeAt(i);
			byteNum = (i+1) % 3;
			switch(byteNum) {
				case 1:
					result.push(this.table.charAt(cur >> 2));
					break;
				case 2:
					result.push(this.table.charAt((prev & 3) << 4 | (cur >> 4)));
					break;
				case 0:
					result.push(this.table.charAt((prev & 0x0f) << 2 | (cur >> 6)));
					result.push(this.table.charAt(cur & 0x3f));
					break;
			}
			prev = cur;
			i++;
		}
		if (byteNum == 1) {
			result.push(this.table.charAt((prev & 3) << 4));
			result.push('==');
		} else if (byteNum == 2) {
			result.push(this.table.charAt((prev & 0x0f) << 2));
			result.push('=');
		}
		return result.join('');
	}
}