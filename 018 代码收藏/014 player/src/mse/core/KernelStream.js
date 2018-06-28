import Global from "../../cn/pplive/player/manager/Global";
import MSEController from './mse-controller.js';
import {createDefaultConfig} from '../utils/config.js';
//import Transmuxer from './transmuxer.js';
import LivePlayManager from '../live/manager/LivePlayManager.js';
import VodPlayManager from '../vod/manager/VodPlayManager.js';
import MSEEvents from '../event/mse-events.js';
import EventEmitter from 'events';
import {Common,CommonUtils} from '../common/CommonUtils.js'

export default class KernelStream{
	constructor(player,config) {
		if(!player)
		{
			Global.debug('必须传一个video')
		}
		let mix = function(o1, o2) {
		        for (let i in o2) {
		            o1[i] = o2[i];
		        }
		        return o1;
		   };
		this.player = player;

		this._config = createDefaultConfig();
		if(config) this._config = mix(this._config, config);
		this._msectl = null;
		this._playInfo = null;
		this._mseSourceOpened = false;
		this._isBufferFull = false;
		this.isInitStart = false;	
		this._emitter = new EventEmitter();
		this._timer = 0;//计时器
		this._currentCount = 0;//计时器       
		this._isSeek = false;
	}
	
	//获取播放的时间
	get headTime(){
		return (this._config.videoType == 10 && this._playerManager) ? ((this.player.currentTime + this._playerManager.totalOffsetTime)) : ((this.player.currentTime));
	}
	
	get timeHack(){
		return (this._config.videoType == 10 && this._playerManager) ? this._playerManager.timeHack : 0;
	}
	
	get buffer(){
		return (this._config.videoType == 1 && this._playerManager) ? this._playerManager.buffer :　0;
	}
	
	/**
	 * pos vod开始播放位置
	 */
	start(playInfo, pos=0)
	{		
		if (this.isInitStart && this._playInfo != null)
		{
			return;
		}
		Global.debug('KernelStream start>>',playInfo);
		this._isSeek = true;
		this._playInfo = playInfo;
		this._playerManager = (this._config.videoType == 1) ? new VodPlayManager(this.player) : new LivePlayManager(this.player,this._config);
		this._attachMediaElement(this.player);
		this._addEvents();

		this.isInitStart = true;		   
        this._playerManager.start(playInfo);
        
        if(this._config.videoType == 1) 
        {
        	this._playerManager.play(pos);
        }
        this._timer = setInterval(
			() => {				
				if(this._msectl) this._msectl.currentTime = this.player.currentTime;
				this._currentCount ++ ;
				this._playerManager.updataTime(this._isSeek);
				if (this._currentCount % 60 == 0 && this._config.videoType != 1)
				{
					if(this._playerManager) this._playerManager.dropBlocksPreTime(Common.CACHE_SIZE_BEFORE_PUSH_POINT_IN_SECONDS);
					if(this._msectl) this._msectl.dropBlocksPreTime(Common.CACHE_SIZE_BEFORE_PUSH_POINT_IN_SECONDS);
					if(this._emitter && this._playerManager) this._emitter.emit(MSEEvents.STREAM_SPEED, {type:MSEEvents.STREAM_SPEED, data:this._playerManager.speed});
				}
				
				if (this._currentCount % 7000 == 0)
				{
					if(this._playerManager) this._playerManager.reportDacLog();
				}
			},
			1000
		)
	}
	
	on(event, listener) {
        this._emitter.addListener(event, listener);
    }

    off(event, listener) {
        this._emitter.removeListener(event, listener);
    }
	
	resume(){
  		this._playerManager.resume();
  	}
  	
  	pause(){
  		this._playerManager.pause();
  	}
	
	close(){
		if(this.isInitStart)
		{			
			this.isInitStart = false;
			this._isBufferFull = false;
			this._removeEvents();
	        this.pause();
	        this._detachMediaElement();
	
	        if (this._playerManager) {
	        	this._playerManager.reportDacLog();
	            this._playerManager.destroy();
	            this._playerManager = null;
	        }
	        
	        clearInterval(this._timer);
	        this._currentCount = 0;
		    this._playInfo = null;	
		    this.player = null;
		}       
	}
	
	seekVideo(time)
	{
		this._playerManager.currentTime = this.player.currentTime;
//		this._onmseBufferEmpty();
		this._isSeek = true;
		this._playerManager.reportDacLog();
		       
        if(this._config.videoType == 1) 
        {
        	 
        }
        else
        {
        	this._detachMediaElement();
			this._attachMediaElement(this.player);
        	this._playerManager.dropBlocksPreTime(Common.CACHE_SIZE_BEFORE_PUSH_POINT_IN_SECONDS);
        }
        this._playerManager.seekVideo(time);
	}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	_addEvents(){
		this._playerManager.on(MSEEvents.INIT_SEGMENT, this._initSegment);
	    this._playerManager.on(MSEEvents.MEDIA_SEGMENT, this._mediaSegment);
	    this._playerManager.on(MSEEvents.PLAY_FAILED, this._onStreamFail);
		if(this._config.videoType == 1)
		{
			this._playerManager.on(MSEEvents.PLAY_COMPLETE, this._playerEnd);
	        this._playerManager.on(MSEEvents.P2P_DAC_LOG, this._onVodP2pDacLog);
	        this._playerManager.on(MSEEvents.GET_REALSEEKTIME, this._onUpdateEnd);
	        
		}
		else
		{
			this._playerManager.on(MSEEvents.BUFFER_EMPTY, this._onmseBufferEmpty);
	        this._playerManager.on(MSEEvents.ONAIR_SHOW, this._onAirShow);
	        this._playerManager.on(MSEEvents.ONAIR_HIDE, this._onAirHide);
	        this._playerManager.on(MSEEvents.LIVE_STREAM_STOPPED, this._onStreamStop);
	        this._playerManager.on(MSEEvents.LIVE_CORE_DAC_LOG, this._reportDacLog);
		}
		this.player.addEventListener("canplaythrough", this._onUpdateEnd);
		this.player.addEventListener("error", this._playError);
		this.player.addEventListener("waiting", this._onmseBufferEmpty);
		this.player.addEventListener("ended", this._onmseBufferEmpty);
	}	
		
	_removeEvents(){
		this._playerManager.off(MSEEvents.INIT_SEGMENT, this._initSegment);
	    this._playerManager.off(MSEEvents.MEDIA_SEGMENT, this._mediaSegment);
	    this._playerManager.off(MSEEvents.PLAY_FAILED, this._onStreamFail);
		if(this._config.videoType == 1)
		{
			this._playerManager.off(MSEEvents.PLAY_COMPLETE, this._playerEnd);
	        this._playerManager.off(MSEEvents.P2P_DAC_LOG, this._onVodP2pDacLog);
	        this._playerManager.off(MSEEvents.GET_REALSEEKTIME, this._onUpdateEnd);
		}
		else
		{
			this._playerManager.off(MSEEvents.BUFFER_EMPTY, this._onmseBufferEmpty);
	        this._playerManager.off(MSEEvents.ONAIR_SHOW, this._onAirShow);
	        this._playerManager.off(MSEEvents.ONAIR_HIDE, this._onAirHide);
	        this._playerManager.off(MSEEvents.LIVE_STREAM_STOPPED, this._onStreamStop);
	        this._playerManager.off(MSEEvents.LIVE_CORE_DAC_LOG, this._reportDacLog);
		}
   
		this.player.removeEventListener("canplaythrough", this._onUpdateEnd);
		this.player.removeEventListener("error", this._playError);
		this.player.removeEventListener("waiting", this._onmseBufferEmpty);
		this.player.removeEventListener("ended", this._onmseBufferEmpty);

	}
	
	_initSegment = (type, is) => {	
		this._msectl.appendInitSegment(is);
	}
	
	_mediaSegment = (type, ms) => {
//		console.log('type=' + type + '>>@@@@@@@@@>>>>>'+ms.info.beginDts + ',' + ms.info.endDts + ',originalDts=' + ms.info.firstSample.originalDts)
		this._msectl.appendMediaSegment(ms);		
	}
	
	_onVodP2pDacLog = (log) => {
		this._emitter.emit(MSEEvents.P2P_DAC_LOG,  {type:MSEEvents.P2P_DAC_LOG, data:log});
	}
	
	_playError = (e) =>
	{
		Global.debug('请求数据时遇到错误');
		let to = 0 , buffered = this.player.buffered,time;	
        for (let i = 0; i < buffered.length; i++) {
            to = buffered.end(i);
        }
		if(this._config.videoType != 1)//直播往后延5秒
		{
			time = Math.floor(to + this._playInfo.start + 5);
			time -= time % this._playInfo.interval;
		}
		else
			time = 0;
		this.seekVideo(time);//重置mse
		this.player.play();
		this._onmseBufferEmpty();
	}

		//附加video
	_attachMediaElement(mediaElement) {
        this._msectl = new MSEController();
        this._msectl.attachMediaElement(mediaElement);
        this._msectl.on(MSEEvents.SOURCE_OPEN, this._sourceOpen);        
        this._msectl.on(MSEEvents.UPDATE_END, this._onUpdateEnd);        
        this._msectl.on(MSEEvents.ERROR, this._onMseError);
        this._msectl.on(MSEEvents.BUFFER_FULL_ERROR, this._onMseBufferFullError);
        
  	}	
  
    _detachMediaElement() {
        if (this._msectl) {
        	this._msectl.off(MSEEvents.SOURCE_OPEN, this._sourceOpen);        
	        this._msectl.off(MSEEvents.UPDATE_END, this._onUpdateEnd);        
	        this._msectl.off(MSEEvents.ERROR, this._onMseError);
	        this._msectl.off(MSEEvents.BUFFER_FULL_ERROR, this._onMseBufferFullError);
        	this._msectl.detachMediaElement();
            this._msectl.destroy();
            this._msectl = null;
        };
    }
    
    _sourceOpen = (e) => {        
       this._mseSourceOpened = true;
    }

    _onUpdateEnd = (e) => {    	
    	this._getRealSeekTime();
		if(!this._isBufferFull && this._playerManager && Number(this._playerManager.restPlayTime) > 1) 
		{
			this._isBufferFull = true;
			this._emitter.emit(MSEEvents.BUFFER_FULL , {type:MSEEvents.BUFFER_FULL});
		}				
    }
    
     _onMseError = (info) => {        
       this._emitter.emit(MSEEvents.ERROR, {type:MSEEvents.ERROR, data:info});
    }
     
     _onMseBufferFullError = () =>{
     	this._msectl.clearAllBuffer();
     	this._playerManager.seekVideo((this._playerManager.seekTime > this.player.currentTime) ? this._playerManager.seekTime : this.player.currentTime);
     }
     
     _reportDacLog = (data) =>
    {
        this._emitter.emit(MSEEvents.LIVE_CORE_DAC_LOG, {type:MSEEvents.LIVE_CORE_DAC_LOG, data:data});
    }  
    
    _playerEnd = () =>
    {
        Global.debug('播放完成');
		this._emitter.emit(MSEEvents.PLAY_COMPLETE,{type:MSEEvents.PLAY_COMPLETE});	
    }  

    _onmseBufferEmpty = (e)=>{	
		if(this._isBufferFull)
		{			
			this._isBufferFull = false;
			this._emitter.emit(MSEEvents.BUFFER_EMPTY, {type:MSEEvents.BUFFER_EMPTY});					
		}
    }
    
    _onAirShow = () =>
    {
       this._emitter.emit(MSEEvents.ONAIR_SHOW , {type:MSEEvents.ONAIR_SHOW});	
    }
    
    _onAirHide = () =>
    {
    	this._emitter.emit(MSEEvents.ONAIR_HIDE, {type:MSEEvents.ONAIR_HIDE});		
    }
    
    _onStreamFail = () =>
    {
    	this.close();
    	this._emitter.emit(MSEEvents.PLAY_FAILED, {type:MSEEvents.PLAY_FAILED});
    }
    
    _onStreamStop = () =>
    {
    	this.close();
    	this._emitter.emit(MSEEvents.LIVE_STREAM_STOPPED, {type:MSEEvents.LIVE_STREAM_STOPPED});
    }
    
    _getRealSeekTime = (time) =>
	{
		let $time = time || this._playerManager.seekTime;
		if(this._isSeek && this._config.videoType == 1 && this.player.duration >= $time)
    	{    		
    		this.player.currentTime = $time;  
    		if(this._msectl) this._msectl.currentTime = this.player.currentTime;
    		this._isSeek = false;
    	}
	}
}
