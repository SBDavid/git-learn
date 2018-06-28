export const CommonUtils = {
	defaultCFG  : {
					playstate : 'stopped'
	},
	/**
	 *	时间格式化
	 *	@millisecond	时间
	 *	@isTimestamp    是否为时间戳
	 *	@digit			时间显示到秒位 || 分位
	 */
	timeFormat(millisecond, isTimestamp, digit) {
		let date = new Date(millisecond);
		let hou = isTimestamp ? date.getHours() : Math.floor(millisecond / 3600);
		let min = isTimestamp ? date.getMinutes() : Math.floor(millisecond % 3600 / 60);
		let sec = isTimestamp ? date.getSeconds() : Math.floor(millisecond % 3600 % 60);
		let int2str = function(num) {
			return (num < 10? '0' : '') + num;
		}
		let arr = [int2str(min), int2str(sec)];
		if (!isTimestamp) {
			if (hou > 0 || digit) arr.unshift(int2str(hou));
		} else arr = [int2str(hou), int2str(min), int2str(sec)];
		return arr.join(':');
	},

	align(v, unit) {
		return parseInt(v / unit) * unit;
	},
	
	upAlign(v, unit) {
		return parseInt((v + unit - 1) / unit) * unit;
	}
}

export const Common = {
	'HTTP_DOWNLOAD_MAX_RETRY_TIMES':10,
	'HTTP_DOWNLOAD_MAX_CHECKSUM_FAIL_COUNT':3,
	'DOWNLOAD_MAX_REST_PLAY_TIME':120,
	'SUBPIECE_SIZE':1024,
	'HEADER_SIZE':1400,
	'HEADER_HASH_SIZE':16,
	'PIECE_SIZE':16 * 1400,//分片的大小
	'RID_LENGTH':16,
	'PIECE_CHECKSUM_OFFSET':48, //HEADER_HASH_SIZE + RID_LENGTH + 4 * 4
	'MAX_PIECES_PER_BLOCK':(1400 - 48) / 4,//最大的分片个数(HEADER_SIZE - PIECE_CHECKSUM_OFFSET) / 4
	'RID_LENGTH' : 16,
	'RID_HEX_STRING_LENGTH' : 32,
	'BWTYPE_NORMAL':0,
	'BWTYPE_HTTP_MORE':1,
	'BWTYPE_HTTP_ONLY':2,
	'BWTYPE_HTTP_PREFERRED':3,
	'BWTYPE_P2P_ONLY':4,
	'TASK_TYPE_NULL':0,
	'TASK_TYPE_HTTP':1,
	'TASK_TYPE_P2P':2,
	'HTTP_DOWNLOAD_DATA_ERROR':'_HTTP_DOWNLOAD_DATA_ERROR_',
	'START_STAGE_LENGTH':30,
	'DOWNLOAD_START_P2P_REST_PLAY_TIME':10,
	'DOWNLOAD_RESUME_HTTP_REST_PLAY_TIME':5,
	'MAX_DATA_LENGTH_OF_EMPTY_BLOCK':5000,
	'CACHE_SIZE_BEFORE_PUSH_POINT_IN_SECONDS':300,	//缓存多少时间的block
	'WAIT_TIME_BEFORE_FAIL_IN_SECONDS':180,//block流fail
	
	'ADD_RESULT_OK': 0,
	'ADD_RESULT_IGNORED' : 1,
	'ADD_RESULT_CHECKSUM_MISMATCH' : 2,
	
	"BLOCK_SIZE" : 2097152, //2048 * 1024 2048k == 2M
	'VOD_SUBPIECE_SIZE':4096,
	"SUBPIECE_NUM_PER_BLOCK":512,
	"PIECE_NUM_PER_BLOCK":16,
	"SUBPIECE_NUM_PER_PIECE":32, 
	'VOD_BYTESTOMP4_INTER':250,
//	"VOD_PIECE_SIZE":131072,//128 * 1024  128k
}
