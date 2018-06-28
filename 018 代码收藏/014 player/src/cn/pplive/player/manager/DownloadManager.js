/**
 * ...
 * @author minliang1112@foxmail.com
 */
 
'use strict';

export default class DownloadManager {

	ua = window.navigator.userAgent;
	Common = {
				AppUrl : 'pptv://',
				IOS_GUIDE_PAGE : '//applink.pptv.com/go2app.html',
				//SPORT_APP_URL : '//link.sports.pptv.com/app/startup/?'
				SPORT_APP_URL : '//sportenjoy.suning.com/msite/index.html?'
			}

	static isSingleton = false;
	static instance;

	constructor() {
		if (!DownloadManager.isSingleton) {
			throw new Error('只能用 getInstance() 来获取实例...');
		}
	}

	static getInstance() {
		if (!DownloadManager.instance) {
			DownloadManager.isSingleton = true;
			DownloadManager.instance = new DownloadManager();
			DownloadManager.isSingleton = false;
		}
		return DownloadManager.instance;
	}

	goToApp(downloadUrl, epPlayInfo = '', download_type = 0) {
		//判断如果是体育类型直接下载
		if (download_type == 1) {
		    this.goToDownload(this.Common.SPORT_APP_URL + epPlayInfo);
		    return;
		}
		//var epPlayInfo = epPlayInfo || '';
		let platForm = this.checkPlatform(this.ua.toLowerCase());
		switch(platForm){                                        
			case 'ios':
				let iosVersion = this.checkIosVersion(this.ua.toLowerCase());
				let appUrl_ios = this.Common.AppUrl + epPlayInfo ;  // 打开 app 的协议 ( 数据统计：增加 userfrom 字段 ) ;
				if( iosVersion<9 ){                                
					// alert("<9")
					this.iosOldWayToOpen(downloadUrl, appUrl_ios);

				}else{   				                           
					// console.log("该版本 >= ios9");
					top.window.location.href = this.Common.IOS_GUIDE_PAGE + "?path=" + encodeURIComponent(appUrl_ios);  //  引导页 + path
				}
				break;
			case 'android':
				let appUrl_android = this.Common.AppUrl + decodeURIComponent(epPlayInfo) ;
				this.androidOpenApp( downloadUrl, appUrl_android );
				break;
			default:
				alert('请使用安卓或苹果系统手机下载APP');
				break;
		}
	}

	goToDownload(downloadUrl) {
		top.window.location.href = downloadUrl;
	}

	checkPlatform(ua){
		if(this.isIos(ua)){
			return 'ios';
		}else if(this.isAndroid(ua)){
			return 'android';
		}else if(this.isWeixin(ua)){
			return 'weixin';
		}else{
			return 'other platform...'
		}
	}

	isIos(ua){
		return /(iphone|ipad|ipod|ios)/i.test(ua);
	}

	isAndroid(ua){   
		return /(android)/i.test(ua);
	}

	isWeixin(ua){
	    return /(micromessenger)/i.test(ua);
	}

	checkIosVersion(ua){     // 判断 ios 版本
		let version;
		if(ua.indexOf("like mac os x") > 0){
		    let regStr_saf = /os [\d._]*/gi ;
		    let verinfo = ua.match(regStr_saf) ;
		    version = (verinfo+"").replace(/[^0-9|_.]/ig,"").replace(/_/ig,".");
		}
		let version_str = version+"";
		if(version_str != "undefined" && version_str.length >0){
		    version=version.split('.')[0];
		    return version;
		}
	}

	// appUrl : 打开app的地址  downloadUrl:app下载地址  
	iosOldWayToOpen(downloadUrl, appUrl){  
		// var appUrl = 'pptv://';
		let g = this.ua;
		let h = /Chrome\//.test(g) && !/Version\/4/.test(g);
		let e = (new Date).getTime();
		let f = document.createElement("iframe");
			f.setAttribute("id", "open_app_iframe");
			f.setAttribute("name", "open_app_iframe");
			f.setAttribute("class", "dn");
			f.setAttribute("style", "display:none");
		document.getElementsByTagName("body")[0].appendChild(f);
		if (/Chrome/i.test(g) && h) {
			let i = /Chrome\/(\d{2})/i.exec(g);
			if (i && parseInt(i[1]) < 35)
				top.window.location.href = appUrl;
			else {
				let j = top.window.open(appUrl);
				setTimeout(function() {
					j.close()
				}, 1000)
			}
		} else  {
			// /iPhone OS 9/i.test(g) ? location.href = appUrl : f.setAttribute("src", appUrl);
			f.setAttribute("src", appUrl);
			top.window.location.href = appUrl;
			let k = window.setTimeout(function() {
				clearTimeout(k),
				(new Date).getTime() - e < 2000 &&
				downloadUrl && setTimeout(function() {
					top.window.location.href = downloadUrl;
				}, 200)
			}, 1000)
		}
	}

	//  Android 打开app,跳下载页
	androidOpenApp(downloadUrl, appUrl) {
		top.window.location.href = appUrl;
		setTimeout(function(){
			top.window.location.href = downloadUrl;
		},2000);
	}
}