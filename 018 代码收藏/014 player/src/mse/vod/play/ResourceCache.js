import SubPiece from '../play/SubPiece';
import {Common} from '../../common/CommonUtils';
import {Stream} from "../../../cn/pplive/player/crypto/stream";
import {getSubPieceCountInBlock, getSubPieceCountByFileLength,getSubPieceCountInPiece} from '../../utils/StructUtil';
import Global from "../../../cn/pplive/player/manager/Global";
//import Piece from './Piece';

export default class ResourceCache{
	constructor(length, headLength,segmentIndex) {
        this.length = length;
        this.headLength = headLength;
        this._drmDecoder = null;//rdm加密
       	this._resourceSubpiece = [];
        this._resourceSubpiece.length = getSubPieceCountByFileLength(length,Common.VOD_SUBPIECE_SIZE);
        this.segmentIndex = segmentIndex;
    }

    set drmDecoder(decoder) {
        this._drmDecoder = decoder;
    }
    
    get isDrmSetup() {
        return this._drmDecoder != null;
    }
    
    isLastSubPiece(subPiece){
    	return  subPiece.subPieceIndexInResource == this._resourceSubpiece.length;
    }

    addSubPiece(subPiece, data)
    {
        let idx = subPiece.subPieceIndexInResource;
        if (idx < this._resourceSubpiece.length)
        {
            if (this._resourceSubpiece[idx] == undefined)
            {
            	this._resourceSubpiece[idx] = data;          		            
                return true;
            }
            else 
            {
                Global.debug("add subpiece exist");
                return false;	
            }
        }
        else
        {
            Global.debug("add subpiece, out of range: " + this._resourceSubpiece.length + ", " + idx);
            return false;
        }
        subPiece = null;
        data = null;
    }
    
    getFirstSubPieceMissed(offset)
    {
        let subPiece = new SubPiece(parseInt(offset / Common.BLOCK_SIZE), parseInt((offset % Common.BLOCK_SIZE) / Common.VOD_SUBPIECE_SIZE));
        if (!this.hasSubPiece(subPiece))
        {
            return subPiece;
        }

        while (this.hasSubPiece(subPiece))
        {
            subPiece.moveToNextSubPiece();
        }
        
        let idx = subPiece.subPieceIndexInResource;
        
        if(subPiece.subPieceIndexInResource >= this._resourceSubpiece.length) subPiece = null;
        
        return subPiece;
    }
    
//  deleteSubPiece(subPiece)
//  {
//  	let idx = subPiece.subPieceIndexInResource;
//      
//      if (idx < this._resourceSubpiece.length)
//      {
//      	this._resourceSubpiece[idx] = null;
//      }
//  }

    hasSubPiece(subPiece)
    {
        let idx = subPiece.subPieceIndexInResource;
        
        return idx < this._resourceSubpiece.length && this._resourceSubpiece[idx];
    }

    getSubPiece(subPiece)
    {
        let idx = subPiece.subPieceIndexInResource;
        
        if (idx < this._resourceSubpiece.length && this._resourceSubpiece[idx] && this._resourceSubpiece[idx] != 1)
        {
        	if(this._resourceSubpiece[idx] != 1)
        	{
        		let bytes = new Stream();
	            let size = (idx + 1 == this._resourceSubpiece.length && this.length % Common.VOD_SUBPIECE_SIZE) ?  this.length % Common.VOD_SUBPIECE_SIZE : Common.VOD_SUBPIECE_SIZE;        
	            bytes.writeBytes(this._resourceSubpiece[idx],0,size);            
	            return this._drmDecoder ?  this._drmDecoder.decode(subPiece, bytes) : bytes;
        	}
            else
            {
            	Global.debug("have pushed subpiece");
            	return null;
            }
        }
        
        return null;
    }

    clearResourceCache(){
        let i;
        for (i in this._resourceSubpiece) {
            this._resourceSubpiece[i] = null;
        }      
    }

	destroy(){
        this.clearResourceCache();
		this._drmDecoder = null;//rdm加密
		this._resourceSubpiece = null;
        this._drmDecoder = null;
	}
}