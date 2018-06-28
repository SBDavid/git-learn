import LivePlayInfo from './mse/live/play/LivePlayInfo';
import VodPlayInfo from './mse/vod/play/VodPlayInfo';
import KernelStream from './mse/core/KernelStream';

export const H5PcCore = {

	createLivePlayInfo(host, bakhost, channelid, rid, variables, bwtype, start, delay, interval, endtime=-1) {
		return new LivePlayInfo(host, bakhost, channelid, rid, variables, bwtype, start, delay, interval, endtime);
	},

	createVodPlayInfo(host, backupHost, channelid, rid, variables ,bwtype,segments){
		return new VodPlayInfo(host, backupHost, channelid, rid, variables ,bwtype,segments)
	},
	
	createPlayerStream(player, config) {
		return new KernelStream(player,config);
	}
}