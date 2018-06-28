/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

const $version = '4.0.1';

export const H5Common = {

	version() {
		return $version;
	},

	isPlayAdv : false,

	NEW_MEMBER : 'pri_web_quguanggao',//会员免广告
	NEW_1080P : 'pri_web_1080p',//蓝光开会员

	isSport : 0, // 是否为体育节目
	isHandoff : 0,//是否手动结束（0:自动结束 1:手动结束）
	isSkip : 1, // 是否跳过片头和片尾
	ft : 0, //当前码流

	recom_url : '//apis.web.pptv.com/player/recommend?id=[ID]&src=22',
	client_versioninfo : '//up.pplive.com/pptv/self/all/self_alln.ini',
	client_url : '//app.aplus.pptv.com/minisite/download/',

	isShowControl : true,
	shareDisable : 0,//设置是否禁止分享
	playJson : null,
	currVolume : 0,
	contextmenuArr : ['Build HTML5Player ' + $version, 'Powered by PP视频'],

	/************ 付费相关参数开始 ************/
	isPayPass : 0, // 当价格策略接口返回价格信息为空，重新请求play，允许播放
	isPay : 1,
	sectionId : 0,
	sectionTitle : '',
	sectionCp : 1, // 1=pptv，2=新英
	outLinkPay : 0,
	outLink : null,
	paydata : null,
	paystime : 0, //付费直播开始时间 或者 点播记忆开始播放时间
	payetime : 0, //付费直播结束时间
	priceinfo : '//api.ddp.vip.pptv.com/priceinfo',
	vipinfo : '//webapi.epg.pptv.com/packageList.api',
	payurl : '//pay.vip.pptv.com/?aid=content_web_bfqkthy&plt=web&cid=[CID]',
	packageList: '//api.ddp.vip.pptv.com/package/buyed/list',	//用户已购买体育包
	/************ 付费相关参数结束 ************/
	
	/************ 预览图参数开始 ************/
	snapshotVersion : 0,
	snapshotHeight : 720,
	row : 10,
	column : 10,
	preSnapshot : null,
	/************ 预览图参数结束 ************/

	isSpaceKey : 1,      // 是否启用空格键功能 (1:启用 , 0:禁用)
	tempT : NaN,         // 快进 | 后退的定位点
	/************ 直播回看参数开始 ************/
	stime : NaN,         // 片段直播开始时间
	etime : NaN,         // 片段直播结束时间
	isVod : 0,           // 是否为片段直播回看
	initVolume : 50,     // 初始音量
	backdur : .5 * 3600, // 当前回看时长
	/************ 直播回看参数结束 ************/

	/**
	 *  play  请求  2000(成功) 2001(错误) 2002(安全错误) 2003(超时) 2004(无dt数据或无drag值) 2005(非正常渠道播放) 2006(没有该频道信息) 2007(Play返回视频禁用分享功能) 2008(地区屏蔽) 2009(token验证失败)
	 * video  请求  3000(成功) 3001(错误) 3002(信号中断)
	 */
	callCode    : {
					'play' : ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009'],
					'video': ['3000', '3001', '3002', '', '', '', '3006']
				},
	mobileRegExp: /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|WebOS|Windows Phone)/i,
	adsUrl      : '//player.as.pptv.com/html5/player.html#',
	noAdsList   : ['sale.suning.com', 'm.ijiasu.com', 'www.coca-cola.com.cn'],
	playDomain 	: ['//web-play.pptv.com', '//web-play.pplive.cn', '//211.151.82.252'],
	defaultCFG  : {
					//id : "454", //必填 - 视频播放ID
					//title : "xxx", //视频标题
					//videoSrc : "", //视频播放地址
					//duration : '', //视频时长
					videoType : '', //1-vod | 10-live | 20-live回看
					ctx : "o=0", //可选
					//autoplay : 0,  //可选 - 是否自动播放，默认自动播放
					poster : "//s1.pplive.cn/v/cap/[CHANNELID]/w640.jpg",
					skin : {
								canResize : true,
								captionBar : true,
								controlBar : true
							},
					adConfig : {
									plat : "ik", //平台 | ikan 传ik | mpptv 传mbs
									pos : 1, //广告位
									vvid : "", //视频曝光id  
									chid : "", //频道id -> 合集或剧集id
									clid : "", //分类id
									sid : "", //单集id -> 频道id
									vlen : "", //播放时长
									//slen : "", //上次广告播放完毕到现在的观看视频时长
									//o : "", //渠道   可以不传
									ctx : "", //拓展参数 可以不传
									//ctype : "", //请求策略渠道标识 可以不传
									pageUrl : "" //页面地址
									//预览相关参数 都可以不传
									//cs = 0;
									//duration = 0;
									//url = '';
								}
			}
}
