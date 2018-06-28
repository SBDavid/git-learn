/**
 * ...
 * @author minliang1112@foxmail.com | davidtangjw@pptv.com
 */

'use strict';

var AnalyzeCommon = require("./AnalyzeCommon");
var UserInfo = require("./UserInfo");

var Analyze = function() {
    this.host = "//web.data.pplive.com";
    this.time = new Date().getTime();
    this.image = new Image();
    this.puid = AnalyzeCommon.getCookie('PUID');
    this.reservedPv = "plt title adr radr puid uid vip src code o r";
    this.reservedPc = "plt title t pt sadr n adr radr puid uid vip o r src code";
    if (!this.puid) {
        AnalyzeCommon.setCookie('PUID', AnalyzeCommon.generateVVID(), 365);
    }
    this.init();
}

Analyze.prototype = {
    init: function() {
        var self = this;
        window.sta = {
            deliverPlayerInfo: function(params) {
                self.deliverPlayerInfo(params);
            }
        }
    },
    deliverPlayerInfo: function(params) {
        var pcService = this.host+'/pc/1.html?r=' + Math.random();
        for(var key in params) {
            if (!params.hasOwnProperty(key)) {
                // 原型上的数据不做处理
                continue;
            }

            pcService += '&' + key + '=' + String(params[key]);
        }
        this.sendDac(pcService);
    },
	recordPVPC:function() {
		var plt = this.getPlatForm(),
        	adr = AnalyzeCommon.getPageUrl(),
        	radr = document.referrer.replace(/&/g,'%26').replace(/#/g,'%23'),
        	title = encodeURIComponent(document.title),
        	puid = UserInfo.getPUID(),
        	uid = UserInfo.getLoginUserId(),
        	vip = UserInfo.isVipUser(),
        	o = this.getFormStrClient() || this.getFormStr(),
        	ctx = (typeof(window.pctx)=="undefined" || window.pctx==null )? {} : window.pctx,
            strPctx = "",
            pvtx = window.pvtx || "",
            self = this;
        for(var key in ctx ) {
            strPctx+="&"+key+"="+encodeURIComponent(ctx[key]);
        }
        var strSrc = "",
        	src = this.getSource();
        if(src!=""){
            strSrc="&src="+src;
        }
        var et = window.external, strCode="";
		//在一些安装不正确的ie7、8下以及ie7本身，在判断et.GetCode时会报出错误，使用try-catch并修改了写法
        try{
			if( et && et.GetCode ) {
				strCode="&code="+et.GetCode();
			}
		}catch(e){}

        var pvService = self.host+'/pv/1.html?plt='+plt+'&title='+title+'&adr='+adr+'&radr='+radr+'&puid='+puid+'&uid='+uid+'&vip='+vip+'&o='+o+strPctx+strSrc+strCode+self.getExtendParam(0,strPctx);
        pvService += (pvtx ? "&" + pvtx : "")+'&r='+Math.random();
        this.image.src = pvService;

        var tmouseup;
        this.addevent(document, 'mouseup', function(ev){
            tmouseup = new Date().getTime();
        });

        this.addevent(document, 'click', function (ev) {
            var code = strCode, externalUrl = '';
            if(code == ""){
                // set the code to 101 if click without onmouseup.
                if(!tmouseup || (new Date().getTime()-tmouseup) > 500 ) {
                    code="&code=101";
                }
            }

            ev = ev || window.event;
            var target = ev.target || ev.srcElement;
            var link = self.findTarget(target);
            if (link && link.getAttribute("ignore") != 1) {
                var t=(new Date()).getTime() - self.time;
                var pt = self.genpath(link);
                var sadr="";
                var w2cControl = adr.indexOf("w2c.pptv.com")>=0 && !!link.href && (link.href=='javascript:void(0);' || link.href=='javascript:;') && !link.getAttribute("_playurl") && !link.getAttribute("_jump");
                var isBtn = ((link.tagName.toLowerCase() == 'input') && (link.getAttribute("type")=='submit' || link.getAttribute("type")=='button')) ||(link.tagName.toLowerCase()=="button");
                var otherControl = adr.indexOf("w2c.pptv.com")<0 && ((!!link.href && (link.href=='javascript:void(0);' || link.href=='javascript:;')) || isBtn);
                if(link.getAttribute('external_url')){
                    externalUrl = link.getAttribute('external_url') || '';
                }
                if (w2cControl || otherControl){
                    var ppext = link.getAttribute("pptvextension");
                    if (!!ppext){
                        ppext += '&ro=1';
                    }else{
                        ppext = 'ro=1';
                    }
                    link.setAttribute('pptvextension', ppext);
                }

                if (!!link.href){
                    sadr = encodeURIComponent(link.href);
                }
                var n = encodeURIComponent(link.title);
                var ext = link.getAttribute("pptvextension");
                if (ext==null){
                    ext="";
                }else{
                    ext="&"+ext;
                }
                if ((!!link.href) && link.href.indexOf("v.pptv.com/show")>=0){
                    self.setSctx('rp','{d}'+pt);
                    if(window.location.href.indexOf("v.pptv.com/show")>=0){
                        if (!!ctx['tj_pt']){
                            self.setSctx('tj_pt','{d}'+ctx['tj_pt']);
                        }
                        if (!!ctx['tj_pst']){
                            self.setSctx('tj_pst','{d}'+ctx['tj_pst']);
                        }
                    }
                }
                var pcService = self.host+'/pc/1.html?plt='+plt+'&title='+title+'&t='+t+'&pt='+pt+'&sadr='+sadr+'&n='+n+'&adr='+adr+'&radr='+radr+'&puid='+puid+'&uid='+uid+'&vip='+vip+'&o='+o+strPctx+ext+strSrc+code+self.getExtendParam(1,strPctx,ext)+'&r='+Math.random();
                if(externalUrl){
                	pcService += '&' + externalUrl;
                }
                self.sendDac(pcService);
            }
        });
	},

	addevent:AnalyzeCommon.addevent,

	sendDac:function(url) {
		try {
            var ppStac = external.GetObject("@pplive.com/PPLStat;1");
            var temp_url = url;
            if (!/^http\:/g.test(temp_url)) {
                temp_url = 'http:' + temp_url;
            }
            ppStac.StartTrustUpload(temp_url);
        }catch(e) {
            this.image.src = url;
		}
	},

	genpath:function(el) {
        return AnalyzeCommon.genpath(el);
    },

    getFormStr:function() {
        var refer = document.referrer,
        o = AnalyzeCommon.getQueryString('rcc_id') || AnalyzeCommon.getQueryString('rcc_id',refer) || function (){  //从url,referrer中取rcc_id
            if(!!refer){
                var mref = refer.toLowerCase().match(/\:\/\/([0-9a-z\-\_\.{}]+).*/i)[1];
                if(mref.indexOf('pptv.com') == -1){
                    return mref;   //从document.referrer中取
                }
            }
        }() || AnalyzeCommon.queryToObject(decodeURIComponent(AnalyzeCommon.getCookie('sctx',true))).o || '';   //最后从section会话中取
        if(o) {
            this.setSctx('o',o);
        }
        return o;
    },

    getFormStrClient: function() {

        function printErr(err) {
            var text = '';
            for (var item in err) {
                text += item;
                text += ' : ';
                text += err[item] + '\n';
            }
            alert(text);
        }

        function fromIE() {
            try {
                return external.CustomerName;
            } catch (err) {
                // printErr(err);
                return false;
            }
        }

        function fromWebkit() {
            try {
                var ppFrame = external.GetObject2("@pplive.com/PPFrame;1", true);
                var verInfo = ppFrame.CreateComponent(2);
                return verInfo.CustomerName;
            } catch (err) {
                // printErr(err);
                return false;
            }
        }

        var fromList = [fromIE, fromWebkit];

        for(var index = 0; index < fromList.length ; index++) {
            var o = fromList[index]();
            // alert(o);
            if(o) {
                return o;
            }
        }

        return false;
    },

    setSctx:function(key, value){
        var sctx = {};
        function push(str){
            var o = AnalyzeCommon.queryToObject(str);
            for (var i in o) {
                sctx[i] = o[i];
            }
        }
        var ss = key + '=' + value;
        push(AnalyzeCommon.getCookie('sctx', true));
        push(ss);
        AnalyzeCommon.setCookie('sctx', decodeURIComponent(AnalyzeCommon.objectToQuery(sctx)));
    },

    findTarget:function(el) {
        if (!el.tagName) {
            return null;
        }
        var tag = el.tagName.toLocaleLowerCase();
        var isBtn = (tag == 'input') && (el.getAttribute("type")=='submit' || el.getAttribute("type")=='button');
        if (tag != 'a' && tag != 'button' && (!isBtn) && el.getAttribute("tj_pc")!=1) {
            if (el.parentNode) {
                return this.findTarget(el.parentNode);
            }
            return null;
        }
        return el;
    },
    
    getPlatForm:function(){
        if(typeof(pptv_analyze_platform) == "undefined") return "";
        return pptv_analyze_platform;
    },
    
    getSource:function(){
        if(typeof(pptv_analyze_source) == "undefined") return "";
        return pptv_analyze_source;
    },
    getExtendParam: function(type, strCtx, ext) {
        var pvOrPc = null;
        if (type == 1 && typeof pptv_analyze_extend_pc != 'undefined') {
            pvOrPc = pptv_analyze_extend_pc;
        }
        if (type == 0 && typeof pptv_analyze_extend_pv != 'undefined') {
            pvOrPc = pptv_analyze_extend_pv;
        }
        if (typeof pvOrPc == "function") {
            var res = pvOrPc();
            if (!res){
                return '';
            }
            return '&'+res;
        }
        if (typeof pvOrPc == "string" && pvOrPc != '') {
            var tips = type == 1 ? 'pc' : 'pv';
            var invalidParam = type == 1 ? this.reservedPc : this.reservedPv;
            invalidParam += (strCtx + ext).replace(/&/g, ' ');
            var objPc = AnalyzeCommon.queryToObject(pvOrPc);
            for (var k in objPc) {
                var exp = new RegExp('\\b' + k + '\\b');
                if (exp.test(invalidParam)) {
                    try{
                        console.log("error:"+ (type?"pptv_analyze_extend_pc":"pptv_analyze_extend_pv")+"'s value '"+k+"' has the same parameter as original " + tips);
                    }catch(e){}
                    delete objPc[k];
                }
            }
            return '&'+AnalyzeCommon.objectToQuery(objPc);
        }
        return '';
    },
    getTjidAndPt:function(ele){
        var validEle = this.findTarget(ele);
        if (validEle && validEle.getAttribute("ignore") != 1){
            return this.genpath(validEle);
        }
        return '';
    }

}

module.exports = Analyze;
