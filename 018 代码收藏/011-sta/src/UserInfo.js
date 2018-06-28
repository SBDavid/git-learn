/**
 * ...
 * @author minliang1112@foxmail.com | davidtangjw@pptv.com
 */

'use strict';

var AnalyzeCommon = require("./AnalyzeCommon");

var UserInfo = {

	getLoginUserId:function(){
        var pid="";
        var PPName = AnalyzeCommon.getCookie("PPName") || '';
        if (PPName) {
            var arrPPName = PPName.split("$");
            if (arrPPName.length>0){
                pid = arrPPName[0];
            }
        }
        return pid;
    },

    isVipUser:function(){
        var isVip = "0";
        var UDI = AnalyzeCommon.getCookie("UDI") || '';
        if ((UDI)){
            var arrUDI=UDI.split("$");
            if (arrUDI.length>0){
                isVip = arrUDI[17];   //ugs升级导致
            }
        }
        return isVip;
    },
    
    getPUID:function(){
        var PUID = AnalyzeCommon.getCookie("PUID") || '';
        if (PUID){
            return PUID.split('|')[0];
        }
        return '';
    }
}

module.exports = UserInfo;