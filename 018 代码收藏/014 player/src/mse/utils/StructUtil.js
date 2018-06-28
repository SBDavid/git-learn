import {Common} from '../common/CommonUtils';

function getSubPieceCountByFileLength(fileLength, subpiceSize)
{
    return Math.ceil(fileLength / subpiceSize);
}

function getBlockCountByFileLength(fileLength)
{
    return Math.ceil(fileLength / Common.BLOCK_SIZE);
}

function getPieceCountByFileLength(fileLength)
{
    return Math.ceil(fileLength / Common.PIECE_SIZE);
}

function getSubPieceCountInBlock(fileLength, blockIndex)
{
    let lastBlockIndex = getBlockCountByFileLength(fileLength) - 1;
    
    if (blockIndex == lastBlockIndex)
    {
        if (fileLength % Common.BLOCK_SIZE == 0)
            return Common.SUBPIECE_NUM_PER_BLOCK;
        return Math.ceil((fileLength % Common.BLOCK_SIZE) / Common.SUBPIECE_SIZE);
    }
    else if (blockIndex < lastBlockIndex)
        return Common.SUBPIECE_NUM_PER_BLOCK;
    
    return 0;
}


export {
	getSubPieceCountInBlock,getSubPieceCountByFileLength,getPieceCountByFileLength
}