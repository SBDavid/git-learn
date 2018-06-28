import EventEmitter from 'events';
import MSEEvents from '../../event/mse-events.js';
import Global from "../../../cn/pplive/player/manager/Global";
import FetchStreamLoader from '../../download/fetch-stream-loader.js';
import MozChunkedLoader from '../../download/xhr-moz-chunked-loader.js';
import MSStreamLoader from '../../download/xhr-msstream-loader.js';
import RangeLoader from '../../download/xhr-range-loader.js';
import RangeSeekHandler from '../../download/range-seek-handler.js';

export default class HTTPDownloader {
	constructor(subpieceReceiver,host, bakhost,rid,variables,config) {
//		Global.debug('creat HTTPBlockTask')
		this._emitter = new EventEmitter();
		this._rid = rid;
		this._variables = variables ?  ("?" + variables) : "";
		this._host = host;		
		this._hosts = [];
		this._hosts.push(host);
		this._dataSource = null;
		this._config = config;
		if (bakhost) this._hosts.push(bakhost);
		this._currentRange = {from: 0, to: -1};
		this.subpieceReceiver = subpieceReceiver;
		this._selectSeekHandler();  
	}
	
	switchHost()
	{
		let idx = this._hosts.indexOf(this._host) + 1;
		
		this._host = idx < this._hosts.length ?  this._hosts[idx] : this._hosts[0];
	}
	
	open(dataSource) {
		this.stop();		
		this._selectLoader();
        this._createLoader();
	 	this._dataSource = dataSource;
	 	this._dataSource.url = this._constructURL();
        this._loader.open(this._dataSource,this._currentRange);
	}
	
	stop(){
		if(!this._loader) return;
		if (this._loader.isWorking()) {
            this._loader.abort();
        }
        this._loader.destroy();
        this._loader = null;
        this._loaderClass = null;
        this._dataSource = null;
        
	}
	
	on(event, listener) {
        this._emitter.addListener(event, listener);
    }

    off(event, listener) {
        this._emitter.removeListener(event, listener);
    }
	
	destroy() {
        this.stop();
        this._rid = null;
        this._variables = null;
        this._host = null;
        this._hosts = null;
        this._currentRange = null;
        this._emitter.removeAllListeners();
        this._emitter = null;
        this.subpieceReceiver = null;
        this._seekHandler = null;
    }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   	_constructURL()
	{
		return "//" + this._host + "/live/" + this._rid.toString().toLowerCase() + "/" + this._dataSource.block + ".block" + this._variables;
//		return ('//static9.pplive.cn/corporate/pc_player/test/' + this._dataSource.block + '.block');
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

    _createLoader() {
        this._loader = new this._loaderClass(this._seekHandler,this._config);
        this._loader.onDataArrival = this._onLoaderChunkArrival;        
        this._loader.onComplete = this._onLoaderComplete;
        this._loader.onError = this._onLoaderError;
    }
    
    _selectSeekHandler() {
        let config = this._config;

        if (config.seekType === 'range') {
            this._seekHandler = new RangeSeekHandler(this._config.rangeLoadZeroStart);
        } else if (config.seekType === 'param') {
            let paramStart = config.seekParamStart || 'bstart';
            let paramEnd = config.seekParamEnd || 'bend';

            this._seekHandler = new ParamSeekHandler(paramStart, paramEnd);
        } else if (config.seekType === 'custom') {
            if (typeof config.customSeekHandler !== 'function') {
                throw new InvalidArgumentException('Custom seekType specified in config but invalid customSeekHandler!');
            }
            this._seekHandler = new config.customSeekHandler();
        } else {
            throw new InvalidArgumentException(`Invalid seekType in config: ${config.seekType}`);
        }
    }
    
     _onLoaderChunkArrival = (chunk, byteStart, receivedLength) => {
     	this.subpieceReceiver.onReceiveSubpiece(this._dataSource.block, chunk, byteStart, receivedLength);
    }
     
    _onLoaderError = (type, data) => {
        Global.debug(`Loader error, code = ${data.code}, msg = ${data.msg}`);
        this._emitter.emit(MSEEvents.HTTP_DOWNLOAD_DATA_ERROR, MSEEvents.HTTP_DOWNLOAD_DATA_ERROR,this._dataSource.block);
    }
       
    _onLoaderComplete = (from, to)=> {
		this.subpieceReceiver.onReceiveSubpiece(this._dataSource.block);
    }

}