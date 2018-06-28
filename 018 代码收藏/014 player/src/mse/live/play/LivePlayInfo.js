import Global from "../../../cn/pplive/player/manager/Global";

export default class LivePlayInfo{
	constructor(host,backhost,channelid,rid,variables,bwtype,start,delay,interval,endtime = -1) {
		Global.debug('creat LivePlayInfo')
		this.rid = rid;
		this.host = host;
		this.backhost = backhost;
		this.channelid = channelid;
		this.variables = variables;
		this.bwtype = bwtype;
		this.delay = delay;
		this.interval = interval;
		this.endtime = endtime;		
		this.start = start;
	}
}