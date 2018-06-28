/**
 * 直播数据的块文件包含一个固定大小（1400）的文件头，之后是flv视频数据，
 * 视频数据会划分成一系列的片，每个片的大小是16*1400。
 * 文件头的内容使用MD5值校验；
 * 视频数据的每个分片生成一个CRC32校验值，该值保存在文件头中；
 * 
 * 非flash的客户端之间进行P2P传输时使用的数据块大小是1400；为避免UDP分包，flash p2p(RTMFP)使用的数据块大小是1024；
 *
 * Block文件头的定义如下：
 * 
 * Uint8   block_hash[16]
 * Uint8   rid[16]
 * Uint32  block_head_length
 * Uint32  data_length
 * Uint32  block_id
 * Uint32  version(reversed)
 * Uint32  chesksum[data_length / (16*1400)]
 * Uint8   zero[1400-head_length]
 */
import {Common} from '../../common/CommonUtils'
import RID from './RID.js'
import Global from "../../../cn/pplive/player/manager/Global";
// * Uint8   block_hash[16]
// * Uint8   rid[16]
// * Uint32  block_head_length
// * Uint32  data_length
// * Uint32  block_id
// * Uint32  version(reversed)
class BlockHeader{
	constructor() {
//		Global.debug('constructor BlockHeader')		
		this.data_length = 0;
		this.piece_checksums = [];
		
	}
	
	blockLength()
	{ 
		return (Common.HEADER_SIZE + this.data_length); 
	}	
	
	get pieceCount()
	{ 
		return this.piece_checksums.length; 
	}
	
	getChecksumOfPiece(idx) { 
		return this.piece_checksums[idx]; 
	}
	
	destroy(){
		this.data_length = null;
		this.piece_checksums = null;
	}
}

export default function	fromBytes(bytes)
{
	if (bytes.byteLength < Common.HEADER_SIZE)
	{
		return null;
	}

	var header = new BlockHeader;

	var ridArray = new DataView(bytes,16);
	var rid = new RID(ridArray);
	header.rid = rid.toString();
	var head_length = ridArray.getUint32(16, true);
	header.data_length = ridArray.getUint32(20, true);
	header.blockId = ridArray.getUint32(24,true);
	header._version = ridArray.getUint32(28,true);
	
	if (head_length < Common.PIECE_CHECKSUM_OFFSET || head_length > Common.HEADER_SIZE)
	{
		return null;
	}
	
	if (header.data_length > Common.MAX_PIECES_PER_BLOCK * Common.PIECE_SIZE)
	{
		return null;
	}
	//这个block文件 分片长度
	var pieceLength = Math.floor((header.data_length + Common.PIECE_SIZE - 1) / Common.PIECE_SIZE);
	for(var i = 0 ; i < pieceLength; i++)
	{
		header.piece_checksums[i] = ridArray.getUint32((32 + i * 4),true);
	}
	
	return header;
}