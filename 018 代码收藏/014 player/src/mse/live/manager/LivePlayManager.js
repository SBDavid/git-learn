/*
 * Copyright (C) 2016 Bilibili. All Rights Reserved.
 *
 * @author zheng qian <xqq@xqq.im>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import EventEmitter from 'events';
import StreamBuffer from '../play/StreamBuffer.js';
import BlockTaskManager from './BlockTaskManager.js';
import {Max} from "../../utils/Utils";
import Global from "../../../cn/pplive/player/manager/Global";
import HTTPOnlyBlockTaskDispatcher from '../download/HTTPOnlyBlockTaskDispatcher.js'
import HTTPP2PBlockTaskDispatcher from '../download/HTTPP2PBlockTaskDispatcher.js'
import {Common} from '../../common/CommonUtils.js'
import FLVDemuxer from '../demux/flv-demuxer.js';
import MP4Remuxer from '../remux/mp4-remuxer.js';
import DemuxErrors from '../demux/demux-errors.js';
import MSEEvents from '../../event/mse-events.js';
import MediaInfo from '../../core/media-info.js';
import SpeedSampler from '../../download/speed-sampler.js';

const ADD_RESULT_OK = 0;
// Transmuxing (IO, Demuxing, Remuxing) controller, with multipart support
export default class LivePlayManager {

    constructor(player,config) {
        this.TAG = 'LivePlayManager';
        this._emitter = new EventEmitter();
        this._config = config;
        this._player = player;
        this._mediaInfo = null;
        this._streamBuffer = null;//block保存
		this._taskManager = null;//block任务管理器
		this._dispatcher = null;//
		this._timer = 0;
		this._restPlayTime = 0;
		this._droppedSubpieces = []; // 为了避免在onReceiveSubpiece(...)中重复创建|消除该对象；
		this._block = null;
		this._isPaused = false;
		this._pieceIdx = 0;//解析到的块ID
		this._pushStartTime = 0;//开始pushdata的时间
		this._prePushDataTime = 0;//上一次pushData的时间
		this._failEventDispatched = false;
		this._isPushingFirstBlock;
		this._byteStart = 0;//每个block每次解析数据的开始字节
		this._receivedLength = 0;
        this._stashUsed = 0;
       	this._stashInitialSize = 2;//1024 * 384;  // default initial size: 384KB
        this._stashByteStart = 0;
        this._stashSize = this._stashInitialSize;
        this._bufferSize = 1024 * 1024 * 3;  // initial size: 3MB
        this._stashBuffer = new ArrayBuffer(this._bufferSize);       
        this._onDataArrival = this._onInitChunkArrival;
        this._totalOffsetTime = 0;//无效block文件和下载失败block文件的时长
        //出现 CuePoint
        this._timeHack  = 0;//首个时间戳
		this._curr = 0;
		this._onair = 0;
		this._isOnair = false;
		this._inter_onair;
		this._speed = 0;
		this._httpDownloadBytes = 0;
		this._checksumFailCnt = 0;
		/**  
			initTimestamp : 基准时间戳
			tempTimestamp : 上一个相邻时间戳		
		*/
		this.flvTimestamp = {
				tempTimestamp : 0,//上一个相邻时间戳	
			 	diffTimestamp : 0,
			 	relativeTimestamp : 0,
				initTimestamp : 0,
				isFirstTag : true
		}
    }
    
     start(playInfo){
     	this._pieceIdx = 0;
     	this._pushStartTime = 0;
     	this._prePushDataTime = new Date().getTime();
     	this._isPushingFirstBlock = true;
    	this._playInfo = playInfo;
      	this._streamBuffer = new StreamBuffer(this._playInfo.rid, this._playInfo.interval);
		this._streamBuffer.currentUsedBlock = this._playInfo.start;
		this._taskManager = new BlockTaskManager(this, this._streamBuffer, this._playInfo, this._config);
		this._dispatcher = this._createBlockDispatcher(this._playInfo.bwtype);//new HTTPP2PBlockTaskDispatcher(this._streamBuffer, this._taskManager, this._playInfo.bwtype);
		this._block = this._streamBuffer.getBlock(this._playInfo.start);
		this._dispatcher.currentUsedBlock = this._playInfo.start;
		this._dispatcher.restPlayTime = this.restPlayTime;
		this._dispatcher.delay = this._playInfo.delay;
		this._dispatcher.endtime = this._playInfo.endtime;
		this._dispatcher.timeDiffBetweenStandardAndLocal = parseInt(this._playInfo.start + parseInt(this._playInfo.delay) - Date.parse(new Date()) / 1000);
		this._dispatcher.dispatchDownloadTasks();
		this._speedSampler = new SpeedSampler();
		this._timer = setInterval(
			() => {
				if(this._dispatcher) this._dispatcher.dispatchDownloadTasks();	
				this._pushData();	
			},
			250
		)
	}	
	
	//放弃当前时间前N秒的block数据
	dropBlocksPreTime(time){
		this._streamBuffer.dropBlocksPreTime(this._streamBuffer.currentUsedBlock - time);
	}
	
    get onDataArrival() {
        return this._onDataArrival;
    }

    set onDataArrival(callback) {
        this._onDataArrival = callback;
    }
    
    get timeHack(){
		return this._timeHack ;
	}
    
    get totalOffsetTime()
    {
    	return this._totalOffsetTime;
    }
    
    get speed(){
		return this._speed ;
	}
    
   	on(event, listener) {
        this._emitter.addListener(event, listener);
    }
	
    off(event, listener) {
        this._emitter.removeListener(event, listener);
    }
	
	pause() {  // take a rest
        this._isPaused = true;
    }

    resume() {
        this._isPaused = false;
    }
    
    seekVideo(time)
	{
		this.flvTimestamp = {
				tempTimestamp : 0,//上一个相邻时间戳	
			 	diffTimestamp : 0,
			 	relativeTimestamp : 0,
				initTimestamp : 0,
				isFirstTag : true
		}
		if (this._demuxer) {
            this._demuxer.destroy();
            this._demuxer = null;
        }
        if (this._remuxer) {
            this._remuxer.destroy();
            this._remuxer = null;
        }
        this._internalAbort();
        this._streamBuffer.destroy();
        this._onDataArrival = this._onInitChunkArrival;
		this._pieceIdx = 0;
		this._byteStart = 0;
        this._receivedLength = 0;
		this._isPushingFirstBlock = true;
		this._pushStartTime = 0;
		this._prePushDataTime = new Date().getTime();
		this._curr = 0;
		this._totalOffsetTime = 0;//无效block文件和下载失败block文件的时长
		this._onair = 0;
		this._isOnair = false;
		clearInterval(this._inter_onair);
		this._inter_onair = null;
		this._restPlayTime = 0;
		this._speedSampler.reset();
		if(time) 
		{
			this._playInfo.start = time;
			this._block = this._streamBuffer.getBlock(this._playInfo.start);
		}
		
	}
	
	updataTime(){
		this._restPlayTime = this.buffer.to - this._player.currentTime;	
		if(this._restPlayTime < 1)//开始缓冲
		{
			if( this._playInfo.endtime > 0 && this._block.blockId > this._playInfo.endtime )
			{
				this._emitter.emit(MSEEvents.LIVE_STREAM_STOPPED);
				return;
			}
			
			if(!this._isOnair)
			{
				this._emitter.emit(MSEEvents.BUFFER_EMPTY);			 
			}
		}
		if(!this._isOnair)
		{	
			if(this._player.paused)//暂停不算时间
			{
				this._prePushDataTime += 1000;
				return;
			}
			
			if (this._prePushDataTime + Common.WAIT_TIME_BEFORE_FAIL_IN_SECONDS * 1000 < new Date().getTime())
			{
				if (!this._failEventDispatched)
				{
					this._emitter.emit(MSEEvents.PLAY_FAILED);
					this._failEventDispatched = true;
				}
			}
		}
	}
	
	get restPlayTime(){
		this._restPlayTime = this.buffer.to - this._player.currentTime;	
		return this._restPlayTime;
 	}
	
	get buffer()
	{     
		let to = 0 , buffered = this._player.buffered
        for (let i = 0; i < buffered.length; i++) {
            to = buffered.end(i);			 
        }
		return {
			'to':to
		};
	}
	
	onReceiveSubpiece(blockIndex, data, byteStart, receivedLength)
	{
		
		let block = this._streamBuffer.getBlock(blockIndex, false);
		if (block)
		{
			if (block.isComplete)
			{				
				return;
			}
			var preHeadValid = block.isHeadValid;
			this._droppedSubpieces.length = 0;
			var addResult = block.addSubpiece(data, byteStart, receivedLength, this._droppedSubpieces);
	
			if (addResult == ADD_RESULT_OK)
			{
				try{
					this._httpDownloadBytes += data.byteLength;
				}
				catch(e){}
				if (block.isComplete)
				{
//					Global.debug("complete: " + block.blockId);
					this._dispatcher.restPlayTime  = this.restPlayTime;
					this._dispatcher.onComplete(block.blockId);
				}
				else if (!preHeadValid && block.isHeadValid)
				{
//					Global.debug("BlockHeaderCompleted>>>>>>>>> blockId=" + block.blockId + ',dataLength=' + block.dataLength);
				}
			}
			else if (addResult == Common.ADD_RESULT_CHECKSUM_MISMATCH)
			{		
				this._taskManager.dropTask(block.blockId);
				
				this._checksumFailCnt ++;
			}
		}		
	}
	
	reportDacLog(){
		let log = {};
		log.fkBrowser = navigator.userAgent.toLocaleLowerCase();
		log.fkG = 0; // G [G] [P2P下载字节数]
		log.fkH = this._httpDownloadBytes; // H [H] [Http下载字节数]
		log.fkRD= 0; // RD [RD] [冗余字节数]
		log.fkI = log.fkG + log.fkH; // I [I] [总下载字节数]
		log.fkL = this._speedSampler.httpMaxSpeedInKPS; // L [L] [Http最大速度]
		log.fkO = this._playInfo.start; // O [O] [开始播放点] 
		log.fkQ = this._checksumFailCnt; // Q [Q] [校验失败次数]
		log.fkX = 0;
		log.fkY = 0;
		log.fkZ = 0;
		log.fkU = 0;
		log.fkA1= 0;
		log.fkA2= 0;
		log.fkB1= 0;
		log.fkB2= 0;
		log.fkB3= 0;
		log.fkB4= 0;
		log.fkL2 = this._playInfo.bwtype; // L2 [L2] [BWType]
		this._emitter.emit(MSEEvents.LIVE_CORE_DAC_LOG, {type:MSEEvents.LIVE_CORE_DAC_LOG, data:log});
	}

    destroy(){
    	this._internalAbort();
    	this._mediaInfo = null;
		this._playInfo = null;
		this._streamBuffer.destroy();
      	this._streamBuffer = null;			
		this._taskManager.destroy();
		this._taskManager = null;
		this._dispatcher = null;
		this._block = null;
		clearInterval(this._timer);
		if (this._demuxer) {
            this._demuxer.destroy();
            this._demuxer = null;
        }
        if (this._remuxer) {
            this._remuxer.destroy();
            this._remuxer = null;
        }

        this._emitter.removeAllListeners();
        this._emitter = null;
        this._isPaused = false;
        this._pieceIdx = 0;
        this._byteStart = 0;
        this._receivedLength = 0;
		this._pushStartTime = 0;
		this._prePushDataTime = 0;
		this._totalOffsetTime = 0;//无效block文件和下载失败block文件的时长
		clearInterval(this._inter_onair);
		this._inter_onair = null;
		this._curr = 0;
		this._onair = 0;
		this._isOnair = false;
		this._restPlayTime = 0;
		this._httpDownloadBytes = 0;
		this._checksumFailCnt = 0;
		this.flvTimestamp = {
				tempTimestamp : 0,//上一个相邻时间戳	
			 	diffTimestamp : 0,
			 	relativeTimestamp : 0,
				initTimestamp : 0,
				isFirstTag : true
		}
		
		this._speedSampler = null;
		this._speed = 0;
    };
 /////////////////////////////////////////////////////////////////////////////////////////////////  
        _expandBuffer(expectedBytes) {
        let bufferNewSize = this._stashSize;
        while (bufferNewSize + 1024 * 1024 * 1 < expectedBytes) {
            bufferNewSize *= 2;
        }

        bufferNewSize += 1024 * 1024 * 1;  // bufferSize = stashSize + 1MB
        if (bufferNewSize === this._bufferSize) {
            return;
        }

        let newBuffer = new ArrayBuffer(bufferNewSize);

        if (this._stashUsed > 0) {  // copy existing data into new buffer
            let stashOldArray = new Uint8Array(this._stashBuffer, 0, this._stashUsed);
            let stashNewArray = new Uint8Array(newBuffer, 0, bufferNewSize);
            stashNewArray.set(stashOldArray, 0);
        }

        this._stashBuffer = newBuffer;
        this._bufferSize = bufferNewSize;
    }
        
     _dispatchChunks(chunks, byteStart) {     	
        return this._onDataArrival(chunks, byteStart);
    }
    
	_onLoaderChunkArrival(chunk, byteStart, receivedLength) {
		
		this._speedSampler.addBytes(chunk.byteLength);

        // adjust stash buffer size according to network speed dynamically
        this._speed = this._speedSampler.lastSecondKBps;

        if (this._stashUsed === 0 && this._stashByteStart === 0) {  // seeked? or init chunk?
            // This is the first chunk after seek action
            this._stashByteStart = byteStart;
        }
       if (this._stashUsed + chunk.byteLength <= this._stashSize) {
            // just stash
            let stashArray = new Uint8Array(this._stashBuffer, 0, this._stashSize);
            stashArray.set(new Uint8Array(chunk), this._stashUsed);//第一个chuck去掉前面1400个字节
            this._stashUsed += chunk.byteLength;
        } else {  // stashUsed + chunkSize > stashSize, size limit exceeded
            let stashArray = new Uint8Array(this._stashBuffer, 0, this._bufferSize);
            if (this._stashUsed > 0) {  // There're stash datas in buffer
                // dispatch the whole stashBuffer, and stash remain data
                // then append chunk to stashBuffer (stash)                   
                let buffer = this._stashBuffer.slice(0, this._stashUsed);                   
                let consumed = this._dispatchChunks(buffer, this._stashByteStart);
                if (consumed < buffer.byteLength) {
                    if (consumed > 0) {
                        let remainArray = new Uint8Array(buffer, consumed);                            
                        stashArray.set(remainArray, 0);
                        this._stashUsed = remainArray.byteLength;//剩余字节数
                        this._stashByteStart += consumed;
                    }
                } else {
                    this._stashUsed = 0;
                    this._stashByteStart += consumed;
                }
                 
                if (this._stashUsed + chunk.byteLength > this._bufferSize) {
                    this._expandBuffer(this._stashUsed + chunk.byteLength);
                    stashArray = new Uint8Array(this._stashBuffer, 0, this._bufferSize);
                }
                stashArray.set(new Uint8Array(chunk), this._stashUsed);
                this._stashUsed += chunk.byteLength;
            } else {  // stash buffer empty, but chunkSize > stashSize (oh, holy shit)
                // dispatch chunk directly and stash remain data
                let consumed = this._dispatchChunks(chunk, byteStart);
                if (consumed < chunk.byteLength) {
                    let remain = chunk.byteLength - consumed;
                    if (remain > this._bufferSize) {
                        this._expandBuffer(remain);
                        stashArray = new Uint8Array(this._stashBuffer, 0, this._bufferSize);
                    }
                    stashArray.set(new Uint8Array(chunk, consumed), 0);
                    this._stashUsed += remain;
                    this._stashByteStart = byteStart + consumed;
                }
            }
        }
    }

    _onInitChunkArrival(buffer, byteStart) {
        let probeData = null;
        let consumed = 0;

        if (byteStart > 0 && this._demuxer) {
            // IOController seeked immediately after opened, byteStart > 0 callback may received
            this._demuxer.bindDataSource(this);
			this._demuxer.timestampBase = (this._playInfo.start - this._block.blockId);

            consumed = this._demuxer.parseChunks(buffer, byteStart);
        } else if ((probeData = FLVDemuxer.probe(buffer)).match) {
            // Always create new FLVDemuxer
            this._demuxer = new FLVDemuxer(probeData, this._config, this.flvTimestamp);

            if (!this._remuxer) {
                this._remuxer = new MP4Remuxer(this._config);
            }
			this._demuxer.timestampBase = this._block.blockId - this._playInfo.start;//(this._playInfo.begin - this._block.blockId);
			this._demuxer.overridedDuration = this._demuxer.timestampBase + this._playInfo.interval;
            this._demuxer.onError = this._onDemuxException;
            this._demuxer.onMediaInfo = this._onMediaInfo;
			this._demuxer.onCuePoint = this._onCuePoint;
			
            this._remuxer.bindDataSource(this._demuxer.bindDataSource(this));

            this._remuxer.onInitSegment = this._onRemuxerInitSegmentArrival;
            this._remuxer.onMediaSegment = this._onRemuxerMediaSegmentArrival;

            consumed = this._demuxer.parseChunks(buffer, byteStart);
        } else {
            probeData = null;
            Global.debug(this.TAG, 'Non-FLV, Unsupported media type!');
            Promise.resolve().then(() => {
                this._internalAbort();
            });
            this._emitter.emit(MSEEvents.DEMUX_ERROR, DemuxErrors.FORMAT_UNSUPPORTED, 'Non-FLV, Unsupported media type');

            consumed = 0;
        }

        return consumed;
    }
    
    _flushStashBuffer(dropUnconsumed) {
        if (this._stashUsed > 0) {
            let buffer = this._stashBuffer.slice(0, this._stashUsed);
            let consumed = this._dispatchChunks(buffer, this._stashByteStart);
            let remain = buffer.byteLength - consumed;

            if (consumed < buffer.byteLength) {
                if (dropUnconsumed) {
                    Global.debug(this.TAG, `${remain} bytes unconsumed data remain when flush buffer, dropped`);
                } else {
                    if (consumed > 0) {
                        let stashArray = new Uint8Array(this._stashBuffer, 0, this._bufferSize);
                        let remainArray = new Uint8Array(buffer, consumed);
                        stashArray.set(remainArray, 0);
                        this._stashUsed = remainArray.byteLength;
                        this._stashByteStart += consumed;
                    }
                    return 0;
                }
            }
            this._stashUsed = 0;
            this._stashByteStart = 0;
            return remain;
        }
        return 0;
    }
    
    //创建block下载调度机制
	_createBlockDispatcher(bwt)
	{
		switch (bwt)
		{
			case Common.BWTYPE_HTTP_ONLY:
			case Common.BWTYPE_HTTP_PREFERRED:
				return new HTTPP2PBlockTaskDispatcher(this._streamBuffer, this._taskManager);	
			default:
				return new HTTPP2PBlockTaskDispatcher(this._streamBuffer, this._taskManager, bwt);
		}
	}
    
    _onDemuxException = (type, info) => {
       Global.debug(this.TAG, `DemuxException: type = ${type}, info = ${info}`);
        this._emitter.emit(MSEEvents.DEMUX_ERROR, type, info);
    }
    
    	//终止网络下载
    _internalAbort() {
    	 Global.debug('终止网络下载');
		this._taskManager.dropAllTasks();
    }
    
    _onRemuxerInitSegmentArrival = (type, initSegment) => {
        this._emitter.emit(MSEEvents.INIT_SEGMENT, type, initSegment);
    }

    _onRemuxerMediaSegmentArrival = (type, mediaSegment) => {
        this._emitter.emit(MSEEvents.MEDIA_SEGMENT, type, mediaSegment);
    }

	_isRunning() 
	{ return this._timer.running }
	
    _onMediaInfo = (mediaInfo) => {
        if (this._mediaInfo == null) {
            // Store first segment's mediainfo as global mediaInfo
            this._mediaInfo = Object.assign({}, mediaInfo);
            Object.setPrototypeOf(this._mediaInfo, MediaInfo.prototype);
        }

        let segmentInfo = Object.assign({}, mediaInfo);
        Object.setPrototypeOf(segmentInfo, MediaInfo.prototype);
    }
    
    _onCuePoint = (info) => {
		for (let key in info) {
			if (key != "parameters"){
			} else {
				if (info["parameters"] != undefined) {
					for (let param in info["parameters"]) {
						if (param == "start") {
							if (this._curr < 1) {
								this._timeHack = info["parameters"][param];
								this._curr++;
								Global.debug("直播 CuePoint 出现  >>>>>  start  <<<<<  " + this._timeHack);
							}
							break;
						} else if (param == "onair") {
//							this._onair += this._playInfo.interval;
							this._resetOnair();
							Global.debug("直播 CuePoint 出现  >>>>>  onair  <<<<<  标记");
							break;
						}
					}
					break;
				}
			}
		}
	}
    
    _resetOnair() {
		this._onair += this._playInfo.interval;
		Global.debug("onair标记  >>>>>  this._onair=" + this._onair);
		if (!this._isOnair) {
			this._isOnair = true;
			this._inter_onair = setInterval(()=>{
											this._onair--;
											this._totalOffsetTime ++;
											if (this._onair == 0) {
												this._isOnair = false;
												this._emitter.emit(MSEEvents.ONAIR_HIDE);
												Global.debug("onair标记  >>>>>  时间结束  <<<<<");
												clearInterval(this._inter_onair);
												this._inter_onair = null;
											}												
									},1000);
		}
		
		
		this._emitter.emit(MSEEvents.ONAIR_SHOW);
	}
		
    
    _pushData()
	{
		if (!this._isPushingFirstBlock || this._block.isComplete || (this._block.status && this._block.status.isUnAvailable))
		{
			this._readBytes();
		}
		this._dispatcher.restPlayTime  = this.restPlayTime;
		this._dispatcher.currentUsedBlock = this._block.blockId;
		this._streamBuffer.currentUsedBlock = this._block.blockId;
	}
	
	_readBytes(maxBlockCount = 10)//check当前的block，如果没有下载过就准备下载，下载过直接去解析插入到流中
	{				
		if (!this._isRunning)
		{
			return;	
		}		
		

		while (maxBlockCount--)
		{				
			if (this._block.status.isUnAvailable) // 跳过该块
			{
				this._totalOffsetTime += this._playInfo.interval;
				Global.debug('跳过该块  block = ' + this._block.blockId + ',this._totalOffsetTime =' + this._totalOffsetTime );
				this._streamBuffer.dropBlockbyId(this._block.blockId);
				this._block = this._streamBuffer.getBlock(this._block.blockId + parseInt(this._streamBuffer.blockInterval), true);
				this.flvTimestamp.tempTimestamp += 5000;
				continue;
			}
			
			if (!this._block.isHeadValid)
			{
				break;
			}
			
//			Global.debug('PUSH DATA>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' + this._block.blockId);
			
			this._prePushDataTime = new Date().getTime();
			
			let pool = [];
			let piece;		
			while (this._block.isPieceValid(this._pieceIdx))
			{
				piece = this._block.getPiece(this._pieceIdx++);
				pool = pool.concat( Array.prototype.slice.call(piece))
				this._byteStart = this._receivedLength;
				this._receivedLength +=  pool.length;				
				let bbb = new Uint8Array(pool);
				this._onLoaderChunkArrival(bbb.buffer, this._byteStart ,this._receivedLength);
				pool = [];
				
				if (this._pushStartTime == 0)
				{
					this._pushStartTime = new Date().getTime();
				}
			}
			
			if (this._pieceIdx < this._block.pieceCount)
			{
				break;
			}
			
			this._flushStashBuffer(true);
//			Global.debug('PUSH DATA完成blockid=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' + this._block.blockId);	
			if(this._demuxer) 
            {
            	this._demuxer.remux();
            }
			this._streamBuffer.dropBlockbyId(this._block.blockId);		
			this._stashUsed = 0;    
         	this._stashByteStart = 0;	         	
//         	this._stashBuffer = new ArrayBuffer(this._bufferSize);   
           	this._onDataArrival = this._onInitChunkArrival;
       		this._byteStart = 0;
       		this._receivedLength = 0;
       		this._isPushingFirstBlock = false;			
			this._block = this._streamBuffer.getBlock(this._block.blockId + parseInt(this._streamBuffer.blockInterval), true);
			this._pieceIdx = 0;	
		}
	}
}