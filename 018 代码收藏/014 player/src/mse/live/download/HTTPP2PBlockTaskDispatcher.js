import BlockTaskDispatcher from './BlockTaskDispatcher.js'
import {Common,CommonUtils} from '../../common/CommonUtils'
import Global from "../../../cn/pplive/player/manager/Global";

export default class HTTPP2PBlockTaskDispatcher extends BlockTaskDispatcher{
	constructor(streamBuffer, taskManager,bwType) {
		super(streamBuffer,taskManager);
		this._bwType = bwType;
		this._useHttp = false;
		this._useP2P = false;
		this._diffBetweenStandardTimeAndNewestBlock = taskManager.blockInterval;
		this._stat.HTTPP2P = new Stat();
		this._startTime = 0;
		this._httpStartTime = 0;
		this._p2pStartTime = 0;
		this._leastPlayTimeToAchieveUseHTTP = 0;
	}
 	set currentUsedBlock(block) 
 	{
		this._currentUsedBlock = block; 
 	}
	
	dispatchDownloadTasks(){
		if (this._startTime == 0)
		{
			this._startTime = new Date().getTime();
		}
		this.switchIfNeeded();
		this.doDispatch();
	}	
	
	 doDispatch()
	 {
	 	this._taskManager.dropTasksBefore(this._currentUsedBlock);
		let blockid = this._currentUsedBlock;
		let block;
		
		if (this._useP2P)
		{
		}
		else if (this._useHttp)
		{			
			this._taskManager.dropAllTasksBasedOnType(Common.TASK_TYPE_P2P);
			
			if (this._taskManager.taskCount == 0)
			{				
				while (blockid <= this.latestBlockAvailable)//latestBlockAvailable 是当前时间最近的可下载block时间戳
				{
					block = this._streamBuffer.getBlock(blockid, false);
					
					if (block && (block.isComplete || block.status.isUnAvailable))
					{
						blockid += this._taskManager.blockInterval;
						continue;
					}
					this._taskManager.createHTTPTask(blockid);
					
					break;
				}
			}
		}
	 }

	switchIfNeeded()
	{
		if (this._restPlayTime >= Common.DOWNLOAD_MAX_REST_PLAY_TIME)
		{
			this.pauseHttp();
			this.pauseP2P();		
			return;
		}
		
		if (!this._useHttp && !this._useP2P)
		{
			this.checkStateUseNone();
		}
		else if (this._useHttp && !this._useP2P)
		{
			this.checkStateUseHttp();
		}
		else if (!this._useHttp && this._useP2P)
		{
			this.checkStateUseP2P();
		}
		else
		{
			// 当前HTTP、P2P不会同时下载；
		}
	}
	
	checkStateUseNone()
	{
		if (this._restPlayTime >= 90)
		{
			return;
		}
		
		if (this._restPlayTime >= 15) // _restPlayTime稍微<90，或者刚起动并且广告时间 >=15
		{
			this.resumeP2P();
		}
		else
		{
			// 刚起动并且无广告或广告太短：只通过HTTP下载尽可能少的数据 ：3个block
			this._leastPlayTimeToAchieveUseHTTP = Common.DOWNLOAD_START_P2P_REST_PLAY_TIME;//3 * this._taskManager.blockInterval;
			this.resumeHttp();
		}
	}
	
	checkStateUseHttp()
	{
			if (this._restPlayTime > this._leastPlayTimeToAchieveUseHTTP || // 剩余播放时间已足够
			(this._endtime < 0 && this._currentUsedBlock + this._taskManager.blockInterval >= this.latestBlockAvailable) || // 非回看模式下，已下载到最新数据附近
			  (
				  (new Date().getTime() - this._startTime) / 1000 < Common.START_STAGE_LENGTH &&
				  (new Date().getTime() - this._startTime) / 1000 + 3 * this._taskManager.blockInterval <= this._restPlayTime &&
				  this._taskManager.getTaskCountByType(Common.TASK_TYPE_HTTP) == 0
			  ) // 起动阶段最多只从CDN多下载3个block
			  ||
			  (
				  this._httpStartTime + Common.DOWNLOAD_START_P2P_REST_PLAY_TIME * 1000 < new Date().getTime()
			  ) // HTTP已经长时间运行，但仍未达到切换条件：服务器或用户带宽不足；而此时P2P状态比较好
			)
		{
//			Global.debug("switch to p2p");
			
			this.pauseHttp();
			this.resumeP2P();
		}
	}
	
	checkStateUseP2P()
	{		
		if (this._restPlayTime < Common.DOWNLOAD_RESUME_HTTP_REST_PLAY_TIME) // 非大上传模式下的衰减
		{
			this._leastPlayTimeToAchieveUseHTTP = Common.DOWNLOAD_START_P2P_REST_PLAY_TIME;
			
//			Global.debug("switch to http");
			
			this.pauseP2P();
			this.resumeHttp();
		}
	}

	 
	resumeHttp()
	{
		if (!this._useHttp)
		{
			this._useHttp = true;
			this._httpStartTime = new Date().getTime();		
			this._stat.HTTPP2P.onResumeHTTP();
		}
	}
	
	resumeP2P()
	{
		if (!this._useP2P)
		{
			this._useP2P = true;
			this._p2pStartTime = new Date().getTime();
			
			this._stat.HTTPP2P.onResumeP2P();
		}
	}
		
	pauseHttp()
	{
		if (this._useHttp)
		{
			this._useHttp = false;
			this._stat.HTTPP2P.onPauseHTTP();
		}
	}
	
	pauseP2P()
	{
		if (this._useP2P)
		{
			this._useP2P = false;
			this._stat.HTTPP2P.onPauseP2P();
		}
	}
	
	 get latestBlockAvailable()
	{
		let latestBlock = parseInt(this.standardTime - this._diffBetweenStandardTimeAndNewestBlock);
		
		if (this._endtime > 0 && this._endtime < latestBlock)
		{
			latestBlock = this._endtime;
		}
		
		let a = parseInt(latestBlock / this._taskManager.blockInterval) * this._taskManager.blockInterval;
		return a;
	}
	
	set restPlayTime(time)
	{
		this._restPlayTime = time;
	}
}




class Stat
{
	constructor() {
//		Global.debug('creat Stat');
		this._useHTTP=false;
		this._useP2P=false;
		this._resumeHTTPTimes = 0;
		this._resumeP2PTimes = 0;
		this._isStartedUsingHTTP=false;
	}
	
	 onPauseHTTP() { this._useHTTP = false; }	 
	 onPauseP2P() { this._useP2P = false; }
	 
	 onResumeHTTP()
	{
		++this._resumeHTTPTimes;
		this._useHTTP = true;
		
		if (this._resumeHTTPTimes == 1 && this._resumeP2PTimes == 0)
		{
			this._isStartedUsingHTTP = true;
		}
	}
	
	onResumeP2P()
	{ 
		this._useP2P = true; 
		++this._resumeP2PTimes;
	}
}