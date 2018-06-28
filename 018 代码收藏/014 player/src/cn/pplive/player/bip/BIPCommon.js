/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

export default class BIPCommon {

	static BF   = 'bf';
	static BS   = 'bs';
	static DU   = 'du';
	static VT   = 'vt';
	static NOW  = 'now';
	static BWT  = 'bwtype';
	static CFT  = 'ft';
	static GUID = 'guid';
	static UID  = 'uid';
	static S    = 's';
	static MN   = 'mn';
	static VH   = 'vh';
	static CID  = 'cid';
	static CLD  = 'clid';
	static CTX  = 'ctx';
	static DCTX  = 'dctx';
	static OLBF = 'olbf';//5分钟内的卡顿的次数
	static OLBS = 'olbs';//5分钟内的卡顿的时长  单位：毫秒
	static SS   = 'ss';  //播放来源
	static UT   = 'ut';  // ut=104vip登录  103:非vip登录   101:未登录
	static SECTIONID = 'sectionid';
	static PTE = 'pte';
	static USERTO = "userto";
	static SR = 'speedRate';//统计速率
	static DG = 'dg';//拖动次数
	static TDD = 'tdd';	//单次拖动时延
	static CVID = 'cvid';//频道rid
	static VID = 'vid';//视频流rid
	static ISVIP = 'isvip';//是否vip
	static PL = 'pl';//播放串	
	static DTT = 'dtt';//dt请求时延	
	static OLDC = "oldc";//online日志 拖动次数
	static OLDST = "oldst";//online日志 拖动时长
	static COREINFO = "coreinfo";
	static IFID = "ifid"; //百科id
	static CATAID1 = "cataid1"; //基础一级分类id
	static CATAID2 = "cataid2"; //基础二级分类id
	static ERROR_CODE = "error_code";//播放失败错误码
}