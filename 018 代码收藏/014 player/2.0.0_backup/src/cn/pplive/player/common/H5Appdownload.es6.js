/**
 * @author  Chengxiang Li
 * @qq   	1014410609
 * @email   chengxiangli@pptv.com
 * @info    打开App或下载App
 * @info    此js用到的公共配置：除了在commons/commons.js里面配置外，在下面的Common变量里也需进行相关配置
 *
 * DownloadManager.getInstance().goToApp(...);
 *
 */
let Common = {
				AppUrl : 'pptv://',
				IOS_GUIDE_PAGE : '//applink.pptv.com/go2app.html',
				SPORT_APP_URL : '//link.sports.pptv.com/app/startup/?'
			}

let DownloadManager = (()=>{

	let ua = window.navigator.userAgent,
	    instance;

	class OpenDownload {

		constructor() {}

		goToDownload(downloadUrl) {    
			top.window.location.href = downloadUrl;
		}

		goToApp( downloadUrl, epPlayInfo = '', download_type = '0' ) {
			//判断如果是体育类型直接下载
			if (download_type == '1') {
			    this.goToDownload(Common.SPORT_APP_URL + epPlayInfo);
			    return;
			}
			//var epPlayInfo = epPlayInfo || '';
			let platForm = this.checkPlatform(ua.toLowerCase());
			switch( platForm ){                                        
				case 'ios':
					let iosVersion = this.checkIosVersion(ua.toLowerCase());
					let appUrl_ios = Common.AppUrl + epPlayInfo ;
					if( iosVersion<9 ){                                
						// alert("<9")
						this.iosOldWayToOpen( downloadUrl, appUrl_ios );

					}else{   				                           
						// console.log("该版本 >= ios9");
						top.window.location.href = Common.IOS_GUIDE_PAGE + "?path=" + encodeURIComponent( appUrl_ios );  //  引导页 + path
					}
					break;
				case 'android':
					let appUrl_android = Common.AppUrl + decodeURIComponent(epPlayInfo) ;
					this.androidOpenApp( downloadUrl, appUrl_android );
					break;
				default:
					alert('请使用安卓或苹果系统手机下载APP');
					break;
			}
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
		iosOldWayToOpen( downloadUrl, appUrl ){  
			// var appUrl = 'pptv://';
			let g = ua;
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
		androidOpenApp( downloadUrl, appUrl ){
			top.window.location.href = appUrl;
			setTimeout(function(){
				top.window.location.href = downloadUrl;
			},2000);
		}

	}

	return {
		 		getInstance : function(){
					 			return instance || (instance = new OpenDownload());
					 		}
		 	}

})();