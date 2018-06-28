/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import {H5CommonUtils} from 'common/H5CommonUtils';

const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const BASE64_KEY = "kioe257ds";

export const PLDecode = {

	getCid(str) {
		let plObj = H5CommonUtils.queryToObject(this.decodeBase64(str, 'pplive'));
		let ist, ChListId, CatalogId, ChannelId;
		for (let i in plObj) {
			switch(i) {
				case 'a':
					ChListId = plObj[i].toString();
					break;
				case 'b':
					CatalogId = plObj[i].toString();
					break;
				case 'c':
					ist = plObj[i].toString();
					break;
				case 'd':
					ChannelId = plObj[i].toString();
					break;
			}
		}
		if (!ist || ist == '0') ChannelId = ChListId;
		return ChannelId;
	},

	decodeBase64(str, key) {
		str = str.replace(/pptv:\/\/([^\/]+)\.*/,"$1").replace(' ', '+').replace('%20', '+').replace('%2B', '+');
		let dataBuffer = new Array(4);
		let outputBuffer = new Array(3);
		let output = "";
		for (let i = 0; i < str.length; i += 4) {
			for (let j = 0; j < 4 && i + j < str.length; j++) {
				dataBuffer[j] = BASE64_CHARS.indexOf(str.charAt(i + j));
			}
			outputBuffer[0] = (dataBuffer[0] << 2) + ((dataBuffer[1] & 0x30) >> 4);
			outputBuffer[1] = ((dataBuffer[1] & 0x0f) << 4) + ((dataBuffer[2] & 0x3c) >> 2);
			outputBuffer[2] = ((dataBuffer[2] & 0x03) << 6) + dataBuffer[3];
			for (let k = 0; k < outputBuffer.length; k++) {
				if (dataBuffer[k+1] == 64) break;
				output += String.fromCharCode(outputBuffer[k]);
			}
		}
		output = this._utf8_decode(output, key);
		return output;
	},

	_utf8_decode(utftext, key) {
	    let string = "", i = 0, c = 0, c1 = 0, c2 = 0, c3 = 0; 
        while ( i < utftext.length ) {  
            c = utftext.charCodeAt(i) - key.charCodeAt(i % key.length);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
	}
}
