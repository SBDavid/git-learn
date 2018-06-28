import {hexString2ByteArray,byteArray2HexString} from '../../utils/Utils.js'
import Global from "../../../cn/pplive/player/manager/Global";
import {Common} from '../../common/CommonUtils'

export default class RID{
	constructor(info) {
//		Global.debug('constructor RID')
		this._data1;
		this._data2;
		this._data3;
		this._data5;
		this._data6;
		this._stringValue;
		this._bytes;
		if (typeof(info) == 'string')
		{
			this.fromString(info);
			this._stringValue = info;
		}
		else
		{
			this.fromBytes(info);
			this._bytes = info;
		}
	}
	
	fromString(utfstr)
	{
		if (utfstr.length == Common.RID_HEX_STRING_LENGTH)
		{
			this._bytes = hexString2ByteArray(utfstr);
		}
		else
		{
			Global.debug("invalid RID str: " + utfstr);
		}
	}
	
	writeToBytes(bytes)
	{
		bytes.setUint32(0,this._data1);
		bytes.setUint16(4,this._data2);
		bytes.setUint16(6,this._data3);
		bytes.setUint32(8,this._data4);
		bytes.setUint32(12,this._data5);
	}
	
	fromBytes(bytes)
	{
		if (bytes.byteLength >= Common.RID_LENGTH)
		{			
			this._data1 = bytes.getUint32(0, true);
			this._data2 = bytes.getUint16(4, true);
			this._data3 = bytes.getUint16(6, true);
			this._data4 = bytes.getUint32(8);
			this._data5 = bytes.getUint32(12);
		}
		else
		{
			Global.debug("the bytes available is not enough");
		}
	}
	
	toString()
	{
		if (this._stringValue == null)
		{			
			var bytes = new ArrayBuffer(16);
			var $dataView = new DataView(bytes);
			this.writeToBytes($dataView);
			var array = new Uint8Array(bytes);
			this._stringValue = byteArray2HexString(array);
		}
		
		return this._stringValue;
	}
}