import {Common} from '../../common/CommonUtils';

export default class SubPiece{
	constructor(blockIndex = 0, subPieceIndex = 0) {
        this.blockIndex = blockIndex;
        this.subPieceIndex = subPieceIndex;
        this.offset = 0;
        this._updateOffset();
    }

    get subPieceIndexInResource()
     { return this.blockIndex * Common.SUBPIECE_NUM_PER_BLOCK +  this.subPieceIndex; }

     moveToNextSubPiece()
     {
         ++this.subPieceIndex;
         if (this.subPieceIndex == Common.SUBPIECE_NUM_PER_BLOCK)
         {
             ++this.blockIndex;
             this.subPieceIndex = 0;
         }
         
         this._updateOffset();
     }
     
    _updateOffset()
    {
        this.offset = this.blockIndex * Common.BLOCK_SIZE + this.subPieceIndex * Common.VOD_SUBPIECE_SIZE;
    }


}