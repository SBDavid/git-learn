import {CommonUtils, Common} from '../../common/CommonUtils';
import Global from "../../../cn/pplive/player/manager/Global";
import EventEmitter from 'events';
import MSEEvents from '../../event/mse-events.js';

const MODE_INIT = -1;
const MODE_IDLE = 0;
const MODE_HTTP = 1;
		
export default class HttpDispatcher {
    constructor(resource, downloader) {
    	this._emitter = new EventEmitter();
        this._resource = resource;
        this._downloader = downloader;
        this._requestHeader = false;
        this._offset = -1;
        this._restPlayTime = 0;
        this._mode = MODE_INIT;
        this._requestTime = 0;
        this._interTime = 0;//(Common.BLOCK_SIZE * Common.VOD_BYTESTOMP4_INTER) / (Common.VOD_SUBPIECE_SIZE * 50 );
    }

    requestHeader() {
        this.stop();
        this._requestHeader = true;
        this._mode = MODE_HTTP;
        this._offset = -1;
        this.doRequest();
    }

    request(offset)
    {
        this.stop();
        this._requestHeader = false;
        this._offset = offset;
        this._requestTime -= this._interTime;
		this._switchMode();
    }
    
    set offset(offset){
		this._offset = offset;
	}
    
    get offset(){
		return this._offset;
	}

    stop() {
        this._downloader.stop();
    }

    doRequest() {
    	if(this._downloader.isWorking()) return;
    	
        let range;
       
        if (this._mode == MODE_INIT) {
			this._mode = this._fixNewMode();
		}
        if(this._mode == MODE_HTTP)
        {
        	if (this._requestHeader) {
	            range = this._fixRequestRange(this._resource, 0, this._resource.headLength);
	        }
	        else {
	          range = this._fixRequestRange(this._resource, this._offset, this._offset + Common.BLOCK_SIZE - 1);
	        }
	
	        if (range) {
	            range.begin = parseInt(range.begin / Common.VOD_SUBPIECE_SIZE) * Common.VOD_SUBPIECE_SIZE;
        		range.end = parseInt((range.end + Common.VOD_SUBPIECE_SIZE -1) / Common.VOD_SUBPIECE_SIZE) * Common.VOD_SUBPIECE_SIZE; 
        		this._offset = range.end;
        		this._requestTime = new Date().getTime();
	            this._downloader.request(range.begin, range.end);
	        }
	        else {
	            this.stop();
//	            this._emitter.emit(MSEEvents.SEGMENT_DOWNLOAD_COMPLETE);
	        }
        }
    }

    get offset(){
        return this._offset;
    }
    
    set restPlayTime(t)
	{
		this._restPlayTime = t;
		this._switchMode();
	}	
		
	on(event, listener) {
        this._emitter.addListener(event, listener);
    }

    off(event, listener) {
        this._emitter.removeListener(event, listener);
    }
    
    destroy() {
    	this.stop();
    	this._emitter.removeAllListeners();
    	this._emitter = null;
        this._resource = null;
        this._downloader = null;
    }

    _fixRequestRange(resource, begin, end, maxIgnore = 16) {
        if(begin >= resource.length)
        return null;
        let range = {};
        range.begin = begin;
        range.end = end;
        
        if (range.end + 1024 >= resource.length) {//剩下1K全都一起下载
        	range.end = 0;
        }
        
        return range;
    }
    
    _switchMode()
	{
		if (this._isRequesting) {
			
			let newMode = this._fixNewMode();
			this._mode = newMode;
			if(newMode == MODE_HTTP&& !this._downloader.isWorking() && (this._requestTime + this._interTime) <= new Date().getTime())
			{
				this.stop();
				this.doRequest();
			}
		}
	}
	
	 _fixNewMode()
	 {
	 	let resumeHttpRestPlayTime = Common.DOWNLOAD_RESUME_HTTP_REST_PLAY_TIME * 2 ;
//		let interTime = (Common.BLOCK_SIZE * Common,VOD_BYTESTOMP4_INTER) / (Common.VOD_SUBPIECE_SIZE * 50  * 1000);
	 	if (this._restPlayTime < resumeHttpRestPlayTime)
		{
			return MODE_HTTP;				
		}
		else
		{
			return MODE_IDLE;
		}
	 }
	
	get _isRequesting() { return (this._requestHeader || this._offset >= 0) ; }
}