var AnalyzeCommon = require("./AnalyzeCommon");
var vurl = document.location.href;
var urlObj = url2obj(vurl);
var isWeb = vurl.indexOf('search.pptv.com') >= 0;

function url2obj(url) {
	if (!url) {
		return null;
	}
	var ret = {};
	var qryArr = url.slice(url.indexOf('?') + 1).split('&');
	for (var i = 0; i < qryArr.length; i++) {
		var kv = qryArr[i].split('=');
		ret[kv[0]] = ret[kv[1]];
	}
	return ret;
}

// 如果ssa没有加载完成则，临时保存在pool中。
var requestPool = [];

// 统计发送代理，如果ssa没有加载好则推入requestPool
function _ssaSendDataProxy(dataType, param) {
	if (!_ssa || !_ssa.sendData) {
		requestPool.push({
			dataType: dataType,
			param: param
		})
		return;
	}

	// 如果param中包含ext扩展字段则，把ext放入第三个参数
	if (param.hasOwnProperty('ext')) {
		var ext = JSON.parse(param.ext);
		delete param.ext;
		_ssa.sendData(dataType, AnalyzeCommon.fieldStringify(param), AnalyzeCommon.fieldStringify(ext));
	} else {
		_ssa.sendData(dataType, AnalyzeCommon.fieldStringify(param));
	}
}

// 清空requestPool
function cleanRequestPool() {
	for (var i=0; i<requestPool.length; i++) {
		_ssaSendDataProxy(requestPool[i].dataType, requestPool[i].param);
	}
	requestPool.splice(0, requestPool.length);
}

(function () {
	var _ssa_script = "//res.suning.cn/project/ssa/script/2aaef4fe-a99f-49a3-9fc3-fbc9d024e566/ssa.js";
	// var _ssa_script = "//sitres.suning.cn/project/ssa/script/d024e566/ssa.js";

	var ssa_src = {
		modPro: '//res.suning.cn/project/ssa/script/dc6f10c6/ssa.js',
		modTest: '//sitres.suning.cn/project/ssa/script/c80f7703/ssa.js',
		otherPro: '//res.suning.cn/project/ssa/script/2aaef4fe-a99f-49a3-9fc3-fbc9d024e566/ssa.js',
		otherTest: '//sitres.suning.cn/project/ssa/script/d024e566/ssa.js'
	}

	var plt = window.pptv_analyze_platform || 'web';
	var env = window.location.search.indexOf('env=test') > -1 ? 'test' : 'pro';
	
	if (plt === 'web') {
		if (env === 'pro') {
			_ssa_script = ssa_src.otherPro;
		} else {
			_ssa_script = ssa_src.otherTest;
		}
	} else {
		if (env === 'pro') {
			_ssa_script = ssa_src.modPro;
		} else {
			_ssa_script = ssa_src.modTest;
		}
	}


	var _scripts = document.getElementsByTagName('script');
	for (var i = 0; i < _scripts.length; i++) {
		if (_scripts[i].src == _ssa_script) {
			return;
		}
	}
	var _script = document.createElement('script');
	_script.type = 'text/javascript';
	_script.async = true;
	_script.src = _ssa_script;
	var _s = _scripts[0];
	if (isWeb) {
		_script.onload = sendSearch4Web;
	}
	_s.parentNode.insertBefore(_script, _s);
})();

var tm = null;

function sendplaydata() {
	if (window.player) {
		var actPlayer = window.player.getPlayer();
		if (!actPlayer) {
			tm = setTimeout(sendplaydata, 5000);
			return;
		}
		try {
			var data = actPlayer.getPlayInfoDeliver();
		}
		catch (e) { }
		if (!data || (data instanceof Array && data.length < 2)) {
			tm = setTimeout(sendplaydata, 10000);
		} else {
			clearTimeout(tm);
			tm = null;
			var dataType;
			if (typeof window._ssa == 'undefined') {
				return;
			}
			for (var i = 0; i < data.length; i++) {
				playInfoDeliver(data[i].type, data[i].param, true);
			}
		}
	} else {
		tm = setTimeout(sendplaydata, 10000);
	}
}

window.playInfoDeliver = function (type, param, innerCall) {
	var dataType;
	if (!innerCall && tm) {
		clearTimeout(tm);
		tm = null;
	}
	if (typeof window._ssa == 'undefined') {
		return;
	}
	dataType = type == 1 ? _ssa.dataType.play : _ssa.dataType.playing;
	//console.log("args", param);
	_ssaSendDataProxy(dataType, param);
}

AnalyzeCommon.addevent(window, 'message', function (res) {
	try {
		var dataobj = (typeof res.data == 'string') ? JSON.parse(res.data) : res.data;
		if ("playInfoDeliver" == dataobj.type) {
			var data = dataobj.data;
			playInfoDeliver(data.type, data.param);
		}
	} catch (error) { }
});

//苏宁搜索统计数据对接
function sendSearch4Web() {
	var cookieName = 'suningLog';
	if (!window._ssa || (!isWeb && /m\.pptv\.com.*\/pg_result/.test(vurl) == false)) {
		return;
	}
	if (!isWeb) {
		cookieName = 'numAndKeyword';
	}
	var searchData = AnalyzeCommon.getCookie(cookieName, true);
	var searchObj = JSON.parse(isWeb ? searchData : decodeURIComponent(searchData));
	var dataType = window._ssa.dataType.search;
	var dataValue = {
		swd: isWeb ? searchObj.query : searchObj.keyword // 搜索关键词
		,
		scp: ''  // 每页结果数量
		,
		sct: searchObj.totalNum // 返回结果总数量
		,
		ssr: document.referrer // 搜索请求来源
		,
		sort: searchObj.sort || ''
	}; // 排序方式

	_ssaSendDataProxy(dataType, dataValue);
	cleanRequestPool();
};
window.sendSearch = sendSearch4Web;
if (urlObj.SNLogOn == 0) {//关闭苏宁数据对接
	sendplaydata = function () { };
}
module.exports = {
	sendplaydata: sendplaydata
};