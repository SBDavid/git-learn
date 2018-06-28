import Global from "../../../cn/pplive/player/manager/Global";
import {Stream} from "../../../cn/pplive/player/crypto/stream";
import EventEmitter from 'events';
import MSEEvents from '../../event/mse-events.js';

const VIDEO_TRAK_BOX_TYPE = 1;
const AUDIO_TRAK_BOX_TYPE = 2;
const VIDEO_SAMPLE_TYPE = 1;
const AUDIO_SAMPLE_TYPE = 2;
export default class Mp4Header {
    constructor() {
    	this._emitter = new EventEmitter();
        this._hasMoovBox = false;
        this._hasFtypBox = false;
        this._hasError = false;
        this._inputBuffer = new Stream();
        this.AVCDecoderConfigurationRecord;
        this.AudioSpecificConfig;
        this._videoSampleOffsetArray = [];//每个sample的offset
        this._audioSampleOffsetArray = [];

        this._trakTimeScale = 0;
        this._trakBoxType = 0;

        this._videoDuration = 0;
        this._videoDeltaSum = 0;
        this._videoTimeScale = 0;
        this._videoSampleCount = 0;
        this._videoSampleDeltaArray;
        this._videoSampleCompositionTime;
        this._videoSyncSample =  [];
        this._videoSampleSize = [];
        this._videoChunkInfo = [];
        this._videoChunkOffset = [];
        this._videoChunks = [];

		this._audioDuration = 0;
 		this._audioDeltaSum = 0;
        this._audioTimeScale = 0;
        this._audioSampleCount =0;
        this._audioSampleDeltaArray;
        this._audioSampleSize = [];
        this._audioChunkInfo = [];
        this._audioChunkOffset = [];
        this._audioChunks = [];

        this._samples = [];

    }
    appendBytes(bytes){	
        let bytesStream = bytes;
        if (!this._hasFtypBox && bytesStream.bytesAvailable() != 0)
        {
            let ftypBoxLength = bytesStream.readInt();
//          Global.debug("ftypBoxLength:" + ftypBoxLength);
            bytesStream.position += ftypBoxLength - 4;
            this._hasFtypBox = true;
        }

        if (!this._hasMoovBox && bytesStream.bytesAvailable() != 0)
        {
            if (this._inputBuffer.length() == 0)
            {
                // has no moov data in inputBuffer, write moov_box_length into inBuffer
                bytesStream.readBytes(this._inputBuffer, 0, 4);
            }
            this._inputBuffer.position = 0;
            let moovBoxLength = this._inputBuffer.readInt();
//          Global.debug("moovBoxLength:" + moovBoxLength);
            this._inputBuffer.position = this._inputBuffer.length();
            let read_length = moovBoxLength - this._inputBuffer.length();
            if (bytesStream.bytesAvailable() > read_length)
            {
                bytesStream.readBytes(this._inputBuffer, this._inputBuffer.position, read_length);
            }
            else
            {
                bytesStream.readBytes(this._inputBuffer, this._inputBuffer.position, bytesStream.bytesAvailable() );
            }

            if (this._inputBuffer.length() == moovBoxLength)
            {
                this._hasMoovBox = true;
                if (!this._parseMoovBox())
                {
                    this._hasError = true;
                    this._inputBuffer.clear();
                    Global.debug("Header has Error!!!");
                    this._emitter.emit(MSEEvents.MP4_HEADER_ERROR);
                }
                else
                {
                    this._inputBuffer.clear();
                    Global.debug("Header is OK");
                    this._emitter.emit(MSEEvents.MP4_HEADER_OK);
                }
            }
        }
    }    
        
    on(event, listener) {
        this._emitter.addListener(event, listener);
    }

    off(event, listener) {
        this._emitter.removeListener(event, listener);
    }

    get isComplete()
    {
        return this._hasMoovBox && !this._hasError;
    }

    get isValid()
    {
        return !this._hasError;
    }
    
    get timeScale()
    {
        return this._trakTimeScale;
    }

    get duration()
    {
        return this._videoDuration;
    }

    get sampleCount()
    {
        return this._samples.length;
    }

    getSample(index)
    {
        return this._samples[index];
    }

    getSampleOffset(type, index)
    {
        if (type == VIDEO_SAMPLE_TYPE)
        {
            return this._videoSampleOffsetArray[index];
        }
        else
        {
            return this._audioSampleOffsetArray[index];
        }
    }

    getSampleSize(type, index)
    {
        if (type == VIDEO_SAMPLE_TYPE)
        {
            return this._videoSampleSize[index];
        }
        else
        {
            return this._audioSampleSize[index];
        }
    }

    isVideoSyncSample(index)
    {
    	let i ;
    	for(i = 0 ; i < this._videoSyncSample.length ; i ++)
    	{
    		if(this._videoSyncSample[i] == index + 1)　
    			return true;
    	}
        return false;
    }

    getVideoSampleCompositionTimeInMs(index)
    {
        // ctts box可能没有，这时候默认所有composition time�?.
        return (this._videoSampleCompositionTime == null) ? 0 : 
            (this._videoSampleCompositionTime[index] * 1000 / this._videoTimeScale);
    }

    calcVideoTimeStamp(sampleIndex)
    {
        return parseInt(this._videoSampleDeltaArray[sampleIndex] * 1000 / this._videoTimeScale);
    }

    calcAudioTimeStamp(sampleIndex)
    {
    	return parseInt(this._audioSampleDeltaArray[sampleIndex] * 1000 / this._audioTimeScale);
    }

    getVideoSampleTime(index)
    {
        return this.calcVideoTimeStamp(index) / 1000;
    }

    getVideoSampleIndexFromTime(currentTime, newTime)
    {
        let currentSyncPos = this._getIndexInVideoSyncSampleTable(currentTime);
        let newSyncPos = this._getIndexInVideoSyncSampleTable(newTime);
        
        if (currentSyncPos == newSyncPos)
        {
            if (currentTime + 0.1 < newTime)
            {
                if (newSyncPos < this._videoSyncSample.length - 1)
                {
//                  ++newSyncPos;
                }
            }
            else if (newTime + 0.1 < currentTime)
            {
                if (newSyncPos > 0)
                {
                    --newSyncPos;
                }
            }
        }
        
        return this._videoSyncSample[newSyncPos] - 1;
    }

    getAudioSampleIndexFromVideoSampleIndex(videoSampleIndex)
    {
        let audioSampleDelta = this.calcVideoTimeStamp(videoSampleIndex) * this._audioTimeScale / 1000;
        let audioSmapleIndex;
        for( audioSmapleIndex = 0 ; audioSmapleIndex < this._audioSampleDeltaArray.length - 1; audioSmapleIndex ++)
        {
            if(audioSampleDelta >= this._audioSampleDeltaArray[audioSmapleIndex] && audioSampleDelta < this._audioSampleDeltaArray[audioSmapleIndex + 1])  break;
        }
        if (audioSmapleIndex < 0)
        {			
            audioSmapleIndex = ~audioSmapleIndex;
            audioSmapleIndex -= 1;		// herain:在没有恰好命中一个音频sample的时候返回拖动点前的第一个音频sample
        }
        
        return audioSmapleIndex;
    }
    
    get durationInMsVideo()
	{
		return this._videoDuration;
	}
	
	get durationInMsAudio()
	{
		return this._audioDuration;
	}
	
	destroy(){
		this._inputBuffer.clear();
		this._inputBuffer = null;
		
		if(this.AVCDecoderConfigurationRecord)
		{
			this.AVCDecoderConfigurationRecord.clear();
        	this.AVCDecoderConfigurationRecord = null;			
		}
        
        if(this.AudioSpecificConfig)
        {
        	this.AudioSpecificConfig.clear();
        	this.AudioSpecificConfig = null;
        }        
        
        this._videoSampleOffsetArray = null;
        this._audioSampleOffsetArray = null;

        this._trakTimeScale = 0;
        this._trakBoxType = 0;

        this._videoSampleDeltaArray = null;
        this._videoSampleCompositionTime = null;
        this._videoSyncSample = null;
        this._videoSampleSize = null;
        this._videoChunkInfo = null;
        this._videoChunkOffset = null;
        this._videoChunks = null;

        this._audioSampleDeltaArray = null;
        this._audioSampleSize = null;
        this._audioChunkInfo = null;
        this._audioChunkOffset = null;
        this._audioChunks = null;
        this._samples = null;
        
        this._emitter.removeAllListeners();
		this._emitter = null;
	}

    _getIndexInVideoSyncSampleTable(time)
    {
        let videoSampleIndex;
        let samplePos , syncSamplePos;
        for( samplePos = 0 ; samplePos < this._videoSampleDeltaArray.length - 1; samplePos ++)
        {
            if(time * this._videoTimeScale >= this._videoSampleDeltaArray[samplePos] && time * this._videoTimeScale < this._videoSampleDeltaArray[samplePos + 1])  break;
        }
        if (samplePos >= 0)
        {
            videoSampleIndex = samplePos;
        }
        else
        {
            videoSampleIndex = ~samplePos;
            if (videoSampleIndex > this._videoSampleDeltaArray.length - 1)
                videoSampleIndex = this._videoSampleDeltaArray.length - 1;
        }
        
        // var syncSamplePos:int = ArrayUtil.bsearchInt(videoSyncSample, videoSampleIndex+1, 0, videoSyncSample.length-1);
        for( syncSamplePos = 0 ; syncSamplePos < this._videoSyncSample.length - 1; syncSamplePos ++)
        {
            if(videoSampleIndex+1 >= this._videoSyncSample[syncSamplePos] && videoSampleIndex+1 < this._videoSyncSample[syncSamplePos + 1])  break;
        }
        if (syncSamplePos < 0)
        {
            syncSamplePos = ~syncSamplePos;
            
            if (syncSamplePos > this._videoSyncSample.length - 1)
            {
                syncSamplePos = this._videoSyncSample.length - 1;
            }
            else if (syncSamplePos > 0)
            {
                --syncSamplePos;
            }
        }
        
        return syncSamplePos;
    }

    _parseMoovBox()
    {
        this._inputBuffer.position = 0;
        if (this._recusiveParseBox(this._inputBuffer.length()))
        {
            this._assembleSamples();
            // this._inputBuffer.clear();
            return true;
        }
        else
        {
            return false;
        }
    }

    _recusiveParseBox(boxEndPosition)
    {        
        while(this._inputBuffer.position < boxEndPosition && this._inputBuffer.bytesAvailable() >= 8)
        {
            let boxBodyLength = this._inputBuffer.readInt() - 8;//inputBuffer.readUnsignedInt() 读取size  32位 就是4个字节
            let box_name = this._inputBuffer.readUTFBytes(4);//读取4个字节数  box类型
            if (this._inputBuffer.bytesAvailable() >= boxBodyLength - 8)
            {
                this._parseBox(box_name, this._inputBuffer.position + boxBodyLength);
            }
            else
            {
                return false;
            }
        }
        
        return this._inputBuffer.position == boxEndPosition;
    }

    _parseBox(box_name, boxEndPosition)
    {
//      Global.debug("parseBox: " + box_name + ", boxEndPosition: " + boxEndPosition);
        if (box_name == "moov" || box_name == "trak" || box_name == "mdia" || box_name == "minf" || box_name == "stbl")
        {
            this._recusiveParseBox(boxEndPosition);
        }
        else if (box_name == "mdhd")
        {
            this._parseMdhdBox(boxEndPosition);
        }
        else if (box_name == "hdlr")
        {
            this._parseHdlrBox(boxEndPosition);
        }
        else if (box_name == "stsd")
        {
            this._parseStsdBox(boxEndPosition);
        }
        else if (box_name == "avc1")
        {
            this._parseAvc1Box(boxEndPosition);
        }
        else if (box_name == "avcC")
        {
            this._parseAvccBox(boxEndPosition);
        }
        else if (box_name == "mp4a")
        {
            this._parseMp4aBox(boxEndPosition);
        }
        else if (box_name == "esds")
        {
            this._parseEsdsBox(boxEndPosition);
        }
        else if (box_name == "stts")
        {
            this._parseSttsBox(boxEndPosition);
        }
        else if (box_name == "ctts")
        {
            this._parseCttsBox(boxEndPosition);
        }
        else if (box_name == "stss")
        {
            this._parseStssBox(boxEndPosition);
        }
        else if (box_name == "stsz")
        {
            this._parseStszBox(boxEndPosition);
        }
        else if (box_name == "stsc")
        {
            this._parseStscBox(boxEndPosition);
        }
        else if (box_name == "stco")
        {
            this._parseStcoBox(boxEndPosition);
        }
        else if (box_name == "co64")
        {
            this._parseCo64Box(boxEndPosition);
        }
        else
        {
            this._inputBuffer.position = boxEndPosition;
        }
    }

    _parseMdhdBox(boxEndPosition)
    {
        let version = this._inputBuffer.readInt();
        if (version == 0)
        {
            this._inputBuffer.position += 8;
            this._trakTimeScale = this._inputBuffer.readInt();//文件媒体在一秒内的刻度值
            this._inputBuffer.position = boxEndPosition;
        }
        else if (version == 1)
        {
            this._inputBuffer.position += 16;
            this._trakTimeScale = this._inputBuffer.readInt();
            this._inputBuffer.position = boxEndPosition;
        }
    }

    _parseHdlrBox(boxEndPosition)
    {
        this._inputBuffer.position += 8;
        let handler_type = this._inputBuffer.readUTFBytes(4);
        if (handler_type == "vide")
        {
            this._trakBoxType = VIDEO_TRAK_BOX_TYPE;
            this._videoTimeScale = this._trakTimeScale;
        }
        else if(handler_type == "soun")
        {
            this._trakBoxType = AUDIO_TRAK_BOX_TYPE;
            this._audioTimeScale = this._trakTimeScale;
        }
        else
        {
            this._trakBoxType = -1;
        }
        
        this._inputBuffer.position = boxEndPosition;
    }

    _parseStsdBox(boxEndPosition)
    {
        this._inputBuffer.position += 8;
        this._recusiveParseBox(boxEndPosition);
    }

    _parseAvc1Box(boxEndPosition)
    {
        this._inputBuffer.position += 78;
        this._recusiveParseBox(boxEndPosition);
    }

    _parseAvccBox(boxEndPosition)
    {
        // AVCDecoderConfigurationRecord contains the same information that would be stored in an avcC box 
        this.AVCDecoderConfigurationRecord = new Stream();
        this._inputBuffer.readBytes(this.AVCDecoderConfigurationRecord, 0, boxEndPosition - this._inputBuffer.position);
    }

    _parseMp4aBox(boxEndPosition)
    {
        this._inputBuffer.position += 28;
        this._recusiveParseBox(boxEndPosition);
    }

    _parseEsdsBox(boxEndPosition)
    {
        // todo 
        // esds box contains 4 bytes 0 and ES_Descriptor
        // ES_Descriptor reference:ISO_IEC_14496-1_2010 7.2.6.5 ES_Descriptor
        // ES_Descriptor tag is 03 and first byte is tag length
        this._inputBuffer.readInt();
        while(this._inputBuffer.position < boxEndPosition)
        {
            let tag = this._inputBuffer.readByte();
            let tagLen;

            switch(tag)
            {
                case 3:
                    tagLen = this._readVariableBitsUInt(this._inputBuffer);
                    this._inputBuffer.position += 2;
                    
                    let flag = this._inputBuffer.readByte();
                    let streamDependenceFlag = flag >> 7;
                    let urlFlag = (flag & 0x00000040) >> 6;
                    let ocrStreamFlag = (flag & 0x00000020) >> 5;
                    if (streamDependenceFlag)
                        this._inputBuffer.position += 2;
                    if (urlFlag)
                    {
                        let urlLength = inputBuffer.readByte();
                        this.inputBuffer.position += urlLength;
                    }
                    if (ocrStreamFlag)
                    this.inputBuffer.position += 2;
                    break;
                case 4:
                    // DecoderConfigDescriptor: tag 04, [length] + 13byte content
                    tagLen = this._readVariableBitsUInt(this._inputBuffer);
                    this._inputBuffer.position += 13;
                    break;
                case 5:
                    // DecoderSpecificInfo: tag 05,
                    // AudioSpecificInfo: ISO_IEC_14496-3_2005.pdf 1.6
                    tagLen = this._readVariableBitsUInt(this._inputBuffer);
                    this.AudioSpecificConfig = new Stream();
                    this._inputBuffer.readBytes(this.AudioSpecificConfig, 0, tagLen);
                    this._inputBuffer.position = boxEndPosition;
                    break;
            }
        }
    }

    _parseSttsBox(boxEndPosition)
    {
        this._inputBuffer.position += 4;
        let entryCount = this._inputBuffer.readInt();
        let sampleCount = 0;
        let delta;
        let sampleDeltaArray = new Array;
        let deltaSum = 0;
        
        for (let i = 0; i < entryCount; ++i)
        {
            let count = this._inputBuffer.readInt();
            delta = this._inputBuffer.readInt();
            
            sampleCount += count;//一共有count个sample，每个sample的duration是delta。
            
            for (let j = 0; j < count; ++j)
            {
                sampleDeltaArray.push(deltaSum);
                deltaSum += delta;
            }
        }
        
        if (this._trakBoxType == VIDEO_TRAK_BOX_TYPE)
        {
            this._videoSampleCount = sampleCount;
            this._videoSampleDeltaArray = sampleDeltaArray;
            this._videoDeltaSum = deltaSum;
        }
        else if (this._trakBoxType == AUDIO_TRAK_BOX_TYPE)
        {
            this._audioSampleCount = sampleCount;
            this._audioSampleDeltaArray = sampleDeltaArray;
            this._audioDeltaSum = deltaSum;
        }
    }

    _parseCttsBox(boxEndPosition)
    {
        this._videoSampleCompositionTime = [];
        this._inputBuffer.position += 4;
        let entryCount = this._inputBuffer.readInt();
        for (let i = 0; i < entryCount; ++i)
        {
            let sampleCount = this._inputBuffer.readInt();
            let compositionTime = this._inputBuffer.readInt();
            for (let j = 0; j < sampleCount; ++j)
            {
                this._videoSampleCompositionTime.push(compositionTime);
            }
        }
    }

    _parseStssBox(boxEndPosition)
    {
        this._inputBuffer.position += 4;
        let entryCount = this._inputBuffer.readInt();
        for (let i = 0; i < entryCount; ++i)
        {
            this._videoSyncSample.push(this._inputBuffer.readInt());
        }
    }

    _parseStszBox(boxEndPosition)
    {
        this._inputBuffer.position += 4;
        let sampleSize = this._inputBuffer.readInt();
        let sampleCount = this._inputBuffer.readInt();
        if (this._trakBoxType == VIDEO_TRAK_BOX_TYPE)
        {
            if (sampleSize == 0)
            {
                for (let i = 0; i < sampleCount; ++i)
                {
                    this._videoSampleSize.push(this._inputBuffer.readInt());
                }
            }
            else
            {
                for (let i = 0; i < sampleCount; ++i)
                {
                    this._videoSampleSize.push(sampleSize);
                }
            }
        }
        else if (this._trakBoxType == AUDIO_TRAK_BOX_TYPE)
        {
            if (sampleSize == 0)
            {
                for (let i = 0; i < sampleCount; ++i)
                {
                    this._audioSampleSize.push(this._inputBuffer.readInt());
                }
            }
            else
            {
                for (let i = 0; i < sampleCount; ++i)
                {
                    this._audioSampleSize.push(sampleSize);
                }
            }
        }
    }     

    //当添加samples到media时，用chunks组织这些sample，这样可以方便优化数据获取。一个trunk包含一个或多个sample，chunk的长度可以不同，chunk内的sample的长度也可以不同。sample-to-chunk atom存储sample与chunk的映射关系。
    //Sample-to-chunk atoms的类型是'stsc'。它也有一个表来映射sample和trunk之间的关系，查看这张表，就可以找到包含指定sample的trunk，从而找到这个sample。
    _parseStscBox(boxEndPosition)
    {
        this._inputBuffer.position += 4;
        let entryCount = this._inputBuffer.readInt();
        for (let i = 0; i < entryCount; ++i)
        {
            let chunk = {};
            chunk.firstChunk = this._inputBuffer.readInt() - 1;	// transform index begin from 0
            chunk.samplesPerChunk = this._inputBuffer.readInt();
            chunk.sampleDescriptionIndex = this._inputBuffer.readInt();
            
            if (this._trakBoxType == VIDEO_TRAK_BOX_TYPE)
            {
                this._videoChunkInfo.push(chunk);
            }
            else if (this._trakBoxType == AUDIO_TRAK_BOX_TYPE)
            {
                this._audioChunkInfo.push(chunk);
            }
        }
    }

    _parseStcoBox(boxEndPosition)
    {
        this._inputBuffer.position += 4;
        let entryCount = this._inputBuffer.readInt();
        for (let i = 0; i < entryCount; ++i)
        {
            if (this._trakBoxType == VIDEO_TRAK_BOX_TYPE)
            {
                this._videoChunkOffset.push(this._inputBuffer.readInt());
            }
            else if (this._trakBoxType == AUDIO_TRAK_BOX_TYPE)
            {
                this._audioChunkOffset.push(this._inputBuffer.readInt());
            }
        }
    }
    
    _parseCo64Box(boxEndPosition)
    {
        this._inputBuffer.position += 4;
        let entryCount = this._inputBuffer.readInt();
        for (let i = 0; i < entryCount; ++i)
        {
            if (this._trakBoxType == VIDEO_TRAK_BOX_TYPE)
            {
                this._videoChunkOffset.push(this._inputBuffer.readDouble());
            }
            else if (this._trakBoxType == AUDIO_TRAK_BOX_TYPE)
            {
                this._audioChunkOffset.push(this._inputBuffer.readDouble());
            }
        }
    }

    _readVariableBitsUInt(bytes)
    {
        let val = 0;
        let num_byte = 0;
        let b;
        do {
            b = bytes.readByte();
            ++num_byte;
            val = (val << 7) | (b & 0x7f);
        } while ((b & 0x80) && num_byte < 4);
        
        return val;
    }    

    _assembleSamples(){
        this._videoDuration = this._videoDeltaSum / this._videoTimeScale * 1000;
        this._audioDuration = this._audioDeltaSum / this._audioTimeScale * 1000;
        this._assembleChunks(VIDEO_TRAK_BOX_TYPE);
        this._assembleChunks(AUDIO_TRAK_BOX_TYPE);
        
        let videoChunkIndex = 0;
        let videoSampleIndex = 0;
        let audioChunkIndex = 0;
        let audioSampleIndex = 0;
        let chunkIndex = 0;
        
        let videoChunksLength = this._videoChunks.length;
        let audioChunksLength = this._audioChunks.length; 
        for(; chunkIndex < videoChunksLength + audioChunksLength; ++chunkIndex)
        {
            let isVideoChunk = true;
            if (videoChunkIndex == videoChunksLength)
                isVideoChunk = false;
            else if (audioChunkIndex != audioChunksLength &&
                this._audioChunks[audioChunkIndex].offset < this._videoChunks[videoChunkIndex].offset)
            {
                isVideoChunk = false;
            }
            
            let i = 0;
            let sample;
            let sampleOffset;
            let chunk;
            if (isVideoChunk)
            {
                chunk = this._videoChunks[videoChunkIndex];
                sampleOffset = chunk.offset;
                for (i = 0; i < chunk.sampleCount; ++i)
                {
                    this._videoSampleOffsetArray.push(sampleOffset);
                    sampleOffset += this._videoSampleSize[videoSampleIndex];
                    
                    sample = {};
                    sample.type = VIDEO_SAMPLE_TYPE;
                    sample.index = videoSampleIndex++;
                    this._samples.push(sample);
                }
                
                videoChunkIndex++;
            }
            else
            {
                chunk = this._audioChunks[audioChunkIndex];
                sampleOffset = chunk.offset;
                for (i = 0; i < chunk.sampleCount; ++i)
                {
                    this._audioSampleOffsetArray.push(sampleOffset);
                    sampleOffset += this._audioSampleSize[audioSampleIndex];
                    
                    sample = {};
                    sample.type = AUDIO_SAMPLE_TYPE;
                    sample.index = audioSampleIndex++;
                    this._samples.push(sample);
                }
                
                audioChunkIndex++;
            }
        }
        
        this._logMediaInfo();
    }

    _assembleChunks(type)
    {
        let chunkInfoArray;
        let totalSampleCount;
        let chunkOffsetArray;
        let chunks;
        if (type == VIDEO_TRAK_BOX_TYPE)
        {
            chunkInfoArray = this._videoChunkInfo;
            totalSampleCount = this._videoSampleCount;
            chunkOffsetArray = this._videoChunkOffset;
            chunks = this._videoChunks;
        }
        else
        {
            chunkInfoArray = this._audioChunkInfo;
            totalSampleCount = this._audioSampleCount;
            chunkOffsetArray = this._audioChunkOffset;
            chunks = this._audioChunks;
        }
        
        let sampleCount = 0;
        let chunkIndex = 0;
        let chunkInfoArrayLength = chunkInfoArray.length;
        for (let chunkInfoIndex = 0; chunkInfoIndex < chunkInfoArrayLength; ++chunkInfoIndex)
        {
            while((chunkInfoIndex != chunkInfoArrayLength - 1) ?(chunkIndex < chunkInfoArray[chunkInfoIndex + 1].firstChunk) : (sampleCount < totalSampleCount))
            {
                let chunk = {};
                chunk.firstSample = sampleCount;
                chunk.sampleCount = chunkInfoArray[chunkInfoIndex].samplesPerChunk;
                chunk.offset = chunkOffsetArray[chunkIndex];
                
                chunks.push(chunk);
                ++chunkIndex;
                sampleCount += chunk.sampleCount;
            }
        }
    }

    _logMediaInfo()
    {
        Global.debug("duration: " +  this._videoDuration + " ms"
                    + "\ntotal sample count:" + this._samples.length
                    + "\nvideo sample count: " +  this._videoSampleSize.length
                    + "\naudio sample count:" +  this._audioSampleSize.length);
    }
}

