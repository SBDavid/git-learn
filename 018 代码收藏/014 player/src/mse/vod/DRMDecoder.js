import {Stream} from "../../cn/pplive/player/crypto/stream"
import Global from "../../cn/pplive/player/manager/Global";

export default class DRMDecoder{
	constructor() {
        this._stream =  new Stream()
        this._isEncrypted = false;
        this._encodedDataLength = 0;
    }

    appendBytes(bytes){
        let bytesStream = new Stream(bytes);
        bytesStream.readBytes(this._stream, this._stream.position, bytesStream.length());
    }

    init()
    {
        if (this._stream.length() == 1024) {
            this._stream.position = 0;
            
            let mark = this._stream.readInt();
            
            if (mark == 0x11111111) {
                this._isEncrypted = true;
                
                this._version = this._stream.readUnsignedInt();
                this._encodedDataLength = this._stream.readUnsignedInt();
                this._key = this._stream.readUnsignedByte();
                
                Global.debug("encrypted: " + this._encodedDataLength + ", " + this._key);
            }
        }
        
        if (!this._isEncrypted) {
            Global.debug("not encrypted");
        }
    }
    
    decode(subpiece, data)
	{
		if (subpiece.offset < this._encodedDataLength) {
			let decryptedData = new Stream();
			let i , len;
			for (i = 0, len = data.length(); i < len; ++i) {
				decryptedData.pool[i] = data[i] ^ this._key;
			}
			
			return decryptedData;
		}
		
		return data;
	}
	
	destroy() {
		this._stream.clear();
		this._stream = null;
	}
}