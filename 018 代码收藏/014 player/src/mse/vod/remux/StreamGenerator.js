import Mp4Stream from './Mp4Stream';
import Global from "../../../cn/pplive/player/manager/Global";
import MSEEvents from '../../event/mse-events.js';
import EventEmitter from 'events';
import SubPiece from '../play/SubPiece';
import {Common} from '../../common/CommonUtils';

export default class StreamGenerator{
	constructor(resource, segmentIndex, fmp4) {
		this._emitter = new EventEmitter(); 
        this.resource = resource;
        this.segmentIndex = segmentIndex;
        this._isRunning = false;
        this._needSeek = false;
        this._currentTime = 0;
        
		this._seekTime = 0;
        this._seekOffset = 0;
        
        this._downloadHeaderRequestDispatched = false;
        this._isFirstSubpieceAfterSeek = false;        
        this._sendPosition = new SubPiece(0,0);
		
		this._fmp4 = fmp4;
        this._mp4Stream = new Mp4Stream(fmp4);	
        this._mp4Stream.on(MSEEvents.SEGMENT_REMUX_COMPLETE, this._complete); 
        this._mp4Stream.on(MSEEvents.MP4_HEADER_OK, this._mp4HeaderOK); 
        this._mp4Stream.on(MSEEvents.MP4_HEADER_ERROR, this._mp4HeaderError); 
         
        this._timer = setInterval(//解析header
			() => {
				this._sendBytesToMp4Stream();
			},
			Common.VOD_BYTESTOMP4_INTER
        )  
    }
	
	requestHeader()
	{
		if(this._emitter) 
    	{
    		this._downloadHeaderRequestDispatched = true;
     		this._emitter.emit(MSEEvents.DOWNLOAD_HEADER_REQUEST, this); 
    	}   
	}
	
	start() {
    	if(this._isRunning) return;
        this._isRunning = true;  
        clearInterval(this._timer);
        this._timer = setInterval(
			() => {
				if (this._needSeek) {
                    this._handleSeek();
                }
				
				this._sendBytesToMp4Stream();
			},
			Common.VOD_BYTESTOMP4_INTER
        )  
    }
    
    stop() {
    	this._isRunning = false;
    	Promise.resolve().then(() => {     		
        	if(this._mp4Stream && this._mp4Stream.hasMp4Header()) clearInterval(this._timer);	//如果header没有解析成功，继续解析，解析成功后会停掉
    	});
    }
    
    setBaseTimeStamp(videoTimeStamp, audioTimeStamp) {
		this._mp4Stream.setBaseTimeStamp(videoTimeStamp, audioTimeStamp);
	}
    
    getRealSeekTime(currentTime,seekTime)
    {
    	return this._mp4Stream.getRealSeekTime(currentTime,seekTime);
    }
    
    getTimeSampleInfo(time)
	{
		return (this._mp4Stream.hasMp4Header()) ? this._mp4Stream.getTimeSampleInfo(time,time) : 0;
	}
    
    on(event, listener) {
        this._emitter.addListener(event, listener);
    }

    off(event, listener) {
        this._emitter.removeListener(event, listener);
    }
    
    seek(currentTime, seekTime) {
    	this._needSeek = true;
        this._currentTime = currentTime;
        this._seekTime = seekTime;
        this._mp4Stream.reset();
        if (this._isRunning) {            
            Promise.resolve().then(() => { 
				this._handleSeek();
	        });
        }
    }
    
    isHeadComplete(){
    	return this._mp4Stream.hasMp4Header();
    }
    
    destroy(){
    	this.stop();
    	clearInterval(this._timer);
		this._emitter.removeAllListeners();
		this._emitter = null;
        this.resource = null;
        this._mp4Stream.off(MSEEvents.SEGMENT_REMUX_COMPLETE, this._complete); 
        this._mp4Stream.off(MSEEvents.MP4_HEADER_OK, this._mp4HeaderOK); 
        this._mp4Stream.off(MSEEvents.MP4_HEADER_ERROR, this._mp4HeaderError); 
	    this._mp4Stream.destroy();
        this._mp4Stream= null;        
    }
    
    _handleSeek() {
        if (this._mp4Stream && this._mp4Stream.hasMp4Header()) {
            if (this._seekTime < 0.1) {
                this._seekTime = 0;
            }            
            this._needSeek = false;
            
            
            let realSeekTime = this._mp4Stream.getRealSeekTime(this._currentTime, this._seekTime);
            this._emitter.emit(MSEEvents.GET_REALSEEKTIME, realSeekTime);              
            this._seekOffset = this._mp4Stream.seek(this._currentTime, this._seekTime);
            this._sendPosition = new SubPiece(parseInt(this._seekOffset / Common.BLOCK_SIZE),parseInt((this._seekOffset % Common.BLOCK_SIZE) / Common.VOD_SUBPIECE_SIZE));//SubPiece.createSubPieceFromOffset(_seekOffset);            
            let  tempPosition = this.resource.getFirstSubPieceMissed(this._seekOffset);
	        this._isFirstSubpieceAfterSeek = true;
            if(tempPosition) 
            {            	
            	this._emitter.emit(MSEEvents.DOWNLOAD_REQUEST, tempPosition.offset);
            }
        }
    }
    
	_sendBytesToMp4Stream()
    {
        if (!this.resource && !this.resource.isDrmSetup) {
            return;
        }      
        let sendCount = 0;
        while(sendCount++ < 50&& this.resource && this.resource.hasSubPiece(this._sendPosition)) {  
    		let bytes = this.resource.getSubPiece(this._sendPosition);
    		
            if (this._isFirstSubpieceAfterSeek) {
                bytes.position = this._seekOffset - this._sendPosition.offset;
	            this._isFirstSubpieceAfterSeek = false;
            }     
            this._mp4Stream.appendBytes(bytes);	      
	        if(this._sendPosition) this._sendPosition.moveToNextSubPiece();            
        }
//      if(this._mp4Stream) this._mp4Stream.remux();
   }
	
	_mp4HeaderOK = () => {
		if(!this._isRunning) 
		{
			clearInterval(this._timer);//停止解析header
		}
		else
		{
			Promise.resolve().then(() => { 
				if (this._needSeek) {
		           this._handleSeek();
		        }
		        else {	        	
         			this._emitter.emit(MSEEvents.DOWNLOAD_REQUEST, this._sendPosition.offset);   	
	        	}   
	        });
		}
	}
	
	_mp4HeaderError = () => {
		this._emitter.emit(MSEEvents.MP4_HEADER_ERROR);
    }
    
	_complete = (videoTimeStamp, audioTimeStamp) =>
	{				
		if(this._isRunning) 
		{
			this._emitter.emit(MSEEvents.SEGMENT_REMUX_COMPLETE, videoTimeStamp, audioTimeStamp);			
		}
	}

}