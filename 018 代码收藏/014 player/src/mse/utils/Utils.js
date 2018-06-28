//export default class StringConvert{
	function hexString2ByteArray(hexString) 
	{
		if (hexString.length % 2 != 0)
			return null;
		
		var bytes = new ArrayBuffer(hexString.length / 2);
		var $dataView = new Uint8ClampedArray(bytes);
		for (var i = 0; i < hexString.length / 2; ++i)
		{
			$dataView[i] = hex2byte(hexString.substr(2 * i, 2))
		}
		
		return bytes;
	}
	
	function Max(a, b)
	{
		return a < b ?  b : a;
	}
		
	function byteArray2HexString(bytes)
	{
		var hexString = '';
		for (var i = 0; i < bytes.byteLength; ++i)
		{
			hexString += byte2hex(bytes[i]);
		}
		
		return hexString;
	}	
		
	function byte2hex(byte) {
		var hex = '';
		var arr = 'FEDCBA';
		
		for(var i = 0; i < 2; i++) {
			if(((byte & (0xF0 >> (i * 4))) >> (4 - (i * 4))) > 9){
				hex += arr.charAt(15 - ((byte & (0xF0 >> (i * 4))) >> (4 - (i * 4))));
			}
			else{
				hex += String((byte & (0xF0 >> (i * 4))) >> (4 - (i * 4)));
			}
		}
		
		return hex;
	}
	
	function hex2byte(hex) {
		if (hex.length != 2)
			return 0;
		
		var byte = 0;
		for(var i = 0; i < hex.length; ++i)
		{
			var char = hex.charAt(i);
			if (char >= '0' && char <= '9')
			{
				byte = 16 * byte + (parseInt(char) - parseInt('0'));
			}
			else if (char >= 'a' && char <= 'f')
			{
				byte = 16 * byte + (hexChar2Int(char) - hexChar2Int('a') + 10);
			}
			else if (char >= 'A' && char <= 'F')
			{
				byte = 16 * byte + (hexChar2Int(char) - hexChar2Int('A') + 10);
			}
			else
			{
				return 0;
			}
		}
		
		return byte;
	}
	
	function hexChar2Int(hex)
	{
		if(hex == 'a' || hex == 'A')
			return 10;
		else if(hex == 'b' || hex == 'B')
			return 11;
		else if(hex == 'c' || hex == 'C')
			return 12;
		else if(hex == 'd' || hex == 'D')
			return 13;
		else if(hex == 'e' || hex == 'E')
			return 14;
		else if(hex == 'f' || hex == 'F')
			return 15;
		else
			return 0;
	}
	
	function CRCChecksum(data, offset = 0, length = 0)
	{
		let crc = 0x10312312;
		let v0 = 0;
		let v1 = 0;
		let bytes = new DataView(data);
		if (!length)
		{
			length = bytes.byteLength;
		}
		
		if (length)
		{
			let lastByte = bytes.getUint8(--length + offset,true);
			let position = offset;
			while (length >= 8)
			{
				v0 = bytes.getUint32(position,true);
				v1 = bytes.getUint32(position + 4,true);

				/*
				* 在以下表达式中：((crc >> 6) & ((1 << 26) - 1))  就是 crc >> 6，
				* 这样写的原因是当crc的最高bit为1时，在右移运算中会补充1，而不是补0，由此可知虽然 crc 定义为 uint，但在移位运算中是当做 int 处理的；
				* ......
				*/
				crc ^= ((crc << 14) ^ ((crc >> 6) & ((1 << 26) - 1))) ^ (v0 ^ v1);
				position += 8;
				length -= 8;
			}
			
			while (length--)
			{
				// (((crc >> 13) & ((1 << 19) - 1)) == crc >> 13
				crc ^= (((crc >> 13) & ((1 << 19) - 1)) ^ (bytes.getUint8(position,true)) ^ (crc << 7));				
				position ++;
			}
			
			// (((crc >> 13) & ((1 << 19) - 1)) == crc >> 13
			crc ^= (((crc >> 13) & ((1 << 19) - 1)) ^ (lastByte) ^ (crc << 7));
			
		}
		crc = crc >>> 0;//有符号转无符号
		return crc;
	}
export {
	hexString2ByteArray,byteArray2HexString,CRCChecksum,Max
}