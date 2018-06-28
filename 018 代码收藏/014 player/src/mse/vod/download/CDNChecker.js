import Global from "../../../cn/pplive/player/manager/Global";
import FetchStreamLoader from '../../download/fetch-stream-loader.js';
import MozChunkedLoader from '../../download/xhr-moz-chunked-loader.js';
import MSEEvents from '../../event/mse-events.js';
import EventEmitter from 'events';

export default class CDNChecker{
	constructor(playInfo) {
		this._urls = [];
		this._loaders = [];
		this._failNum = 0;
		this._error = 0;
		this._emitter = new EventEmitter();
		this._isFinished = false;
		
		let url = playInfo.constructCdnURL(0, playInfo.host, 0, 1024);	
		this._urls.push(url); // 尝试2次
		this._urls.push(url);
		if(playInfo.backhost)
		{
			this._urls.push(playInfo.constructCdnURL(0, playInfo.backhost, 0, 1024)); // 尝试2次
			this._urls.push(playInfo.constructCdnURL(0, playInfo.backhost, 0, 1024));
		}		
	}
	
	get error() { return this._error; }
		
	get isFinished() { return this._isFinished; }
		
	start(timeout)
	{
		this._selectLoader();
		if (this._loaders.length == 0)
		{
			let i, len = this._urls.length;
			
			for ( i = 0; i < len; ++i)
			{
				let loader = new this._loaderClass();
				loader.onError = this._onError;
    			loader.onComplete = this._onLoaderComplete;
				this._loaders.push(loader);
			}
			
			for (i = 0; i < len; ++i)
			{
				Global.debug("cdncheck>>>> " + this._urls[i]);
    			this._loaders[i].open({url:this._urls[i]});
			}
			
			this._timeout = setTimeout(this._onTimeout, timeout * 1000);
		}
	}

    stop(){
    	let i, len = this._urls.length;				
		for ( i = 0; i < len; ++i)
		{
			if(!this._loaders[i]) continue
			if (this._loaders[i].isWorking()) {
	            this._loaders[i].abort();
	        }
	        this._loaders[i].destroy();
		}
		
        this._loader = null;
        this._loaderClass = null;
        clearTimeout(this._timeout);
        this._isFinished = true;
    }
    
     destroy() {
        this.stop();
        this._urls = null;
		this._loaders = null;
		this._emitter.removeAllListeners();
		this._emitter = null;
    }    
    
    on(event, listener) {
        this._emitter.addListener(event, listener);
    }

    off(event, listener) {
        this._emitter.removeListener(event, listener);
    }

    _selectLoader() {
        if (FetchStreamLoader.isSupported()) {
            this._loaderClass = FetchStreamLoader;
        } else if (MozChunkedLoader.isSupported()) {
            this._loaderClass = MozChunkedLoader;
        } else if (RangeLoader.isSupported()) {
            this._loaderClass = RangeLoader;
        } else {
           Global.debug('Your browser doesn\'t support xhr with arraybuffer responseType!');
        }
    }
 
    _onLoaderComplete = () =>　{
		Global.debug("cdn check OK ");
		this.stop();
		this._emitter.emit(MSEEvents.CDN_CHECK_OK);
    }
    
    _onError = (type, info) => {
    	this._failNum ++;
    	this._error = info.code;
    	Global.debug("error: " + this._error + ',失败次数=' + this._failNum);
    	if(this._loaders.length == this._failNum)
    	{
    		this.stop();
    		if (this._error == 0) {
				this._error = 408;
			}
			this._emitter.emit(MSEEvents.CDN_CHECK_FAIL,this._error);
    	}
    }
    _onTimeout(){
		Global.debug("onTimeout");
		
		this.stop();
		
		if (this._error == 0) {
			this._error = 408;
		}
		this._emitter.emit(MSEEvents.CDN_CHECK_FAIL,this._error);
    }
	
}