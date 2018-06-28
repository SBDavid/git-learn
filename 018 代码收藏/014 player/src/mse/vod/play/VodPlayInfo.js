import Global from "../../../cn/pplive/player/manager/Global";

export default class VodPlayInfo{
	constructor(host, backhost, channelid, rid, variables ,bwtype,segments)
	{
		Global.debug('creat PlayInfo')

		this.host = host;
		this.fileName = rid;
		this.variables = variables;
		this.bwType = bwtype;
		this.segments = segments;
		this.backhost = backhost;
		this.duration = 0;
		this.backupHostVector = this.backhost.split(',');
		this._calcDuration();

	}

	constructDrmURL(segmentIndex, host = null) {
		if (host == null) {
			host = this.host;
		}
		
		let baseUrl = "//" + host + "/" + segmentIndex + "/0/1023/" + this.fileName + '?fpp.ver=1.0.0' + '&get_drm_header=true';
		return this.addVariables(baseUrl);
	}

	constructCdnURL(segmentIndex, host = null, start = 0, end = 0) {
		if (host == null) {
			host = this.host;
		}
		
		let baseUrl;
		
		if (start == 0 && end == 0) {
			baseUrl = "//" + host + "/" + segmentIndex + "/" + this.fileName;
		}
		else {
			baseUrl = "//" + host + "/" + segmentIndex + "/" + start + "/" + end + "/" + this.fileName;
		}
		
		baseUrl += '?fpp.ver=1.0.0';
		
		return this.addVariables(baseUrl);
	}

	addVariables(baseUrl) {
		if (this.variables) {
			baseUrl += '&' + this.variables;
		}
		
		return baseUrl;
	}

	_calcDuration()
	{
		let totalDuration = 0;
		for (let i = 0; i < this.segments.length; ++i)
		{
			totalDuration += this.segments[i].duration;	
		}
		this.duration = totalDuration;
	}
}