import Global from "../../../cn/pplive/player/manager/Global";
import {Common} from '../../common/CommonUtils';

export default class BlockTaskDispatcher{
	constructor(streamBuffer, taskManager) {
//		Global.debug('creat BlockTaskDispatcher')
		this._streamBuffer = streamBuffer;
		this._taskManager = taskManager;
		this._currentUsedBlock = 0;
		this._restPlayTime = 0;
		this._delay = 0;
		this._endtime = 0;
		this._timeDiffBetweenStandardAndLocal = 0;
		this._stat = {};
	}
	
	set currentUsedBlock(block) {this._currentUsedBlock = block; }
	
	set restPlayTime(ptime) { this._restPlayTime = ptime;}
	
	set delay(d){ this._delay = d;}
	
	set endtime(t) { this._endtime = t; }
	
	set timeDiffBetweenStandardAndLocal(diff) { this._timeDiffBetweenStandardAndLocal = diff; }	
	get timeDiffBetweenStandardAndLocal() { return this._timeDiffBetweenStandardAndLocal; }
	
	get standardTime() { return ((new Date).getTime() / 1000) + this._timeDiffBetweenStandardAndLocal; }
	
	get stat() { return this._stat; }
	
	onReceiveSubpiece(sender, subpiece, length){ }
	
	reset()
	{
		this._taskManager.dropAllTasks();
	}
	
	onComplete(block)
	{
		this._taskManager.dropTask(block);		
//		this.dispatchDownloadTasks();
	}
	
	onHttpError(type, block) { 
		this._taskManager.dropTask(block); 
	} // tobe overrided
	
	onChecksumFailed(blockid, droppedSubpieces)
	{
		if (this._taskManager.getTaskType(blockid) == Common.TASK_TYPE_HTTP)
			{
				this.onHttpError(Common.HTTP_DOWNLOAD_DATA_ERROR, blockid);
			}
			else
			{
				this._taskManager.onChecksumFailed(blockid, droppedSubpieces);
			}
	}
		
	
	get nextBlockToDownload()
	{
		let blockid = this._currentUsedBlock;
		
		while (true)
		{
			let block = this._streamBuffer.getBlock(blockid, false);
			
			if (block && (block.isComplete || block.status.isUnAvailable))
			{
				blockid += this._taskManager.blockInterval;
			}
			else
			{
				break;
			}
		}
		
		return blockid;
	}
	
	dispatchDownloadTasks() {} // tobe overrided
	
	get currentMode()
	{
		return 'NONE';
	}
}