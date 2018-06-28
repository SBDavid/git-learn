import Global from "../../../cn/pplive/player/manager/Global";
import Mp4Header from "./Mp4Header";
import MP4 from '../../live/remux/mp4-generator';
import MSEEvents from '../../event/mse-events.js';
import SPSParser from '../../live/demux/sps-parser.js';
import {Stream} from "../../../cn/pplive/player/crypto/stream";
import FMP4Remuxer from './FMP4Remuxer.js';
import EventEmitter from 'events';

const VIDEO_SAMPLE_TYPE = 1;
const AUDIO_SAMPLE_TYPE = 2;
export default class Mp4Stream {
    constructor(fmp4) {
    	this._emitter = new EventEmitter();
        this.header = new Mp4Header();
        this._hasMdatBoxHeader = false;
        this._inputBuffer = new Stream();

        this._isSeek = false;
        this._mdatBoxSize = 0;//mp4中mdat的size
        this._inputDataOffset = 0;//每次appendBytes 读取的数据的总和
        this._currentSampleIndex = 0;
        this._currentSample = null;
        this._currentSampleOffset = 0;//当前解析的帧 在总的mp4中的偏移

        this._audioSyncSample = 0;

        this._baseVideoTimeStamp = 0;
		this._baseAudioTimeStamp = 0;

        this._videoTrack = {type: 'video', id: 1, sequenceNumber: 0, samples: [], length: 0};
        this._audioTrack = {type: 'audio', id: 2, sequenceNumber: 0, samples: [], length: 0};

        this._audioMetadata = null;
        this._videoMetadata = null;

        this._fmp4 = fmp4;//new FMP4Remuxer();        
        this.header.on(MSEEvents.MP4_HEADER_OK, this._mp4HeaderOK); 
        this.header.on(MSEEvents.MP4_HEADER_ERROR, this._mp4HeaderError); 
    }

    hasMp4Header(){
        return this.header && this.header.isComplete;
    }

    getRealSeekTime(currentTime, newTime)
    {
        return this.header.getVideoSampleTime(this.header.getVideoSampleIndexFromTime(currentTime, newTime)); ;
    }

    appendBytes(bytesStream){        
       let pos;
       try{
        	 pos = bytesStream.position;
        }
       catch(e){
       	 Global.debug("header has Error!!!");
       }
        if (!this.header.isComplete)
        {
            this.header.appendBytes(bytesStream);
        }
        
        if (!this.header.isValid)
        {
            //TODO(herain):need dispatch error event when mp4 header has error.
            Global.debug("header has Error!!!");
            return;
        }
        
        if (!this._isSeek && !this._hasMdatBoxHeader && bytesStream.bytesAvailable() != 0)
        {
            this._readAtMost(bytesStream, this._inputBuffer, this._inputBuffer.length(), 8 - this._inputBuffer.length());
            
            if (this._inputBuffer.length() == 8)
            {
                this._inputBuffer.position = 0;
                this._mdatBoxSize = this._inputBuffer.readInt();
                this._hasMdatBoxHeader = true;
                this._inputBuffer.clear();
            }
        }
        
        this._inputDataOffset += bytesStream.position - pos;

        while (bytesStream.bytesAvailable() != 0)
        {
        	if(!this.header) break;	
            pos = bytesStream.position;
            
            this._readOneSample(bytesStream);
            this._inputDataOffset += bytesStream.position - pos;        
        }
        
        bytesStream = null;
    }
    
    setBaseTimeStamp(videoTimeStamp, audioTimeStamp)
	{
		this._baseVideoTimeStamp = videoTimeStamp;		
		this._baseAudioTimeStamp = audioTimeStamp;
	}
	
	getTimeSampleInfo(currentTime, newTime)
	{
		let seekVideoSampleIndex = this.header.getVideoSampleIndexFromTime(currentTime, newTime);
        // find audio sample corresponding to video sync sample
        let seekAudioSampleIndex = this.header.getAudioSampleIndexFromVideoSampleIndex(seekVideoSampleIndex);        
        let videoSampleOffset = this.header.getSampleOffset(VIDEO_SAMPLE_TYPE, seekVideoSampleIndex);
        let audioSampleOffset = this.header.getSampleOffset(AUDIO_SAMPLE_TYPE, seekAudioSampleIndex); 
        if (videoSampleOffset < audioSampleOffset)
        {              
            return videoSampleOffset;
        }
        else
        {
            return audioSampleOffset;
        }
	}

    seek(currentTime, newTime)
    {	
        Global.debug("seek currentTime= " + currentTime + " ,newTime=" + newTime);
        this._inputBuffer.clear();
        this._currentSample = null;
        this._isSeek = true;
        this._fmp4.reset();
        this._videoTrack = {type: 'video', id: 1, sequenceNumber: 0, samples: [], length: 0};
        this._audioTrack = {type: 'audio', id: 2, sequenceNumber: 0, samples: [], length: 0};
        
        // find video sync sample around start second
        let seekVideoSampleIndex = this.header.getVideoSampleIndexFromTime(currentTime, newTime);
        // find audio sample corresponding to video sync sample
        let seekAudioSampleIndex = this.header.getAudioSampleIndexFromVideoSampleIndex(seekVideoSampleIndex);
        this._audioSyncSample = seekAudioSampleIndex;
        
        let videoSampleOffset = this.header.getSampleOffset(VIDEO_SAMPLE_TYPE, seekVideoSampleIndex);
        let audioSampleOffset = this.header.getSampleOffset(AUDIO_SAMPLE_TYPE, seekAudioSampleIndex); 
        if (videoSampleOffset < audioSampleOffset)
        {
            while (audioSampleOffset > videoSampleOffset && seekAudioSampleIndex > 0)
            {
                --seekAudioSampleIndex;
                audioSampleOffset = this.header.getSampleOffset(AUDIO_SAMPLE_TYPE, seekAudioSampleIndex);
            }
            
            if (seekAudioSampleIndex == 0)
            {
                this._currentSampleIndex = seekVideoSampleIndex;
            }
            else
            {
                this._currentSampleIndex = seekVideoSampleIndex + seekAudioSampleIndex + 1;
            }
            
            this._inputDataOffset = videoSampleOffset;    
            return videoSampleOffset;
        }
        else
        {
            while (videoSampleOffset > audioSampleOffset && seekVideoSampleIndex > 0)
            {
                --seekVideoSampleIndex;
                videoSampleOffset = this.header.getSampleOffset(VIDEO_SAMPLE_TYPE, seekVideoSampleIndex);
            }
            
            if (seekVideoSampleIndex == 0)
            {
                this._currentSampleIndex = seekAudioSampleIndex;
            }
            else
            {
                this._currentSampleIndex = seekVideoSampleIndex + seekAudioSampleIndex + 1;
            }
            
            this._inputDataOffset = audioSampleOffset;  
	        return audioSampleOffset;
        }
    }

    remux(){
        if(this._videoMetadata &&  this._audioMetadata)
        {
            this._fmp4.remux(this._audioTrack, this._videoTrack);
            this._videoTrack = {type: 'video', id: 1, sequenceNumber: 0, samples: [], length: 0};
            this._audioTrack = {type: 'audio', id: 2, sequenceNumber: 0, samples: [], length: 0};
        }
    }    
    
    reset(){
     	this._inputBuffer.clear();
        this._videoTrack = {type: 'video', id: 1, sequenceNumber: 0, samples: [], length: 0};
        this._audioTrack = {type: 'audio', id: 2, sequenceNumber: 0, samples: [], length: 0};
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
		this.header.off(MSEEvents.MP4_HEADER_OK, this._mp4HeaderOK); 
        this.header.off(MSEEvents.MP4_HEADER_ERROR, this._mp4HeaderError); 
        this.header.destroy();
        this.header = null;        
        this._inputBuffer.clear();
		this._inputBuffer = null;
        this._currentSample = null;
        this._videoTrack = null;
        this._audioTrack = null;
        this._audioMetadata = null;
        this._videoMetadata = null;
        this._fmp4 = null;
    }
    
    _readAtMost(srcBytes, destBytes, destOffset, maxLength)
    {
        if (srcBytes.bytesAvailable() > maxLength)
        {
            srcBytes.readBytes(destBytes, destOffset, maxLength);
        }
        else
        {
            srcBytes.readBytes(destBytes, destOffset, srcBytes.bytesAvailable());
        }
    }

    _readOneSample(bytes)
    {      
        if (this._currentSampleIndex < this.header.sampleCount)
        {
            if (!this._currentSample)
            {
                this._currentSample = this.header.getSample(this._currentSampleIndex);
                this._currentSampleOffset = this.header.getSampleOffset(this._currentSample.type, this._currentSample.index);
            }
            if (this._inputDataOffset < this._currentSampleOffset)
            {
                if (this._inputDataOffset + bytes.bytesAvailable() <= this._currentSampleOffset)
                {
                    Global.debug("throw rubbish data " + bytes.bytesAvailable() + " bytes");
                    bytes.position = bytes.length();
                    return;
                }
                else
                {
                    Global.debug("throw rubbish data " + (this._currentSampleOffset - this._inputDataOffset) + " bytes");
                    bytes.position += this._currentSampleOffset - this._inputDataOffset;
                }
            }

            let sampleSize = this.header.getSampleSize(this._currentSample.type, this._currentSample.index);
            this._readAtMost(bytes, this._inputBuffer, this._inputBuffer.length(), sampleSize - this._inputBuffer.length());
            this._inputBuffer.position = 0;
            if (this._inputBuffer.length() == sampleSize)
            {
                if (this._currentSample.type == VIDEO_SAMPLE_TYPE)
                    this._assembleVideoTag();
                else
                    this._assembleAudioTag();
                
                this._inputBuffer.clear();
                this._currentSample = null;
//              Global.debug("send sample " + this._currentSampleIndex + "/" + this.header.sampleCount);
               
                ++this._currentSampleIndex;
                
                if (this._currentSampleIndex == this.header.sampleCount)
				{
					this._reportSegmentCompelete();
				}
            }
        }
        else
		{
			// all sample has been read already, ignore redundant bytes
			bytes.position = bytes.length();
			this._reportSegmentCompelete();
		}
    }

    _generateVideoInitSegment(){
        this.header.AVCDecoderConfigurationRecord.position = 4;
        this._naluLengthSize = (this.header.AVCDecoderConfigurationRecord.readByte() & 3) + 1;  // lengthSizeMinusOne
        if (this._naluLengthSize !== 3 && this._naluLengthSize !== 4) {  // holy shit!!!
            // this._onError(DemuxErrors.FORMAT_ERROR, `Flv: Strange NaluLengthSizeMinusOne: ${this._naluLengthSize - 1}`);
            return;
        }
        let spsCount = this.header.AVCDecoderConfigurationRecord.readByte() & 31;  // numOfSequenceParameterSets
        if (spsCount === 0 || spsCount > 1) {
            // this._onError(DemuxErrors.FORMAT_ERROR, `Flv: Invalid H264 SPS count: ${spsCount}`);
            return;
        }
        let meta = this._videoMetadata;
        if (!meta) {
            meta = this._videoMetadata = {};
        } else {
            if (typeof meta.avcc !== 'undefined') {
                Global.debug('Found another AVCDecoderConfigurationRecord!');
            }
        }
        for (let i = 0; i < spsCount; i++) {            
            this.header.AVCDecoderConfigurationRecord.readByte();
            let spsLen = this.header.AVCDecoderConfigurationRecord.readByte();
            let sps = new Uint8Array((this.header.AVCDecoderConfigurationRecord.pool).slice(this.header.AVCDecoderConfigurationRecord.position,spsLen + this.header.AVCDecoderConfigurationRecord.position));//解析avcc 里的 sps
            this.header.AVCDecoderConfigurationRecord.position += spsLen;
            let config = SPSParser.parseSPS(sps);
            meta = {        
                    timescale:1000,//this.header.timeScale,    
                    duration:(this.header.duration + this._baseVideoTimeStamp)/ 1000,
                    type:'video',
                    id:1,
                    presentWidth:config.present_size.width,
                    presentHeight:config.present_size.height,
                    codecWidth:config.codec_size.width,
                    codecHeight:config.codec_size.height,
                    profile:config.profile_string,
                    level : config.level_string,
                    bitDepth : config.bit_depth,
                    chromaFormat : config.chroma_format,
                    sarRatio : config.sar_ratio,
                    frameRate : config.frame_rate,
                    avcc:new Uint8Array(this.header.AVCDecoderConfigurationRecord.pool)
                };
           
            let fps_den = meta.frameRate.fps_den;
            let fps_num = meta.frameRate.fps_num;
            meta.refSampleDuration = Math.floor(meta.timescale * (fps_den / fps_num));
            let codecArray = sps.subarray(1, 4);
            let codecString = 'avc1.';
            for (let j = 0; j < 3; j++) {
                let h = codecArray[j].toString(16);
                if (h.length < 2) {
                    h = '0' + h;
                }
                codecString += h;
            }
            meta.codec = codecString;
        }
        
        //调整baseVideoTimeStamp
		this._baseVideoTimeStamp -= this._baseVideoTimeStamp % meta.refSampleDuration;
		
        this._fmp4.onTrackMetadataReceived('video', meta);
    }

    _assembleVideoTag()
    {    	
        if (!this._videoMetadata)
        {
            this._generateVideoInitSegment();//头信息
        }
        let isSyncSample = this.header.isVideoSyncSample(this._currentSample.index);
        let timeStamp = this._baseVideoTimeStamp + this.header.calcVideoTimeStamp(this._currentSample.index);		
//		console.log('@@@@@@@@@@this._baseVideoTimeStamp=' + this._baseVideoTimeStamp + ',calcVideoTimeStamp=' + this.header.calcVideoTimeStamp(this._currentSample.index) )
//      Global.debug("video sample " + this._currentSample.index + " ready, timestamp:" + timeStamp + "ms.");
        const lengthSize = this._naluLengthSize;
        let keyframe = (isSyncSample === true);  // from FLV Frame Type constants
        let units = [], length = 0;
        while(this._inputBuffer.bytesAvailable() > 0)
        {
            if (this._inputBuffer.bytesAvailable() <= 4) {
                Global.debug(`data not enough for next Nalu`);
                break;  // data not enough for next Nalu
            }
            let naluSize = this._inputBuffer.readInt();
            if (lengthSize === 3) {
                naluSize >>>= 8;
            }
            if (naluSize > this._inputBuffer.bytesAvailable()) {
                // Global.debug(this.TAG, `Malformed Nalus near timestamp ${dts}, NaluSize > DataSize!`);
                return;
            }

            let unitType = this._inputBuffer.readByte() & 0x1f;
            
            if (unitType === 5) {  // IDR
                keyframe = true;
            }
//          Global.debug('naluSize=' + naluSize + ',unitType=' +  unitType);
            let data = new Stream();
            this._inputBuffer.position -= 5;
            this._inputBuffer.readBytes(data,this._inputBuffer.position,(naluSize + lengthSize ) );
            let unit = {type: unitType, data: new Uint8Array(data.pool)};
            units.push(unit); 
            length += data.length();           
        }
        if(keyframe) this.remux();

        let cts = this.header.getVideoSampleCompositionTimeInMs(this._currentSample.index);
        if (units.length) {
            let track = this._videoTrack;
            let avcSample = {
                units: units,
                length: length,
                isKeyframe: keyframe,
                dts: timeStamp,									//此段Video 的 时间戳
                cts: cts,									//CompositionTime （表示PTS相对于DTS的偏移值 ）
                pts: (timeStamp + cts)							//即显示时间戳，这个时间戳用来告诉播放器该在什么时候显示这一帧的数据。
            };
            track.samples.push(avcSample);
            track.length += length;
            if (keyframe) {
                avcSample.fileposition = 0;
            }
        }       
    }

    _assembleAudioTag(){
        let timeStamp = this._baseAudioTimeStamp + this.header.calcAudioTimeStamp(this._currentSample.index);	
        let track = this._audioTrack;
		if (!this._audioMetadata)
        {
            this._generateAudioInitSegment();
        }
//      Global.debug("audio sample " + this._currentSample.index + " ready, timestamp:" + timeStamp + "ms.");
        let dts = timeStamp;
        let aacSample = {unit: new Uint8Array(this._inputBuffer.pool), dts: dts, pts: dts};
        track.samples.push(aacSample);
        track.length += this._inputBuffer.length();
    }

    _generateAudioInitSegment()
    {
        let meta = this._audioMetadata;
        let track = this._audioTrack;
        if (!meta || !meta.codec) {
            // initial metadata
            meta = this._audioMetadata = {};
            meta.type = 'audio';
            meta.id = track.id;
            meta.timescale = 1000;
            meta.duration = this.header.duration / 1000;
            meta.audioSampleRate = 44100;
            meta.channelCount = 2;
            meta.refSampleDuration = Math.round(1024 / meta.audioSampleRate * meta.timescale * 100) / 100;
            meta.codec = 'mp4a.40.5';
       }
        let aacData = {data:this._parseAACAudioSpecificConfig()} ;
        if (aacData == undefined) {
            return;
        }
        if (meta.config) {
            Global.debug('Found another AudioSpecificConfig!');
        }
        let misc = aacData.data;
        meta.audioSampleRate = misc.samplingRate;
        meta.channelCount = misc.channelCount;
        meta.codec = misc.codec;
        meta.config = misc.config;
        // The decode result of an aac sample is 1024 PCM samples
        meta.refSampleDuration = Math.round(1024 / meta.audioSampleRate * meta.timescale * 100) / 100;

        this._fmp4.onTrackMetadataReceived('audio', meta);
    }

    _parseAACAudioSpecificConfig() {
        let audio = this.header.AudioSpecificConfig;
        audio.position = 0;
        let config = null;
        let mpegSamplingRates = [96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000, 7350];       
        
        let byte0 = audio.readByte();
        let byte1 = audio.readByte();
        let byte2 = audio.readByte();
        /* Audio Object Type:
           0: Null
           1: AAC Main
           2: AAC LC
           3: AAC SSR (Scalable Sample Rate)
           4: AAC LTP (Long Term Prediction)
           5: HE-AAC / SBR (Spectral Band Replication)
           6: AAC Scalable
        */
        let audioObjectType = 0;
        let originalAudioObjectType = 0;
        let audioExtensionObjectType = null;
        let samplingIndex = 0;
        let extensionSamplingIndex = null;      
        // 5 bits
        audioObjectType = originalAudioObjectType = byte0 >>> 3;
        // 4 bits
        samplingIndex = (byte0 & 0x07) << 1 | byte1 >>> 7;
        if (samplingIndex < 0 || samplingIndex >= mpegSamplingRates.length) {
            // this._onError(_demuxErrors2.default.FORMAT_ERROR, 'Flv: AAC invalid sampling frequency index!');
            return;
        }
        let samplingFrequence = mpegSamplingRates[samplingIndex];
        
        // 4 bits
        let channelConfig = (byte1 & 0x78) >>> 3;
        if (channelConfig < 0 || channelConfig >= 8) {
            // this._onError(_demuxErrors2.default.FORMAT_ERROR, 'Flv: AAC invalid channel configuration');
            return;
        }
        if (audioObjectType === 5) {
            // HE-AAC?
            // 4 bits
            extensionSamplingIndex = (byte1 & 0x07) << 1 | byte2 >>> 7;
            // 5 bits
            audioExtensionObjectType = (byte2 & 0x7C) >>> 2;
        }
        // workarounds for various browsers
        let userAgent = window.navigator.userAgent.toLowerCase();
 
             if (userAgent.indexOf('firefox') !== -1) {
                 // firefox: use SBR (HE-AAC) if freq less than 24kHz
                 if (samplingIndex >= 6) {
                     audioObjectType = 5;
                     config = new Array(4);
                     extensionSamplingIndex = samplingIndex - 3;
                 } else {
                     // use LC-AAC
                     audioObjectType = 2;
                     config = new Array(2);
                     extensionSamplingIndex = samplingIndex;
                 }
             } else if (userAgent.indexOf('android') !== -1) {
                 // android: always use LC-AAC
                 audioObjectType = 2;
                 config = new Array(2);
                 extensionSamplingIndex = samplingIndex;
             } else {
                 // for other browsers, e.g. chrome...
                 // Always use HE-AAC to make it easier to switch aac codec profile
                 audioObjectType = 5;
                 extensionSamplingIndex = samplingIndex;
                 config = new Array(4);
 
                 if (samplingIndex >= 6) {
                     extensionSamplingIndex = samplingIndex - 3;
                 } else if (channelConfig === 1) {
                     // Mono channel
                     audioObjectType = 2;
                     config = new Array(2);
                     extensionSamplingIndex = samplingIndex;
                 }
             }
 
             config[0] = audioObjectType << 3;
             config[0] |= (samplingIndex & 0x0F) >>> 1;
             config[1] = (samplingIndex & 0x0F) << 7;
             config[1] |= (channelConfig & 0x0F) << 3;
             if (audioObjectType === 5) {
                 config[1] |= (extensionSamplingIndex & 0x0F) >>> 1;
                 config[2] = (extensionSamplingIndex & 0x01) << 7;
                 // extended audio object type: force to 2 (LC-AAC)
                 config[2] |= 2 << 2;
                 config[3] = 0;
             }
 
             return {
                 config: config,
                 samplingRate: samplingFrequence,
                 channelCount: channelConfig,
                 codec: 'mp4a.40.' + audioObjectType,
                 originalAudioObjectType: originalAudioObjectType
             };
    }    
    
    _reportSegmentCompelete()
	{
		this.remux();
		this._emitter.emit(MSEEvents.SEGMENT_REMUX_COMPLETE, (this._baseVideoTimeStamp + this.header.durationInMsVideo), (this._baseAudioTimeStamp + this.header.durationInMsAudio));
	}
	
	_mp4HeaderOK = () => {
		this._emitter.emit(MSEEvents.MP4_HEADER_OK);
	}
	
	_mp4HeaderError = () => {
		this._emitter.emit(MSEEvents.MP4_HEADER_ERROR);
	}
}