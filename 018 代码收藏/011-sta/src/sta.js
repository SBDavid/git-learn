/**
 * ...
 * @author minliang1112@foxmail.com | davidtangjw@pptv.com
 */

'use strict';

var Analyze = require("./Analyze");
var AnalyzeCommon = require("./AnalyzeCommon");
var snAnalyze = require("./snAnalyze");
var spm = require("./spm");

var version = 'v1.0.6';
var isBackEnd = function () {
    	return AnalyzeCommon.getQueryString('back') != null;
	},
	isSendpc = function() {
	    return AnalyzeCommon.getQueryString('sendpc') != null;
	};
var sta = new Analyze();
var Spm = new spm();
window.getTjIdAndPt = sta.getTjidAndPt;
if (!isBackEnd() || (isBackEnd() && isSendpc())) {
	try{
		console.log('sta.js 版本号 >>>>>>>>>> ', version);
	}catch(e){};
	sta.recordPVPC();
	Spm.install();
}
snAnalyze.sendplaydata();