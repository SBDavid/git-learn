import Block from './Block.js'
import Global from "../../../cn/pplive/player/manager/Global";

//block保存
export default class StreamBuffer{
	constructor(rid, blockInterval) {
//		Global.debug('creat StreamBuffer')
		this._rid = rid
		this.blockInterval = blockInterval;
		this.isPlaying = false;
		this.currentUsedBlock = 0;//当前正在下载的block
		this._blocks = {};
	}
	
	getBlock(blockid, create = true)
	{
		let block = this._blocks[blockid];
		
		if (!block && create)
		{
			block = new Block(this._rid, blockid, true);
			this._blocks[blockid] = block;
		}
		
		return block;
	}
	
	dropBlockbyId(blockid)
	{
		let block = this._blocks[blockid];
		if(block)
		{
			block.destroy();
			this._blocks[blockid] = null;
			delete this._blocks[blockid];
		}
	}
	
	dropBlocksPreTime(time)
	{
		
		for (let id in this._blocks)
		{
			if (id < time && this._blocks[id].status.isDroppable)
			{
				this.dropBlockbyId(id);
			}
		}
	}
	
	 destroy(){
	 	for (let id in this._blocks)
		{
			this.dropBlockbyId(id);
		}
	 }
}