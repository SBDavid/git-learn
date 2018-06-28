import Global from "../../../cn/pplive/player/manager/Global";
import FetchStreamLoader from '../../download/fetch-stream-loader.js';
import MozChunkedLoader from '../../download/xhr-moz-chunked-loader.js';
import DRMDecoder from '../DRMDecoder';
import EventEmitter from 'events';

export default class DRMInfoLoader{
	constructor(playInfo, segmentIndex) {
        Global.debug('creat DRMInfoLoader>>>');
        this._emitter = new EventEmitter();
        this._playInfo = playInfo;
        this._segmentIndex = segmentIndex;
        this._drmDecoder = new DRMDecoder();
    }
    
    start() {
        //下载header
        let url = this._playInfo.constructDrmURL(this._segmentIndex);
        Global.debug("rdm url: " + url);
        this._selectLoader();
        this._createLoader();
        this._dataSource = {url:url}
        this._loader.open(this._dataSource);
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
    
    destroy() {
        this.stop();
        this._urls = null;
		this._playInfo = null;
		this._emitter.removeAllListeners();
		this._emitter = null;
		this._drmDecoder.destroy();
		this._drmDecoder = null;
    }  
    
    on(event, listener) {
        this._emitter.addListener(event, listener);
    }

    off(event, listener) {
        this._emitter.removeListener(event, listener);
    }

    get drmDecoder() {
        return this._drmDecoder;
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
        this._loader = new this._loaderClass();
        this._loader.onDataArrival = this._parseChunks;
        this._loader.onComplete = this._onLoaderComplete;
        this._loader.onError = this._onLoaderError;
    }

    _parseChunks　=　(chunk, byteStart) =>　{
        this._drmDecoder.appendBytes(chunk)
    }
 
    _onLoaderComplete　=()　=> {
        this._drmDecoder.init();
        this._emitter.emit('complete');
    }    
    
    _onLoaderError　=　(type, data)　=> {
    	this._drmDecoder.init();
        this._emitter.emit('complete');
    }
}