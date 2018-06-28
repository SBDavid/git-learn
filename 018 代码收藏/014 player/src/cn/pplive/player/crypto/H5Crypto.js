/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import {bytes as Bytes} from "./codecBytes";
import {Stream} from "./stream";
import CryptoJS from "CryptoJS";

const SECURE_CHANNEL_RANDOM_HEX_SIZE = 32;
const AES_BLOCK_SIZE = 16;
const Hex = CryptoJS.enc.Hex;
const WordArray = CryptoJS.lib.WordArray;
const sha256 = CryptoJS.SHA256;

export const H5Crypto = {

	SC_KEY:"UwlJsRX59+ldn2gWmrUnxxFiVuzGL3V@",//"V8oo0Or1f047NaiMTxK123LMFuINTNeI",

	/**
	 * 产生随机数
	 */
	getRandom (){
		var b='';
		for(var i = 0;i<16;i++){
			var a = Math.random()*93+33 >> 0;//
			b+=String.fromCharCode(a);
		}
		return b;
	},
	/**
	 * 获取签名、随机数
	 * @param url 例如/w/a5fba2d21196ecfcc49d18f45d4bc53c.mp4?type=dfdfds
	 * @param key 密钥
	 * @return {sgin,random}
	 */	
	getSignature (url,key){
		var ro=this.getRandom();//"',gYVi<im]3V(5#f";//
		var sign=ro+url+key;
		var message = this.toHexStr(sign);
		var wordArray = sha256(Hex.parse(message));
		var ss = Hex.stringify(wordArray);//this.BytesToStr(Bytes.fromBits(wordArray.words));//返回字节数组
		return {
				sign : ss , 
				random : this.toHexStr(ro)
			}
	},
	/**
	 * 字符串转换成十六进制字符串
	 * @param {String} str
	 */
	toHexStr (str){
　　　　var val="";
　　　　for(var i = 0; i < str.length; i++){
　　　　　　val += str.charCodeAt(i).toString(16);
　　　　}
　　　　return val;
	},
	/**
	 * 字节数组转换成字符串
	 * @param {array} arr
	 */
	BytesToStr (arr) {
	    var len = arr.length;
	    var curCharCode;
	    var resultStr = [];
	    var result1=[];
	    for(var i = 0; i < len;i++) {
	     curCharCode = arr[i]; // ASCII Code Value
	     resultStr.push(String.fromCharCode(curCharCode));
	    }
	    return resultStr.join("");
	},
	/**
	 * 解密
	 * @param {String} sc_key
	 * @param {String} cipher_test_hex
	 * @param {String} random_hex
	 */
	secure_key_decrypt(sc_key,cipher_test_hex,random_hex){
		var Byte_plain_text = new Stream();
		var cipher_text_len = cipher_test_hex.length / 2;
		if (cipher_text_len < (SECURE_CHANNEL_RANDOM_HEX_SIZE + AES_BLOCK_SIZE + 1)){
			return this.BytesToStr(Byte_plain_text.pool);
		}
		var arrBuf = Hex.parse(random_hex);
		var randomBuffer = new Stream(Bytes.fromBits(arrBuf.words));
		var Byte_sckey = new Stream();
		Byte_sckey.writeUTF(sc_key,true);
		var ByteBuffer = new Stream();
		randomBuffer.position = 0;
		//生成key: sha256(random1 + sc_k + random2)
		// if(randomBuffer.length() < 16){
        if(arrBuf.sigBytes < 16){
			return this.BytesToStr(Byte_plain_text.pool);
		}
		Byte_sckey.position = 0;
		randomBuffer.readBytes(ByteBuffer,0,8);
		
		Byte_sckey.readBytes(ByteBuffer, ByteBuffer.length(),Byte_sckey.length());
		randomBuffer.readBytes(ByteBuffer, ByteBuffer.length(),8);
		
		var message = WordArray.create(Bytes.toBits(ByteBuffer.pool));
		var bitArray = sha256(message);
		var Byte_key = new Stream(Bytes.fromBits(bitArray['words']));
		Byte_key.position = 0;
		
		/*
		1，反向解码密文：16进制
		2，密文的前一个字节是表示这个密文的填充字节数，填充值为0；
		3，密文后32个字节为：HMAC 哈希运算消息认证码（Hash-based Message Authentication Code）；
		4，R2 + 明文 + R1  SHA256 结果 == HMAC
		*/
		//cipher_test_hex: 密文反向16进制解码
		var Byte_cipher_test = new Stream(Bytes.fromBits(Hex.parse(cipher_test_hex).words));

		var fill_len = Byte_cipher_test.readByte();
		
		var Byte_cipher_Raw = new Stream();
		Byte_cipher_test.readBytes(Byte_cipher_Raw,0,(Byte_cipher_test.length() - 1 - SECURE_CHANNEL_RANDOM_HEX_SIZE));
		
		var Byte_hmac1 = new Stream();
		Byte_cipher_test.readBytes(Byte_hmac1,0,SECURE_CHANNEL_RANDOM_HEX_SIZE);
		var AES = CryptoJS.AES;
		var CipherParams = CryptoJS.lib.CipherParams;
		var aeskey = WordArray.create(Bytes.toBits(Byte_key.pool));
		var ciphertext = WordArray.create(Bytes.toBits(Byte_cipher_Raw.pool));
		var deccc = AES.decrypt(CipherParams.create({ ciphertext: ciphertext }), aeskey, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.NoPadding });
		
		var sss = Bytes.fromBits(deccc['words']);
		Byte_cipher_Raw.writeBytes(sss,0,sss.length);
		//解密是否正确的校验：R2 + 明文 + R1 SHA256 结果
		ByteBuffer.clear();
		randomBuffer.position = 8;
		Byte_cipher_Raw.position = 0;
		
		randomBuffer.readBytes(ByteBuffer,0,8);
		Byte_cipher_Raw.readBytes(ByteBuffer, ByteBuffer.length(), (Byte_cipher_Raw.length() - fill_len));
		randomBuffer.position = 0;
		randomBuffer.readBytes(ByteBuffer, ByteBuffer.length(),8);
		
		ByteBuffer.position = 0;
		var message2 = WordArray.create(Bytes.toBits(ByteBuffer.pool));
		var bitArray2 = sha256(message);
		var Byte_hmac2 =  new Stream(Bytes.fromBits(bitArray2['words']));
		var bll = this.eqByteArray(Byte_hmac2,Byte_hmac1);
		if(bll)
		{
			Byte_cipher_Raw.position = 0;
			Byte_cipher_Raw.readBytes(Byte_plain_text, 0, (Byte_cipher_Raw.length() - fill_len));
		}
		
		return this.BytesToStr(Byte_plain_text.pool);
	},
	/**
	 * 判断两个 ByteArray 是否相等。
	 *
	 * @param a 一个 ByteArray。
	 * @param b 另一个 ByteArray。
	 * @return 如果相等，返回 true；否则返回 false。
	 */
	eqByteArray(a,b){
		if(a.length != b.length)
			return false;
		
		var posA = a.position;
		var posB = b.position;
		var result = true;
		
		a.position = b.position = 0;
		
		while(a.length >= 4) 
		{
			//if(a.readUnsignedInt() != b.readUnsignedInt()) 
			//因为写入二进制的时候去除了符号位，可以用readInt方法比较
			if(a.readInt() != b.readInt()) 
			{
				result = false;
				break;
			}
		}
		
		if(result && a.length != 0) 
		{
			var last = a.length;
			result =
				last == 1 ? a.readByte() == b.readByte() :
				last == 2 ? a.readShort() == b.readShort() :
				last == 3 ? a.readShort() == b.readShort()
				&& a.readByte() == b.readByte() :
				true;
		}
		
		a.position = posA;
		b.position = posB;
		
		return result;
	}
}