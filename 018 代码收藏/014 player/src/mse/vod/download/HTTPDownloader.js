import EventEmitter from 'events';
import MSEEvents from '../../event/mse-events.js';
import Global from "../../../cn/pplive/player/manager/Global";
import FetchStreamLoader from '../../download/fetch-stream-loader.js';
import MozChunkedLoader from '../../download/xhr-moz-chunked-loader.js';
import MSStreamLoader from '../../download/xhr-msstream-loader.js';
import RangeLoader from '../../download/xhr-range-loader.js';
import RangeSeekHandler from '../../download/range-seek-handler.js';
import {Stream} from "../../../cn/pplive/player/crypto/stream";
import {Common} from '../../common/CommonUtils';
import SubPiece from '../play/SubPiece';

export default class HTTPDownloader {
	constructor(playInfo, segmentIndex) {
        Global.debug('creat HTTPDownloader>>>');
        this._emitter = new EventEmitter();
        this._playInfo = playInfo;
        this._segmentIndex = segmentIndex;
        this._begin = 0;
        this._end = 0;
        this._arrivalDate = new Stream();
		this._host = playInfo.host;		
		this._hosts = [];	
		if (playInfo.backupHostVector) this._hosts = this._hosts.concat(playInfo.backupHostVector)
		this._seekHandler = new RangeSeekHandler(false); 
		this._failTimes = 0;
    }
    
    request(begin, end) {
        this.stop();		
		this._selectLoader();
        this._createLoader();
       	this._begin = begin;//parseInt(begin / Common.VOD_SUBPIECE_SIZE) * Common.VOD_SUBPIECE_SIZE;
        this._end = end;//parseInt((end + Common.VOD_SUBPIECE_SIZE -1) / Common.VOD_SUBPIECE_SIZE) * Common.VOD_SUBPIECE_SIZE;         
        this._dataSource = {};
        this._dataSource.url = this._constructURL();
        this._loader.open(this._dataSource);
    }
    
    isWorking(){
    	return this._loader ?  this._loader.isWorking() : false;
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
        this._arrivalDate.clear();        
	}	
	
	destroy() {
        this.stop();
        this._host = null;
        this._hosts = null;
        this._playInfo = null;
        this._emitter.removeAllListeners();
        this._emitter = null;
        this._seekHandler = null;
    }
	
	on(event, listener) {
        this._emitter.addListener(event, listener);
    }

    off(event, listener) {
        this._emitter.removeListener(event, listener);
    }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    _constructURL() {
        return this._playInfo.constructCdnURL(this._segmentIndex, this._host, this._begin, this._end);
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
    
     _onLoaderChunkArrival　=(chunk, byteStart, receivedLength) =>　{
		let temp = new Uint8Array(receivedLength)
     	temp.set(new Uint8Array(chunk),this._arrivalDate.length());
        this._arrivalDate.writeBytes(temp,this._arrivalDate.length(), receivedLength);
        while (this._arrivalDate.bytesAvailable() >= Common.VOD_SUBPIECE_SIZE) {            
            let subpiece = new SubPiece(parseInt(this._begin / Common.BLOCK_SIZE), parseInt((this._begin % Common.BLOCK_SIZE) / Common.VOD_SUBPIECE_SIZE));
			let data = new Uint8Array(Common.VOD_SUBPIECE_SIZE);
            this._arrivalDate.read(data);
            this._begin += Common.VOD_SUBPIECE_SIZE;
            this._emitter.emit(MSEEvents.RECEIVE_SUBPIECE, {subpiece:subpiece, data:data}); 
			
        }
    }
       
    _onLoaderComplete　=　(from, to)　=> {        
		if (this._arrivalDate.bytesAvailable() > 0 && (this._begin < this._end || this._end == 0)) {
            let subpiece = new SubPiece(parseInt(this._begin / Common.BLOCK_SIZE), parseInt((this._begin % Common.BLOCK_SIZE) / Common.VOD_SUBPIECE_SIZE));
            let data = new Uint8Array(Common.VOD_SUBPIECE_SIZE);
            this._arrivalDate.read(data);
            this._emitter.emit(MSEEvents.RECEIVE_SUBPIECE, {subpiece:subpiece, data:data});       
        }

        this.stop();
//      this._emitter.emit(MSEEvents.DOWNLOAD_COMPLETE);
    }

    _onLoaderError　=　(type, data)　=> {
    	this.stop();
    	++this._failTimes;
    	while (this._hosts.length > 0) {
			try {
				this._host = this._hosts.shift();
				this.request(this._begin, this._end);
				return;
			}
			catch (e) {
				
			}
		}
    	
        Global.debug(`Loader error, code = ${data.code}, msg = ${data.msg}`);
        this._emitter.emit(MSEEvents.HTTP_DOWNLOAD_DATA_ERROR);
    }
}