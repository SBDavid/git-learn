/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';
/**
 * 读取指定长度的字节流到指定数组中
 * @param {Stream} m Stream实例
 * @param {number} i 读取的长度
 * @param {Array} a 存入的数组
 * @returns {Array} 存入的数组
 */
let baseRead = function(m, i, a) {
	var t = a ? a : [];
	for (var start = 0; start < i; start++) {
	  	t[start] = m.pool[m.position++]
	}
	return t;
};
/**
 * 读取指定位置长度的字节流到指定数组中
 * @param {Stream} m Stream实例
 * @param {number} i 读取的长度
 * @param {Stream} a stream
 * @returns {Array} 存入的数组
 */
let posRead = function(m, begin,length, a) {
    var t = a ? a : new Stream();
    t.position = begin;
    var offset = m.position;
    for (var start = m.position; start < length+offset; start++) {
      	t.write(m.pool[m.position++]);
    }
    return t;
};
/**
 * 判断浏览器是否支持ArrayBuffer
 */
let supportArrayBuffer = (function () {
    return !!window['ArrayBuffer'];
})();
const binaryPot = {
    /**
     * 初始化字节流,把-128至128的区间改为0-256的区间.便于计算
     * @param {Array} array 字节流数组
     * @return {Array} 转化好的字节流数组
     */
    init: function (array) {
	    for (var i = 0; i < array.length; i++) {
	        array[i] *= 1;
	        if (array[i] < 0) {
	          array[i] += 256
	        }
	        if(array[i]>255){
	          throw new Error('不合法字节流')
	        }
	    }
	    return array;
    },
    /**
     * 把一段字符串按照utf8编码写到缓冲区中
     * @param {String} str 将要写入缓冲区的字符串
     * @param {Boolean} isGetBytes 是否只得到内容字节(不包括最开始的两位占位字节)
     * @returns {Array} 字节流
     */
    writeUTF: function (str, isGetBytes) {
		var back = [],
		  	byteSize = 0;
	    for (var i = 0; i < str.length; i++) {
	        var code = str.charCodeAt(i);
	        if (code >= 0 && code <= 127) {
	          byteSize += 1;
	          back.push(code);
	        } else if (code >= 128 && code <= 2047) {
	          byteSize += 2;
	          back.push((192 | (31 & (code >> 6))));
	          back.push((128 | (63 & code)))
	        } else if (code >= 2048 && code <= 65535) {
	          byteSize += 3;
	          back.push((224 | (15 & (code >> 12))));
	          back.push((128 | (63 & (code >> 6))));
	          back.push((128 | (63 & code)))
	        }
	    }
	    for (i = 0; i < back.length; i++) {
	        if (back[i] > 255) {
	          	back[i] &= 255
	        }
	    }
		if (isGetBytes) {
			return back
		}
		if (byteSize <= 255) {
			return [0, byteSize].concat(back);
		} else {
			return [byteSize >> 8, byteSize & 255].concat(back);
		}
    },
    /**
     * 把一串字节流按照utf8编码读取出来
     * @param arr 字节流
     * @returns {String} 读取出来的字符串
     */
    readUTF: function (arr) {
      	if (Object.prototype.toString.call(arr) == "[object String]") {
        	return arr;
      	}
      	var UTF = "",
        	_arr = this.init(arr);
      	for (var i = 0; i < _arr.length; i++) {
        	var one = _arr[i].toString(2),
          	v = one.match(/^1+?(?=0)/);
        	if (v && one.length == 8) {
          		var bytesLength = v[0].length,
            	store = _arr[i].toString(2).slice(7 - bytesLength);
	          	for (var st = 1; st < bytesLength; st++) {
	            	store += _arr[st + i].toString(2).slice(2)
	          	}
	          	UTF += String.fromCharCode(parseInt(store, 2));
	          	i += bytesLength - 1
        	} else {
	          	UTF += String.fromCharCode(_arr[i])
	        }
	    }
      	return UTF;
    },
    /**
     * 转换成Stream对象
     * @param x
     * @returns {Stream}
     */
    convertStream: function (x) {
      	if (x instanceof Stream) {
        	return x
      	} else {
        	return new Stream(x)
      	}
    },
    /**
     * 把一段字符串转为mqtt格式
     * @param str
     * @returns {*|Array}
     */
    toMQttString: function (str) {
      	return this.writeUTF(str)
    }
}

export class Stream {

	constructor(array){
		if (!(this instanceof Stream)) {
     		return new Stream(array);
    	}
	    /**
	     * 字节流缓冲区
	     * @type {Array}
	     */
	    this.pool = [];
	    if (Object.prototype.toString.call(array) === '[object Array]') {
	      	this.pool = binaryPot.init(array);
	    } else if (Object.prototype.toString.call(array) == "[object ArrayBuffer]") {
	      	var arr = new Int8Array(array);
	      	this.pool = binaryPot.init([].slice.call(arr));
	    } else if (typeof array === 'string') {
	      	this.pool = binaryPot.writeUTF(array);
	    }
	    //当前流执行的起始位置
	    this.position = 0;
	    //当前流写入的多少字节
	    this.writen = 0;
	    //返回当前流执行的起始位置是否已经大于整个流的长度
	    this.check = () => {
	      	return this.position >= this.pool.length
	    }
	}

	parse(x) {
    	return binaryPot.convertStream(x);
  	}

  	/**
     * 从缓冲区读取4个字节的长度并转换为int值,position往后移4位
     * @returns {Number} 读取到的数字
     * @description 如果position大于等于缓冲区的长度则返回-1
     */
    readInt () {
      	if (this.check()) {
        	return -1
      	}
     	var end = "";
     	var b = "";
      	for (var i = 0; i < 4; i++) {
			b =  this.pool[this.position++].toString(16);
        	end += (b.length > 1) ? b : ('0' + b);
      	}
      	return parseInt(end, 16);
    }
    
    readDouble () {
      	if (this.check()) {
        	return -1
      	}
     	var end = "";
     	var b = "";
      	for (var i = 0; i < 8; i++) {
			b =  this.pool[this.position++].toString(16);
        	end += (b.length > 1) ? b : ('0' + b);
      	}
      	return parseInt(end, 16);
    }
    
    /**
     * 从缓冲区读取1个字节,position往后移1位
     * @returns {Number}
     * @description 如果position大于等于缓冲区的长度则返回-1
     */
    readByte () {
      	if (this.check()) {
        	return -1;
      	}
      	var val = this.pool[this.position++];
      	if (val > 255) {
        	val &= 255;
      	}
      	return val;
    }
    /**
     * 从缓冲区读取1个字节,或读取指定长度的字节到传入的数组中,position往后移1或bytesArray.length位
     * @param {Array|undefined} bytesArray
     * @returns {Array|Number}
     */
    read (bytesArray) {
      	if (this.check()) {
        	return -1
      	}
      	if (bytesArray) {
        	return baseRead(this, bytesArray.length | 0, bytesArray)
      	} else {
        	return this.readByte();
      	}
    }
    /**
     * 从缓冲区读取1个字节,或读取指定长度的字节到传入的数组中,position往后移1或bytesArray.length位
     * @param {Array|undefined} bytesArray
     * @returns {Array|Number}
     */
    readBytes (s,offset,length) {
      	if (this.check()) {
        	return -1
      	}
      	if(offset == undefined || offset == null ) offset = 0 ;
      	//if(length == undefined || length == null ) end = bytesArray.length | 0;
      	if (s) {
        	return posRead(this, offset, length, s);
      	}
    }
    /**
     * 从缓冲区的position位置按UTF8的格式读取字符串,position往后移指定的长度
     * @returns {String} 读取的字符串
     */
    readUTF () {
      	var big = (this.readByte() << 8) | this.readByte();
      	return binaryPot.readUTF(this.pool.slice(this.position, this.position += big));
	}
	
	/**
	 * 从字节流中读取一个由 length 参数指定的 UTF-8 字节序列，并返回一个字符串。
	 */
	readUTFBytes(length) {
		return binaryPot.readUTF(this.pool.slice(this.position, this.position += length));
	}
	
    /**
     * 把字节流写入缓冲区,writen往后移指定的位
     * @param {Number|Array} _byte 写入缓冲区的字节(流)
     * @returns {Array} 写入的字节流
     */
    write (_byte) {
      	var b = _byte;
      	if (Object.prototype.toString.call(b).toLowerCase() == "[object array]") {
        	[].push.apply(this.pool, b);
        	this.writen += b.length;
      	} else {
        	if (+b == b) {
          		if (b > 255) {
            		b &= 255;
          		}
          		this.pool.push(b);
          		this.writen++
        	}
      	}
      	return b;
    }
    /**
     * @param {Array} arr 把字节数组
     * @return {Array} 缓冲区
     */
    writeBytes (arr,offset,length) {
      	var t = arr ? arr : [];
      	length = arr.length | 0;
    	this.writen = offset;
    	for (var start = offset; start < length; start++) {
    		if(this.pool.length-1<start){
    			this.write(t[start]);
    		}else
      		this.pool[this.writen++] = t[start];
    	}
    	return this;
    }
    /**
     * 把参数当成char类型写入缓冲区,writen往后移2位
     * @param {Number} v 写入缓冲区的字节
     */
    writeChar (v) {
      	if (+v != v) {
        	throw new Error("writeChar:arguments type is error")
      	}
      	this.write((v >> 8) & 255);
      	this.write(v & 255);
      	this.writen += 2
    }
    /**
     * 把字符串按照UTF8的格式写入缓冲区,writen往后移指定的位
     * @param {String} str 字符串
     * * @param {Boolean} isGetBytes 是否只得到内容字节(不包括最开始的两位占位字节)
     * @return {Array} 缓冲区
     */
    writeUTF (str,isGetBytes) {
      	var val = binaryPot.writeUTF(str,isGetBytes);
      	[].push.apply(this.pool, val);
      	this.writen += val.length;
    }
    /**
     * 把缓冲区字节流的格式从0至256的区间改为-128至128的区间
     * @returns {Array} 转换后的字节流
     */
    toComplements () {
      	var _tPool = this.pool;
      	for (var i = 0; i < _tPool.length; i++) {
        	if (_tPool[i] > 128) {
          		_tPool[i] -= 256
        	}
      	}
      	return _tPool;
    }
    /**
     * 获取整个缓冲区的字节
     * @param {Boolean} isCom 是否转换字节流区间
     * @returns {Array} 转换后的缓冲区
     */
    getBytesArray (isCom) {
      	if (isCom) {
        	return this.toComplements()
      	}
      	return this.pool;
    }
    /**
     * 把缓冲区的字节流转换为ArrayBuffer
     * @returns {ArrayBuffer}
     * @throw {Error} 不支持ArrayBuffer
     */
    toArrayBuffer () {
      	if (supportArrayBuffer) {
        	return new ArrayBuffer(this.getBytesArray());
      	} else {
        	throw new Error('not support arraybuffer');
      	}
    }
    clear () {
      	this.pool = [];
      	this.writen = this.position = 0;
    }
    length(){
    	return this.pool.length;
    }
    	
	bytesAvailable(){
		return this.length() - this.position;
	}
}