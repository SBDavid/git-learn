import Global from "../../../cn/pplive/player/manager/Global";
import CDNChecker from "../download/CDNChecker"
import ResourceDownloader from "../download/ResourceDownloader";
import StreamGenerator from "../remux/StreamGenerator";
import FMP4Remuxer from '../remux/FMP4Remuxer.js';
import Mp4Stream from '../remux/Mp4Stream';
import MSEEvents from '../../event/mse-events.js';
import ResourceCache from "../play/ResourceCache";
import EventEmitter from 'events';
import {Common} from '../../common/CommonUtils';
import SubPiece from '../play/SubPiece';

export default class VodPlayManager{
	constructor(player) {
//		Global.debug('creat VodPlayManager playInfo>>>',playInfo)	
		this._emitter = new EventEmitter(); 
		this._player = player;
		this._downloader = null;
		this._cdnChecker = null;
		this._streamGenerator = null;
		this._playInfo = null;
		this._segmentTimeOffsetArray = [];
		this._resources = [];
		this._generators = [];
		this._downLoaders = [];
		this.currentTime = 0;
		this.seekTime = 0;
		this._restPlayTime = 0;//播放剩余时间
		this._bufferEnd = 0;//缓冲时间
		this._isPaused = false;		
		this._fmp4 = new FMP4Remuxer();
		this._fmp4.onInitSegment = this._initSegment;
        this._fmp4.onMediaSegment = this._mediaSegment;
	}
	
	start(playInfo)
	{
		this._playInfo = playInfo;
		if(!this._playInfo.segments || this._playInfo.segments.length == 0) //没有分段信息
		{
			Promise.resolve().then(() => { 
        	if(this._emitter) 
        	{
        		this._emitter.emit(MSEEvents.PLAY_FAILED);
        	}         	
        });
			
		}
		let timeOffset = 0;
		for (let i = 0; i < this._playInfo.segments.length; ++i)
		{
			this._segmentTimeOffsetArray.push(timeOffset);
			timeOffset += this._playInfo.segments[i].duration;
			timeOffset = parseInt(timeOffset * 100) / 100;
		}
		
		if (this._cdnChecker == null) {
			this._startCDNChecker();
		}
	}
	
	updataTime(seek)
    {
        if(!this.hasPendingBytes) 
        {	      
        	if(Math.abs(this._playInfo.duration - this._player.currentTime) < 1)
        	{
        		this._emitter.emit(MSEEvents.PLAY_COMPLETE);			 
        	}
        	return;
        }//播放完成
        if (this._cdnChecker == null) {
            this._startCDNChecker();
        }        
        let bufferInfo = this.bufferInfo(seek?this.seekTime : this._player.currentTime);
        this._bufferEnd = bufferInfo.end;
        if(this._downloader)
        {
            if(bufferInfo.nextStart != undefined)
            {
                this._nextStart = bufferInfo.nextStart;
            }
            else
            {
                if(this._nextStart != undefined)
                {
                    let segmentIndex = this._findSegmentIndexFromTime(this._bufferEnd);
                    if(segmentIndex == this._streamGenerator.segmentIndex)
                    {
                        let offset = this._streamGenerator.getTimeSampleInfo(this._bufferEnd - this._segmentTimeOffsetArray[segmentIndex]);
                        if(this._downloader.offset + Common.BLOCK_SIZE <  offset)
                        {
                            this._streamGenerator.seek(this._bufferEnd - this._segmentTimeOffsetArray[segmentIndex],this._bufferEnd - this._segmentTimeOffsetArray[segmentIndex]);
                        }
                        this._nextStart = undefined;
                    }
                }
            }
			this._downloader.restPlayTime = this._restPlayTime = bufferInfo.len;
        }
        let idx = this._streamGenerator.segmentIndex + 1;
        if (!seek && idx < this._playInfo.segments.length &&  this._player.currentTime > this._segmentTimeOffsetArray[idx])
        {
            this._creatNextStreamGenerator();
        }
    }
	
	get buffer(){
		return this._bufferEnd;
	}

	play(startTime = 0)
	{
		Global.debug("play from " + startTime + " seconds.");
		
		if (startTime > this._playInfo.duration)
		{
			Global.debug("invalid starttime: " + startTime + ", change to 0");
			startTime = 0;
		}
		if (startTime < 0.1)
		{
			startTime = 0;
		}
		
		this.currentTime = startTime;
		this.seekTime = startTime;
		this._seekNotifyListener();
	}

	seekVideo(seekTime)
	{
		if (seekTime > this._playInfo.duration - 3)
		{
			seekTime = this._playInfo.duration - 3;
		}
		else if (seekTime < 0.1)
		{
			seekTime = 0;
		}
		
		this.seekTime = seekTime;
		this._seekNotifyListener();
	}
	
	reportDacLog(){
		
	}
	
	pause() {  // take a rest
        this._isPaused = true;
    }

    resume() {
        this._isPaused = false;
    }
	
	get hasPendingBytes()
	{
		return this._streamGenerator != null;
	}
	
    on(event, listener) {
        this._emitter.addListener(event, listener);
    }

    off(event, listener) {
        this._emitter.removeListener(event, listener);
    }
	
	destroy(){
		this._emitter.removeAllListeners();
		this._emitter = null;
		this._player = null;
		this._destroyDownloader();
		this._destroyStreamGenerator();
		this._cdnChecker = null;
		this._isPaused = false;
		this._segmentTimeOffsetArray = null;	
		if(this._fmp4)
		{
			this._fmp4.destroy();
			this._fmp4 = null;
		}
		
		let i;
		for(i = 0 ; i < this._generators.length; i++ )
		{
			if(this._generators[i])
			{
				this._generators[i].resource.clearResourceCache();
				this._generators[i].destroy();
				this._generators[i] = null;
			}			
		}
		this._generators = null;	
		
		for(i = 0 ; i < this._downLoaders.length; i++ )
		{
			if(this._downLoaders[i])
			{
				this._downLoaders[i].destroy();
				this._downLoaders[i] = null;
			}			
		}
		this._downLoaders = null;			
	
		for(i = 0 ; i < this._resources.length; i++ )
		{
			if(this._resources[i])
			{
				this._resources[i].clearResourceCache();
				this._resources[i].destroy();
				this._resources[i] = null;
			}			
		}
		this._resources = null;	
	}
	
	get restPlayTime(){
		let bufferInfo = this.bufferInfo(this._player.currentTime);
		this._restPlayTime = bufferInfo.len;
		return this._restPlayTime;
   	}
	
	bufferInfo(time)
	{
		if(this._player)
		{
			let i,buffered=this._player.buffered,a=[];
			for(i=0;i<buffered.length;i++)
			{
				a.push({start:buffered.start(i),end:buffered.end(i)});
//				console.log('@@@@ buffer i=' + i + ',start=' + buffered.start(i) + ',end=' + buffered.end(i) + ',currentTime=' + this._player.currentTime);
			}			
			return this.bufferedInfo(a,time)
		}
	}
	
	bufferedInfo(buffered,e, n = 0.2)
	{
		let i,r,a,o,s,index,l=[];
		for(buffered.sort(function(buffered,e){
			let n=buffered.start-e.start;
			return n||e.end-buffered.end}),			s=0;s<buffered.length; s++)
		{
			let u=l.length;
			if(u){
				var c=l[u-1].end;
				buffered[s].start- c < n? buffered[s].end > c && (l[u-1].end=buffered[s].end):l.push(buffered[s])
			}
			else 
				l.push(buffered[s])
		}
		for(s=0,i=0,r=a=e, index=-1;s<l.length;s++)
		{
			var d=l[s].start,h=l[s].end;
			if(e+n>=d)
			{
				index = s;
			}
			if(e+n>=d&&e<h)
			{
				r=d,a=h,i=a-e,index = s;
			}				
			else if(e+n<d)
			{
				o=d;
				break	
			}
		}
		return{len:i,start:r,end:a,nextStart:o,index:index}
		}
	
	_seekNotifyListener()
	{
		Global.debug("do-seek, current-time: " + this.currentTime + ", seek-time: " + this.seekTime);
		if(this._segmentTimeOffsetArray.length == 0) return;
		
		let bufferInfo = this.bufferInfo(this.seekTime);
		let currentSegmentIndex = this._findSegmentIndexFromTime(this.currentTime);
		let segmentIndex = this._findSegmentIndexFromTime(this.seekTime);
		this._createStreamGenerator(segmentIndex, false);	           
		this._downloader.restPlayTime = this._restPlayTime = bufferInfo.len;		
//		if(bufferInfo.len == 0) this._player.currentTime = this.seekTime;
		if(this.seekTime <= bufferInfo.end) 	
		{
			if (currentSegmentIndex != segmentIndex)
			{
//				this._player.currentTime = this.seekTime;//不写，不能及时抛出buffer_empty事件
				this._streamGenerator.seek(this.seekTime - this._segmentTimeOffsetArray[segmentIndex], this.seekTime - this._segmentTimeOffsetArray[segmentIndex]);
			}
			else if(bufferInfo.len == 0)
			{				
				this._streamGenerator.seek(this.currentTime - this._segmentTimeOffsetArray[segmentIndex], this.seekTime - this._segmentTimeOffsetArray[segmentIndex]);
			}
			else
			{
				this._getRealSeekTime();//已经加载到了seek点
			}
		}
		else
		{
			this._getRealSeekTime();//已经加载到了seek点
		}

		this._streamGenerator.start();
	}

	/*
	 * idx segmentIndex
	 * justOffset 是否调整segment的offset mse中的数据可能删除了 需要调整offset
	 */
	_createStreamGenerator(idx, justOffset = true) {
		if(this._streamGenerator == null || this._streamGenerator.segmentIndex != idx)
		{
			this._destroyStreamGenerator();			
			this._createDownloader(idx);
			this._streamGenerator = this._getGenerators(idx);
			if(this._streamGenerator && justOffset)
			{
				let bufferInfo = this.bufferInfo(this._segmentTimeOffsetArray[idx]);				
				if((idx + 1 < this._segmentTimeOffsetArray.length) && (bufferInfo.end >= this._segmentTimeOffsetArray[idx + 1])) return;					
				if(bufferInfo.len > 0) 
				{
					this._streamGenerator.seek(bufferInfo.len,bufferInfo.len);
				}
			}
		}
	}
	
	_creatNextStreamGenerator(videoTimeStamp, audioTimeStamp)
	{
		if (this._streamGenerator.segmentIndex + 1 < this._playInfo.segments.length) {
			this._createStreamGenerator(this._streamGenerator.segmentIndex + 1);
			this._streamGenerator.start();
		}
		else {
			this._destroyStreamGenerator();
		}
	}

	_destroyStreamGenerator(){
		if (this._streamGenerator) {
			this._streamGenerator.off(MSEEvents.DOWNLOAD_HEADER_REQUEST, this._onDownloadHeaderRequest);
			this._streamGenerator.off(MSEEvents.DOWNLOAD_REQUEST, this._onDownloadRequest);
			this._streamGenerator.off(MSEEvents.SEGMENT_REMUX_COMPLETE, this._onSegmentRemuxComplete);
			this._streamGenerator.off(MSEEvents.GET_REALSEEKTIME, this._getRealSeekTime);
			this._streamGenerator.off(MSEEvents.MP4_HEADER_ERROR, this._mp4HeaderError); 
			this._streamGenerator.stop();

			this._streamGenerator.resource.clearResourceCache();
			this._streamGenerator.destroy();
			this._generators[this._streamGenerator.segmentIndex] = null;
			this._streamGenerator = null;		
		}
	}

	_createDownloader(idx) {
		if (this._downloader == null || this._downloader.segmentIndex != idx) {
			this._destroyDownloader();
			this._downloader = this._getDownLoader(idx);
			this._downloader.restPlayTime = this._restPlayTime;
		}
	}

	_destroyDownloader(){
		if (this._downloader) {
			// this._downloader.off(MSEEvents.SEGMENT_DOWNLOAD_COMPLETE, this._onSegmentDownLoadComplete);		
			this._downloader.off(MSEEvents.HTTP_DOWNLOAD_DATA_ERROR, this._onHttpDownloadError);		
			this._downloader = null;
		}
	}
	
	_startCDNChecker() {
		if (this._cdnChecker == null) {
			Global.debug("startCDNChecker " );
			this._cdnChecker = new CDNChecker(this._playInfo);
			this._cdnChecker.on(MSEEvents.FAIL, this._onCDNCheckFail);
			this._cdnChecker.on(MSEEvents.OK, this._onCDNCheckOK);
			this._cdnChecker.start(10);
		}
	}

	_findSegmentIndexFromTime(time)
	{
		let segmentIndex = this._segmentTimeOffsetArray.length - 1;
		for(let i = 1; i < this._segmentTimeOffsetArray.length; i ++)
		{
			if(time >= this._segmentTimeOffsetArray[i - 1] && time < this._segmentTimeOffsetArray[i])
			{
				segmentIndex = i-1;
				break;
			}
		}

		return segmentIndex;		
	}

	_getResource(idx) {
		let resource = this._resources[idx];

		if (resource == null) {
			let seg = this._playInfo.segments[idx];
			resource = new ResourceCache(seg.filesize, seg.headlength,idx);			
			this._resources[idx] = resource;
		}		
		return resource;
	}
	
	_getGenerators(idx){
		if(idx < this._playInfo.segments.length)
		{
			let g = this._generators[idx];
			let resource = this._getResource(idx);
			if(g == null)
			{
				
				g = new StreamGenerator(resource,idx, this._fmp4);
				g.setBaseTimeStamp(this._segmentTimeOffsetArray[idx] * 1000, this._segmentTimeOffsetArray[idx] * 1000);
				this._generators[idx] = g;
				
				g.on(MSEEvents.DOWNLOAD_HEADER_REQUEST, this._onDownloadHeaderRequest);
				g.on(MSEEvents.DOWNLOAD_REQUEST, this._onDownloadRequest);
				g.on(MSEEvents.SEGMENT_REMUX_COMPLETE, this._onSegmentRemuxComplete);
				g.on(MSEEvents.GET_REALSEEKTIME, this._getRealSeekTime);
				g.on(MSEEvents.MP4_HEADER_ERROR, this._mp4HeaderError); 
				g.requestHeader();
			}
			return g;
		}
		return null;
	}
	
	_getDownLoader(idx) {
		let loader = this._downLoaders[idx];

		if (loader == null) {
			let resource = this._getResource(idx);
			loader = new ResourceDownloader(resource,this._playInfo, idx);
			// loader.on(MSEEvents.SEGMENT_DOWNLOAD_COMPLETE, this._onSegmentDownLoadComplete);		
			loader.on(MSEEvents.HTTP_DOWNLOAD_DATA_ERROR, this._onHttpDownloadError);		
			this._downLoaders[idx] = loader;
		}		
		return loader;
	}	
		
	_initSegment = (type, is) => {
		this._emitter.emit(MSEEvents.INIT_SEGMENT, type, is);
	}
	
	_mediaSegment = (type, ms) => {
		this._emitter.emit(MSEEvents.MEDIA_SEGMENT, type, ms);
	}

	_onDownloadHeaderRequest = (target) => {
		if (!target.isHeadComplete()) {
			Global.debug("onDownloadHeaderRequest segmentIndex=" + target.segmentIndex);
			this._createDownloader(target.segmentIndex);
			this._downloader.requestHeader();
		}
	}

	_onDownloadRequest = (offset) => {
		Global.debug("onDownloadRequest segmentIndex=" + this._streamGenerator.segmentIndex);
		this._createDownloader(this._streamGenerator.segmentIndex);
		this._downloader.request(offset);
	}

	// _onSegmentDownLoadComplete = () => {
	// 	this._creatNextStreamGenerator();
	// }
	
	_onHttpDownloadError = () =>
	{
		this._emitter.emit(MSEEvents.PLAY_FAILED);
	}

	_mp4HeaderError = () => {
		this._emitter.emit(MSEEvents.PLAY_FAILED);
	}
	
	_onSegmentRemuxComplete = (videoTimeStamp,audioTimeStamp) =>　{
		this._creatNextStreamGenerator(videoTimeStamp,audioTimeStamp);
	}

	_getRealSeekTime　= (time) =>
	{
		let $time = time + this._segmentTimeOffsetArray[this._streamGenerator.segmentIndex];		
		Global.debug('realSeekTime=' + $time)
		this._emitter.emit(MSEEvents.GET_REALSEEKTIME, $time);  
	}
	
	_onCDNCheckFail = (err) => {
		Global.debug("CDN check fail");
		this._reportProgressLog("cdncheck", { "error": this._cdnChecker.error });
		//5表示服务器连接的时候失败
		let m = 5;
		this._emitter.emit(MSEEvents.PLAY_RESULT, {m : m,
												   url : this._playInfo.constructCdnURL(0),
												   interval :5,
												   error : err,
												   httpStatus :0});
	}
	
	_onCDNCheckOK = () => {
		this._reportProgressLog("cdncheck", { "error": 0 });
	}
	
	_reportProgressLog(progress, info )
	{
		let log = {};
		
		log.dt = "stop";
		log.progress = progress;
		log.file = this._playInfo.fileName;
		log.variables = this._playInfo.variables;
//		log.cv = Version.version;
		
		let k;
		if (info)
		{
			for (k in info)
			{
				log[k] = info[k];
			}
		}
		this._emitter.emit(MSEEvents.P2P_DAC_LOG, log);
	}
}