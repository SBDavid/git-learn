import {SampleInfo, MediaSegmentInfo, MediaSegmentInfoList} from '../../core/media-segment-info.js';
import Browser from '../../utils/browser.js';
import MP4 from '../../live/remux/mp4-generator';
import Global from "../../../cn/pplive/player/manager/Global";
import MSEEvents from '../../event/mse-events.js';

// Fragmented mp4 remuxer
export default class FMP4Remuxer {    
        constructor() {
            this._metadata = null;
            this._audioMeta = null;
            this._videoMeta = null;            
            this._videoTrack = null;
            this._audioTrack = null;
            this._audioNextDts = undefined;
            this._videoNextDts = undefined;
            
            this._onInitSegment = null;
        	this._onMediaSegment = null;
        
            this._forceFirstIDR = (Browser.chrome &&
                (Browser.version.major < 50 ||
                (Browser.version.major === 50 && Browser.version.build < 2661))) ? true : false;
        }
        
        reset(){
	        this._audioNextDts = undefined;
	        this._videoNextDts = undefined;
	        this._videoTrack = null;
            this._audioTrack = null;
    	}

        onTrackMetadataReceived(type,metadata) {
            let metabox = null;
    
            if (type === 'audio') {            	
                this._audioMeta = metadata;
                metabox = MP4.generateInitSegment(metadata);
            } else if (type === 'video') {
                this._videoMeta = metadata;
                metabox = MP4.generateInitSegment(metadata);
            } else {
                return;
            }
            if (!this._onInitSegment) {
	            Global.debug('MP4Remuxer: onInitSegment callback must be specified!');
	        }

            this._onInitSegment(type, {
                type: type,
                data: metabox.buffer,
                codec: metadata.codec,
                container: `${type}/mp4`
            });
        }

        remux(audioTrack, videoTrack) {
           if(!this._onMediaSegment) {
               Global.debug('MP4Remuxer: onMediaSegment callback must be specificed!');
           }
           
            this._videoTrack = videoTrack;
            this._audioTrack = audioTrack;
            this._remuxVideo();
            this._remuxAudio();
        }
        
        get onInitSegment() {
        	return this._onInitSegment;
    	}

	    set onInitSegment(callback) {
	        this._onInitSegment = callback;
	    }

	    get onMediaSegment() {
	        return this._onMediaSegment;
	    }
	
	    set onMediaSegment(callback) {
	        this._onMediaSegment = callback;
	    }
        
        destroy() {
	        this._onInitSegment = null;
	        this._onMediaSegment = null;
    	}       
    
        _remuxVideo()
        {
            let track = this._videoTrack;
            if(!track ) return;
            let samples = track.samples;
            let dtsCorrection = undefined;
            let firstDts = -1, lastDts = -1;
            let firstPts = -1, lastPts = -1;
            if (!samples || samples.length === 0) {
                return;
            }
            let bytes = 8 + this._videoTrack.length;
            let mdatbox = new Uint8Array(bytes);
            mdatbox[0] = (bytes >>> 24) & 0xFF;
            mdatbox[1] = (bytes >>> 16) & 0xFF;
            mdatbox[2] = (bytes >>>  8) & 0xFF;
            mdatbox[3] = (bytes) & 0xFF;
            mdatbox.set(MP4.types.mdat, 4);
    
            let offset = 8;
            let mp4Samples = [];
            let info = new MediaSegmentInfo();
            while (samples.length) {
                let avcSample = samples.shift();
                let keyframe = avcSample.isKeyframe;
                let originalDts = avcSample.dts;
//  console.log('@@@@@@@@@@@originalDts=' + originalDts);
                if (dtsCorrection == undefined) {
                    if (this._videoNextDts == undefined) {
                        dtsCorrection = 0;
                    } else {
                        dtsCorrection = originalDts - this._videoNextDts;
                    }
                }
    
                let dts = originalDts - dtsCorrection;
                let cts = avcSample.cts;
                let pts = dts + cts;
    
                if (firstDts === -1) {
                    firstDts = dts;
                    firstPts = pts;
                }
    
                // fill mdat box
                let sampleSize = 0;
                while (avcSample.units.length) {
                    let unit = avcSample.units.shift();
                    let data = unit.data;
                    mdatbox.set(data, offset);
                    offset += data.byteLength;
                    sampleSize += data.byteLength;
                }
    
                let sampleDuration = 0;
    
                if (samples.length >= 1) {
                    let nextDts = samples[0].dts - dtsCorrection;
                    sampleDuration = nextDts - dts;
                } else { 
                    if (mp4Samples.length >= 1) {  // lastest sample, use second last duration
                        sampleDuration = mp4Samples[mp4Samples.length - 1].duration;
                    } else {  // the only one sample, use reference duration
                        sampleDuration = this._videoMeta.refSampleDuration;
                    }
                }
    
                if (keyframe) {
                    let syncPoint = new SampleInfo(dts, pts, sampleDuration, avcSample.dts, true);
                    syncPoint.fileposition = avcSample.fileposition;
                    info.appendSyncPoint(syncPoint);
                }
    
                let mp4Sample = {
                    dts: dts,
                    pts: pts,
                    cts: cts,
                    size: sampleSize,
                    isKeyframe: keyframe,
                    duration: sampleDuration,
                    originalDts: originalDts,
                    flags: {
                        isLeading: 0,
                        dependsOn: keyframe ? 2 : 1,
                        isDependedOn: keyframe ? 1 : 0,
                        hasRedundancy: 0,
                        isNonSync: keyframe ? 0 : 1
                    }
                };
    
                mp4Samples.push(mp4Sample);
            }
    
            let latest = mp4Samples[mp4Samples.length - 1];
            lastDts = latest.dts + latest.duration;
            lastPts = latest.pts + latest.duration;
            this._videoNextDts = lastDts;
//  		console.log('@@@@@@@@@@@latest.duration=' + latest.duration + ',_videoNextDts' +this._videoNextDts);
            // fill media segment info & add to info list
            info.beginDts = firstDts;
            info.endDts = lastDts;
            info.beginPts = firstPts;
            info.endPts = lastPts;
            info.originalBeginDts = mp4Samples[0].originalDts;
            info.originalEndDts = latest.originalDts + latest.duration;
            info.firstSample = new SampleInfo(mp4Samples[0].dts,
                                              mp4Samples[0].pts,
                                              mp4Samples[0].duration,
                                              mp4Samples[0].originalDts,
                                              mp4Samples[0].isKeyframe);
            info.lastSample = new SampleInfo(latest.dts,
                                             latest.pts,
                                             latest.duration,
                                             latest.originalDts,
                                             latest.isKeyframe);
            track.samples = mp4Samples;
            track.sequenceNumber++;
    
            // workaround for chrome < 50: force first sample as a random access point
            // see https://bugs.chromium.org/p/chromium/issues/detail?id=229412
            if (this._forceFirstIDR) {
                let flags = mp4Samples[0].flags;
                flags.dependsOn = 2;
                flags.isNonSync = 0;
            }
    
            let moofbox = MP4.moof(track, firstDts);
            track.samples = [];
            track.length = 0;

            this._onMediaSegment('video', {
                type: 'video',
                data: this._mergeBoxes(moofbox, mdatbox).buffer,
                sampleCount: mp4Samples.length,
                info: info
            });
        }

        _remuxAudio(){
            let track = this._audioTrack;
            if(!track ) return;
            let samples = track.samples;
            let dtsCorrection = undefined;
            let firstDts = -1, lastDts = -1, lastPts = -1;
            let silentFrameDuration = -1;
    
            if (!samples || samples.length === 0) {
                return;
            }
    
            let bytes = 8 + track.length;
            let mdatbox = new Uint8Array(bytes);
            mdatbox[0] = (bytes >>> 24) & 0xFF;
            mdatbox[1] = (bytes >>> 16) & 0xFF;
            mdatbox[2] = (bytes >>>  8) & 0xFF;
            mdatbox[3] = (bytes) & 0xFF;
    
            mdatbox.set(MP4.types.mdat, 4);
    
            let offset = 8;  // size + type
            let mp4Samples = [];
    
            while (samples.length) {
                let aacSample = samples.shift();
                let unit = aacSample.unit;
                let originalDts = aacSample.dts;
    
                if (dtsCorrection == undefined) {
                    if (this._audioNextDts == undefined) {
                        dtsCorrection = 0;
                    } else {
                        dtsCorrection = originalDts - this._audioNextDts;
                    }
                }
    
                let dts = originalDts - dtsCorrection;
                if (firstDts === -1) {
                    firstDts = dts;
                }
    
                let sampleDuration = 0;
    
                if (samples.length >= 1) {
                    let nextDts = samples[0].dts - dtsCorrection;
                    sampleDuration = nextDts - dts;
                } else {
                    if (mp4Samples.length >= 1) {  // use second last sample duration
                        sampleDuration = mp4Samples[mp4Samples.length - 1].duration;
                    } else {  // the only one sample, use reference sample duration
                        sampleDuration = this._audioMeta.refSampleDuration;
                    }
                }                
                sampleDuration = Math.round(sampleDuration * 100 ) / 100;
                let mp4Sample = {
                    dts: dts,
                    pts: dts,
                    cts: 0,
                    size: unit.byteLength,
                    duration: sampleDuration,
                    originalDts: originalDts,
                    flags: {
                        isLeading: 0,
                        dependsOn: 1,
                        isDependedOn: 0,
                        hasRedundancy: 0
                    }
                };
                mp4Samples.push(mp4Sample);
                mdatbox.set(unit, offset);
                offset += unit.byteLength;
            }
            let latest = mp4Samples[mp4Samples.length - 1];
            lastDts = latest.dts + latest.duration;
            this._audioNextDts = lastDts;
    
            // fill media segment info & add to info list
            let info = new MediaSegmentInfo();
            info.beginDts = firstDts;
            info.endDts = lastDts;
            info.beginPts = firstDts;
            info.endPts = lastDts;
            info.originalBeginDts = mp4Samples[0].originalDts;
            info.originalEndDts = latest.originalDts + latest.duration;
            info.firstSample = new SampleInfo(mp4Samples[0].dts,
                                              mp4Samples[0].pts,
                                              mp4Samples[0].duration,
                                              mp4Samples[0].originalDts,
                                              false);
            info.lastSample = new SampleInfo(latest.dts,
                                             latest.pts,
                                             latest.duration,
                                             latest.originalDts,
                                             false);
    
            track.samples = mp4Samples;
            track.sequenceNumber++;
    
            let moofbox = MP4.moof(track, firstDts);
            track.samples = [];
            track.length = 0;

            this._onMediaSegment('audio', {
                type: 'audio',
                data: this._mergeBoxes(moofbox, mdatbox).buffer,
                sampleCount: mp4Samples.length,
                info: info
            });
        }

        _mergeBoxes(moof, mdat) {
            let result = new Uint8Array(moof.byteLength + mdat.byteLength);
            result.set(moof, 0);
            result.set(mdat, moof.byteLength);
            return result;
        }
    }