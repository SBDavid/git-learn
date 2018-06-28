import BlockTaskDispatcher from './BlockTaskDispatcher.js'
import {Common} from '../../common/CommonUtils'
import Global from "../../../cn/pplive/player/manager/Global";

export default class HTTPOnlyBlockTaskDispatcher extends BlockTaskDispatcher{
	constructor(streamBuffer, taskManager) {
		super(streamBuffer,taskManager);
//		Global.debug('creat HTTPOnlyBlockTaskDispatcher')
		this._preHttpErrorTime = 0;
	}
	
	dispatchDownloadTasks(){
		if (this._restPlayTime >= Common.DOWNLOAD_MAX_REST_PLAY_TIME)
		{
			return;
		}
		
		if (this._preHttpErrorTime > 0)
		{
			var waitTime = this.restPlayTime > this.delay / 2 ?  this._taskManager.blockInterval + 1 : 1;
			
			if (getTimer() < this._preHttpErrorTime + waitTime * 1000)
			{
				return;
			}
		}
		
		this._taskManager.dropTasksBefore(this._currentUsedBlock);
		
		var blockid = this._currentUsedBlock;
		
		if (this._taskManager.taskCount == 0)
		{
			var newestAvailable = parseInt(this.standardTime() - this._delay * 1 / 3);
			
			if (this._endtime > 0 && this._endtime < newestAvailable)
			{
				newestAvailable = this._endtime;
			}
			
			while (blockid < newestAvailable)
			{
				var block = this._streamBuffer.getBlock(blockid, false);
				
				if (block && (block.isComplete || block.status.isUnAvailable))
				{
					blockid += parseInt(this._taskManager.blockInterval);
					continue;
				}
				
				this._taskManager.createHTTPTask(blockid);
				break;
			}
		}
	}
	
	standardTime() 
	{ 
		return (new Date().getTime()) / 1000 + this.timeDiffBetweenStandardAndLocal;
	}
	 
	onComplete(block)
	{
		this._taskManager.dropTask(block);
		
		this.dispatchDownloadTasks();
	}
}