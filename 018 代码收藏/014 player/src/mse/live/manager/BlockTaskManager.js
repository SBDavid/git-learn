import {Common,CommonUtils} from '../../common/CommonUtils'
import HTTPDownloader from '../download/HTTPDownloader.js'
import MSEEvents from '../../event/mse-events.js';
import Global from "../../../cn/pplive/player/manager/Global";
import EventEmitter from 'events';

export default class BlockTaskManager{
	constructor(subpieceReceiver,streamBuffer,playData,config) {
//		Global.debug('creat BlockTaskManager')
		this._tasks = {};
		this._streamBuffer = streamBuffer;
		this._playData = playData;
		this.subpieceReceiver = subpieceReceiver;
		this._httpDownloader = new HTTPDownloader(this.subpieceReceiver,this._playData.host,this._playData.backhost,this._playData.rid,this._playData.variables,config);
		this._httpDownloader.on(MSEEvents.HTTP_DOWNLOAD_DATA_ERROR, this._onHttpError)
		this._preHttpErrorTime = 0;
	}
	
	get blockInterval(){
		return parseInt(this._streamBuffer.blockInterval);
	}
	
	//任务总数
	get taskCount()
	{
		let count = 0;
		
		for (let k in this._tasks)
		{
			++count;
		}
		
		return count;	
	}
	
	createHTTPTask(blockid) 
	{ 
		let block = this._streamBuffer.getBlock(blockid, false);
		let time;
		if(block && block.status && block.status.httpDownloadErrorCount > 5)
			time = 5 * 1000;
		else
			time = 1 * 1000;
		if(this._preHttpErrorTime > 0 && ((new Date().getTime() - this._preHttpErrorTime) < time))
		{
			 return;
		}
		this.doCreateTask(blockid, false); 
	}
	
	doCreateTask(blockid, p2p)
	{		
		let block = this._streamBuffer.getBlock(blockid, true);
		let task = new HTTPBlockTask(block, this._httpDownloader);
		task.on(MSEEvents.HTTP_DOWNLOAD_TIMEOUT, this._onHttpError)
		this._tasks[blockid] = task;
		task.start();
//		Global.debug('doCreateTask >>>>>>>>>time='+ new Date().getTime()  + ",block : " + CommonUtils.timeFormat(blockid*1000, true)+ ",blockID: " + blockid);
	}
	
	dropTasksBefore(blockid)
	{
		for (let bid in this._tasks)
		{
			if (bid < blockid)
			{
				this.dropTask(bid);
			}
		}
	}
	
	dropTask(blockid)
	{
		let task = this._tasks[blockid];
		
		if (task != null)
		{
			task.off(MSEEvents.HTTP_DOWNLOAD_TIMEOUT, this._onHttpError)
			task.destroy();
			delete this._tasks[blockid];
		}
	}
	
	dropAllTasksBasedOnType(taskType)
	{
		for (let bid in this._tasks)
		{
			let task = this._tasks[bid];
			
			if (this.getTaskType(bid) == taskType)
			{
				this.dropTask(bid);
			}
		}
	}
	
	dropAllTasks()
	{
		for (let blockid in this._tasks)
		{
			this.dropTask(blockid);
		}
		
		this._tasks =  {};
		this._httpDownloader.stop();		
	}
	
	getTaskType(blockid)
	{
		let task = this._tasks[blockid];
		
		if (task != null)
		{
			return (task instanceof HTTPBlockTask) ?  Common.TASK_TYPE_HTTP : Common.TASK_TYPE_P2P;
		}
		
		return Common.TASK_TYPE_NULL;
	}
	
	_onHttpError = (type, blockid) =>
	{ 		
		let block = this._streamBuffer.getBlock(blockid, false);
		if(!block) return;
		switch(type)
		{
			case MSEEvents.HTTP_DOWNLOAD_DATA_ERROR:
//				Global.debug('下载数据错误 blockid= ' + blockid)
				block.status.httpDownloadErrorCount ++ ;
				this._preHttpErrorTime = new Date().getTime();
				this._httpDownloader.switchHost();
			break;
			case MSEEvents.HTTP_DOWNLOAD_TIMEOUT:
//				Global.debug('下载数据超时 blockid= ' + blockid)
				block.status.httpHasTimeouted = true;				
			break;
		}

		this.dropTask(blockid); 
	} 
	
	destroy()
	{	
		this.dropAllTasks();
		this._httpDownloader.off(MSEEvents.HTTP_DOWNLOAD_DATA_ERROR, this._onHttpError)
		this._httpDownloader.destroy();
		this._httpDownloader = null;
		this._streamBuffer = null;
		this._playData = null;
		this._preHttpErrorTime = 0;
	}
}


class HTTPBlockTask{
	constructor(block, httpDownloader) {
		this._block = block;
		this._block.status.isDownloading = true;
		this._httpDownloader = httpDownloader;
		this._timer = 0;//超时定时器
		this._emitter = new EventEmitter();
	}
	
	destroy()
	{			
		if(this._block.status) this._block.status.isDownloading = false;
		this._block = null;
		this._httpDownloader.stop();
		this._emitter.removeAllListeners();
        this._emitter = null;
        clearTimeout(this._timer);
	}
	
	on(event, listener) {
        this._emitter.addListener(event, listener);
    }

    off(event, listener) {
        this._emitter.removeListener(event, listener);
    }
	
	start()
	{
		this._httpDownloader.open({duration:5, block:this._block.blockId });
		this._timer = setTimeout(
				() => {					
				 this._emitter.emit(MSEEvents.HTTP_DOWNLOAD_TIMEOUT, MSEEvents.HTTP_DOWNLOAD_TIMEOUT,this._block.blockId);				
				},20 * 1000
			);
	}
}
