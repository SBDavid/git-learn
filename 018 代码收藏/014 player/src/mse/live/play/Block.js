import BlockStatus from './BlockStatus.js'
import fromBytes from './BlockHeader.js'
import {Common} from '../../common/CommonUtils'
import {CRCChecksum} from '../../utils/Utils.js'
import Global from "../../../cn/pplive/player/manager/Global";

export default class Block{
	constructor(rid, blockId, validatePieceChecksum = true) {
//		Global.debug('constructor Block>>' + blockId)		
		this._rid = rid;
		this.blockId = blockId;		
		this._headData = new ArrayBuffer(Common.HEADER_SIZE);
		this._data;
		this._resetHeadData;//block头数据解析好，剩余的数据
		this._dataUsed = 0;
		this._idx = 0;
		
		this._validatePieceChecksum = validatePieceChecksum;
		this.status = new BlockStatus();
		this._header;
		this._completedPieces = 0;
		this._subpieceMarks = [];//按每个字节为单位的数组
		this._subpieceCountOfPieces = [];
		this._pieceValidMarks = [];  // 按每个分片为单位的数组 （header is piece 0 ），  视频数据会划分成一系列的片，每个片的大小是16*1400。
		this.SUBPIECE_COUNT_OF_HEADER = parseInt((Common.HEADER_SIZE + Common.SUBPIECE_SIZE - 1) / Common.SUBPIECE_SIZE);
	}
	
	destroy(){
		this._rid = null;
		if(this._header) this._header.destroy();
		this._header = null;		
		this._subpieceMarks = null;
		this._subpieceCountOfPieces = null;
		this._pieceValidMarks = null;		
		this._dataLength = null;
		this._data = null;
		this._resetHeadData = null;
		this._dataUsed = null;
		this._idx = null;		
		this._validatePieceChecksum = null;
		this.status = null;
	}
	
	get isHeadValid(){
		return this._header != null;
	}
	
	get isComplete() {
		
		var aaa = this._header && this._completedPieces == this._header.piece_checksums.length
		return aaa;
	}
	
	get blockLength()
	{ 
		return this._header ? this._header.blockLength() : 0;
	}	
	
	addSubpiece(data, byteStart, receivedLength,droppedSubpieces = null)
	{
		if (this.isComplete)
		{
			return 	Common.ADD_RESULT_IGNORED;
		}
		
		let result;
		let stashArray ;
		if(data)
		{
			if (this._data)
			{
				stashArray = new Uint8Array(this._data, 0, this._data.byteLength);	
				stashArray.set(new Uint8Array(data), byteStart);
				while(receivedLength >= Common.SUBPIECE_SIZE * (this._idx + 1))
		        {	        		
					result = this.addSubpieceWithHeader(this._idx, droppedSubpieces);			
		        	this._idx++
		        }
			}
			else
			{
				let len = (receivedLength > this._headData.byteLength) ? (this._headData.byteLength - byteStart) : (receivedLength - byteStart);
//				stashArray = new Uint8Array(this._headData, 0, this._headData.byteLength);
//				stashArray.set(new Uint8Array(data,0, len), byteStart);
//				this._resetHeadData = data.slice(len);
				if(len > 0)
				{
					stashArray = new Uint8Array(this._headData, 0, this._headData.byteLength);
					stashArray.set(new Uint8Array(data,0, len), byteStart);
					this._resetHeadData = data.slice(len);
				}
				else
				{
					stashArray = new Uint8Array(new ArrayBuffer(this._resetHeadData.byteLength + data.byteLength));
					stashArray.set(new Uint8Array(this._resetHeadData), 0);
					stashArray.set(new Uint8Array(data), this._resetHeadData.byteLength);
					this._resetHeadData = stashArray.buffer
				}
				while(receivedLength >= Common.SUBPIECE_SIZE * (this._idx + 1))
		        {	        	
		        	if(!this._header)
						result =  this.addSubpieceWithoutHeader(this._idx, droppedSubpieces);	
					else
						result = this.addSubpieceWithHeader(this._idx, droppedSubpieces);
		        	this._idx++
		        }
			}
		}
		else
		{
			if (this._header)			
				result = this.addSubpieceWithHeader(this._idx, droppedSubpieces);			
			else 
				result =  this.addSubpieceWithoutHeader(this._idx, droppedSubpieces);
		}       
        return result;
	}
	
	addSubpieceWithHeader(idx, droppedSubpieces)
	{	
		if (idx >= this._subpieceMarks.length || this._subpieceMarks[idx])
		{
			return Common.ADD_RESULT_IGNORED;
		}
		
		let subpieceSize = (idx + 1 == this._subpieceMarks.length ?  this._header.blockLength() - idx * Common.SUBPIECE_SIZE : Common.SUBPIECE_SIZE);
		
		this._subpieceMarks[idx] = true;
		
		let prePieceIdx = this.getPrePieceIdxOfSubpiece(idx);
		let afterPieceIdx = this.getAfterPieceIdxOfSubpiece(idx);
		
		if (prePieceIdx == afterPieceIdx || afterPieceIdx >= this._pieceValidMarks.length)
		{				
			if(!this._subpieceCountOfPieces[prePieceIdx]) 
					this._subpieceCountOfPieces[prePieceIdx]=0;
			++this._subpieceCountOfPieces[prePieceIdx];
			
			return this.checkPiece(prePieceIdx, droppedSubpieces) ?  Common.ADD_RESULT_OK : Common.ADD_RESULT_CHECKSUM_MISMATCH;
		}
		
		if (!this._pieceValidMarks[prePieceIdx])
		{
			if(!this._subpieceCountOfPieces[prePieceIdx]) 
				this._subpieceCountOfPieces[prePieceIdx]=0;
			++this._subpieceCountOfPieces[prePieceIdx];
			
			if (!this._pieceValidMarks[afterPieceIdx])
			{
				if(!this._subpieceCountOfPieces[afterPieceIdx]) 
					this._subpieceCountOfPieces[afterPieceIdx]=0;
				++this._subpieceCountOfPieces[afterPieceIdx];
				
				return this.checkPiece(prePieceIdx, droppedSubpieces) && this.checkPiece(afterPieceIdx, droppedSubpieces) ?  Common.ADD_RESULT_OK : Common.ADD_RESULT_CHECKSUM_MISMATCH;
			}
		}
	}
	
	addSubpieceWithoutHeader(idx, droppedSubpieces)
	{
		if (idx >= this._subpieceMarks.length)
		{
			this._subpieceMarks.length = idx + 1;
		}
			
		if (this._subpieceMarks[idx])
		{
			return Common.ADD_RESULT_IGNORED;
		}
			
		this._subpieceMarks[idx] = true;	
		
		let prePieceIdx = this.getPrePieceIdxOfSubpiece(idx);
		let afterPieceIdx = this.getAfterPieceIdxOfSubpiece(idx);
		
		if (afterPieceIdx >= this._subpieceCountOfPieces.length)
		{
			this._subpieceCountOfPieces.length = afterPieceIdx + 1;
			this._subpieceCountOfPieces[afterPieceIdx] = 0;
		}
			
		++this._subpieceCountOfPieces[prePieceIdx];
		if (prePieceIdx != afterPieceIdx)
		{
			++this._subpieceCountOfPieces[afterPieceIdx];
		}
		
		if(this._subpieceCountOfPieces[0] == this.SUBPIECE_COUNT_OF_HEADER)
		{
			if (!this.checkHeader(droppedSubpieces))
			{
				
				return Common.ADD_RESULT_CHECKSUM_MISMATCH;
			}
			
			this._data = new ArrayBuffer((this._header.data_length + this._headData.byteLength));
			let stashArray = new Uint8Array(this._data, 0, this._data.byteLength);	
			stashArray.set(new Uint8Array(this._headData), 0);
			stashArray.set(new Uint8Array(this._resetHeadData), this._headData.byteLength);
			//header is downloaded, adjust length of manage infos
			this._pieceValidMarks.length = this._header.piece_checksums.length + 1; // +1 for header
				
			this._subpieceMarks.length = Math.floor((this._header.blockLength() + Common.SUBPIECE_SIZE - 1) / Common.SUBPIECE_SIZE);
			this._subpieceCountOfPieces.length = this._header.piece_checksums.length + 1;
				
				let subpieceCountOfLastPiece = 0;
				
				for (let first = this.getFirstSubpieceIdxOfPiece(this._subpieceCountOfPieces.length - 1),
							last = this.getLastSubpieceIdxOfPiece(this._subpieceCountOfPieces.length - 1, this._header.blockLength);
						 first <= last;
						++first)
				{
					if (this._subpieceMarks[first])
					{
						++subpieceCountOfLastPiece;
					}
				}
				
				this._subpieceCountOfPieces[this._subpieceCountOfPieces.length - 1] = subpieceCountOfLastPiece;
				
				let result = Common.ADD_RESULT_OK;
				
				// check pieces
				for (let i = 1, len = this._subpieceCountOfPieces.length; i < len; ++i)
				{
					if (!this.checkPiece(i, droppedSubpieces))
					{
						result = Common.ADD_RESULT_CHECKSUM_MISMATCH;
					}
				}
				
				return result;
		}
		
		return Common.ADD_RESULT_OK;
	}
	
	checkHeader(droppedSubpieces)
	{
		this._header = fromBytes(this._headData);	
		if (this._header && this._header.rid == this._rid.toString().toUpperCase() &&  this._header.blockId ==  this.blockId)
		{			
			this._pieceValidMarks[0] = true;				
			return true;
		}
		this._header = null;
		
		for (let i = 0; i < this.SUBPIECE_COUNT_OF_HEADER; ++i)
		{
			this._subpieceMarks[i] = false;
		}
			
		if (droppedSubpieces)
		{
			for (let i = 0; i < this.SUBPIECE_COUNT_OF_HEADER; ++i)
			{
				droppedSubpieces.push(i);
			}
		}
			
		this._subpieceCountOfPieces[0] = 0;
		let afterPieceIdx = this.getAfterPieceIdxOfSubpiece(this.SUBPIECE_COUNT_OF_HEADER - 1);
		if (afterPieceIdx == 1)
		{
			--this._subpieceCountOfPieces[afterPieceIdx];
		}	
		return false;
	}
	
	checkPiece(pieceIdx, droppedSubpieces)
	{
		if (this._pieceValidMarks[pieceIdx])
		{
			return true;
		}
		
		let expectedSubpieceCount = this.getSubpieceCountOfPiece(pieceIdx);

		if (!this._subpieceCountOfPieces[pieceIdx] || this._subpieceCountOfPieces[pieceIdx] < expectedSubpieceCount)
		{
			return true;
		}
		
		let pieceSize = (pieceIdx == this._header.pieceCount ?  this._header.data_length - (pieceIdx - 1) * Common.PIECE_SIZE : Common.PIECE_SIZE);
			
		if (!this._validatePieceChecksum || CRCChecksum(this._data, Common.HEADER_SIZE + (pieceIdx - 1) * Common.PIECE_SIZE, pieceSize)
			== this._header.getChecksumOfPiece(pieceIdx - 1))
		{
			++this._completedPieces;
			this._pieceValidMarks[pieceIdx] = true;
			
			return true;
		}			
	}
	
	getPrePieceIdxOfSubpiece(subpieceIdx)
	{
		return this.getPieceIdxOfByte(subpieceIdx * Common.SUBPIECE_SIZE);
	}
		
	getAfterPieceIdxOfSubpiece(subpieceIdx)
	{
		return this.getPieceIdxOfByte((subpieceIdx + 1) * Common.SUBPIECE_SIZE - 1);
	}
	
	getPieceIdxOfByte(byteIdx)
	{
		if (byteIdx < Common.HEADER_SIZE)
		{
			return 0;
		}
		
		return parseInt(1 + (byteIdx - Common.HEADER_SIZE) / Common.PIECE_SIZE);
	}
	
	getFirstSubpieceIdxOfPiece(pieceIdx)
	{
		let byteIdx = (pieceIdx == 0 ?  0 : Common.HEADER_SIZE + (pieceIdx - 1) * Common.PIECE_SIZE);
		
		return parseInt(byteIdx / Common.SUBPIECE_SIZE);
	}
		
	getLastSubpieceIdxOfPiece(pieceIdx, blockLength)
	{
		let byteIdx = Common.HEADER_SIZE + pieceIdx * Common.PIECE_SIZE - 1;
			
		if (byteIdx >= blockLength)
		{
			byteIdx = blockLength - 1;
		}
			
		return parseInt(byteIdx / Common.SUBPIECE_SIZE);
	}
	
	getSubpieceCountOfPiece(pieceIdx)
	{
		return this.getLastSubpieceIdxOfPiece(pieceIdx, this._header.blockLength()) - this.getFirstSubpieceIdxOfPiece(pieceIdx) + 1;
	}
	
	isPieceValid(idx) 
	{ 
		++idx; 
		return idx < this._pieceValidMarks.length && this._pieceValidMarks[idx];
	}
	
	get pieceCount()
	{ 
		return this._header ?  this._header.pieceCount : 0; 
	}

	getPiece(idx)
	{
		if (this.isPieceValid(idx))
		{
			let pieceStart = Common.HEADER_SIZE + idx * Common.PIECE_SIZE;
			let pieceSize = (idx + 1 == this._header.pieceCount ?  this._header.data_length - idx * Common.PIECE_SIZE : Common.PIECE_SIZE);
			let piece = new Uint8Array(this._data, pieceStart, pieceSize);
			return piece;
		}
		
		return null;
	}
	
	get dataLength() { 
		return this._header ?  this._header.data_length : 0; 
	}
}