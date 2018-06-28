import DRMInfoLoader from './DRMInfoLoader';
import Global from "../../../cn/pplive/player/manager/Global";
import HTTPDownloader from './HTTPDownloader';
import HttpDispatcher from './HttpDispatcher';
import MSEEvents from '../../event/mse-events.js';
import EventEmitter from 'events';

const LATENT = 0;
const STARTED = 1;
const STOPPED = 2;
export default class ResourceDownloader{
	constructor(resource, playInfo, segmentIndex) {
		Global.debug('creat ResourceDownloader>>>');
		this._emitter = new EventEmitter();
		this._drmInfoLoader;
		this._resource = resource;
		this._playInfo = playInfo;
		this._segmentIndex = segmentIndex;
		this._requestHeader = false;
		this._offset = -1;
		this._restPlayTime = 0;
		this._state = LATENT;
		this._cdnDownloader = new HTTPDownloader(this._playInfo,this._segmentIndex);
		this._cdnDownloader.on(MSEEvents.RECEIVE_SUBPIECE, this._onReceiveSubpiece);
		this._cdnDownloader.on(MSEEvents.DOWNLOAD_COMPLETE, this._onReceiveComplete);
		this._cdnDownloader.on(MSEEvents.HTTP_DOWNLOAD_DATA_ERROR, this._onHttpError);
	}

	start() {
		if (this._state != LATENT) {
			return;
		}
		
		this._state = STARTED;
		if (!this._resource.isDrmSetup) {
			this._drmInfoLoader = new DRMInfoLoader(this._playInfo, this._segmentIndex);
			this._drmInfoLoader.on('complete', this._onDrmLoaded);
			this._drmInfoLoader.start();
		}
		this._createDispatcher();
	}

	get segmentIndex(){
		return this._segmentIndex;
	}
	
	set offset(offset){
		this._offset = offset;
		this._dispatcher.offset = offset;
	}
	
	get offset(){
        return this._dispatcher.offset;
    }
	
	requestHeader() {
		this._requestHeader = true;
		this._offset = -1;
		
		if (this._state == LATENT) {
			this.start();
		}
		else if (this._state == STARTED && this._dispatcher) {
			this._dispatcher.requestHeader();
		}
	}

	request(offset) {
		this._requestHeader = false;
		this._offset = offset;
		
		if (this._state == LATENT) {
			this.start();
		}
		else if (this._state == STARTED && this._dispatcher) {
			this._dispatcher.request(offset);
		}
	}
	
	set restPlayTime(t) {
		this._restPlayTime = t;
		if (this._state == LATENT) {
			this.start();
		}
		if (this._dispatcher) {
			this._dispatcher.restPlayTime = t;
		}
	}
	
	get isRequestHeader() {
		return this._requestHeader;
	}
		
	on(event, listener) {
        this._emitter.addListener(event, listener);
    }

    off(event, listener) {
        this._emitter.removeListener(event, listener);
    }

	destroy(){
		if (this._drmInfoLoader) {
			this._drmInfoLoader.off('complete', this._onDrmLoaded);
			this._drmInfoLoader.destroy();
			this._drmInfoLoader = null;
		}
		if(this._cdnDownloader)
		{
			this._cdnDownloader.off(MSEEvents.RECEIVE_SUBPIECE, this._onReceiveSubpiece);
			this._cdnDownloader.off(MSEEvents.DOWNLOAD_COMPLETE, this._onReceiveComplete);
			this._cdnDownloader.off(MSEEvents.HTTP_DOWNLOAD_DATA_ERROR, this._onHttpError);
			this._cdnDownloader.destroy();
			this._cdnDownloader = null;
		}
		if(this._dispatcher)
		{
			this._dispatcher.destroy();
			this._dispatcher = null;
		}
		this._emitter.removeAllListeners();
		this._emitter = null;
		this._resource = null;
		this._playInfo = null;
	}

	_onDrmLoaded　= ()　=>　{
		this._resource.drmDecoder = this._drmInfoLoader.drmDecoder;
	}

	_onReceiveSubpiece　=(data)　=>
	{
		if (!this._resource.hasSubPiece(data.subpiece)) {
			this._resource.addSubPiece(data.subpiece, data.data);
		}
		data = null;
	}
	
	_onReceiveComplete　=　()　=>　{
		 if(this._dispatcher.offset < this._resource.length) this._emitter.emit(MSEEvents.DOWNLOAD_COMPLETE, this._dispatcher.offset);
	}
	
	_onHttpError　=　()　=>
	{ 		
		this._emitter.emit(MSEEvents.HTTP_DOWNLOAD_DATA_ERROR );
	} 

	// _onSegmentComplete = () =>{
	// 	 this._emitter.emit(MSEEvents.SEGMENT_DOWNLOAD_COMPLETE);
	// }

	_createDispatcher(){		
		this._dispatcher = new HttpDispatcher(this._resource, this._cdnDownloader);
		// this._dispatcher.on(MSEEvents.SEGMENT_DOWNLOAD_COMPLETE, this._onSegmentComplete)
		if (this._requestHeader) {
			this._dispatcher.requestHeader();
		}
		else if (this._offset >= 0) {
//			Global.debug("request _offset=" + this._offset );
			this._dispatcher.request(this._offset);
		}
	}
}