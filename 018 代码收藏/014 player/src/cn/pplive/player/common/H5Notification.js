/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

export default class H5Notification {
	
	static START_UP               = 'start_up';
	static ADS_STATUS             = 'ads_status';
	static WEB_PLAY               = 'web_play';               // 发起play请求
	static PAY_COMPLETE           = 'pay_complete';
	static PLAY_BLACK_DOMAINS     = 'play_black_domains';
	static PLAY_COMPLETE          = 'play_complete';          // play请求成功，进入解析
	static PLAY_SUCCESS           = 'play_success';           // play请求解析成功
	static PLAY_FAILED            = 'play_failed';            // play请求失败、解析失败或者替他失败
	static SKIN_STATE             = 'skin_state';
	static SKIN_TIPS              = 'skin_tips';
	static CONTROL_STATE          = 'control_state';          
	static VIDEO_STANDBY          = 'video_standby';
	static VIDEO_TITLE            = 'video_title';
	static VIDEO_SWITCH           = 'video_switch';           // 节目码流切换
	static VIDEO_BARRAGE          = 'video_barrage';
	static VIDEO_STATE            = 'video_state';
	static VIDEO_UPDATE           = 'video_update';           // 节目时间、进度更新
	static VIDEO_FD_COUNTDOWN     = 'video_fd_countdown';
	static VIDEO_SCREEN           = 'video_screen';           // 播放器全屏处理
	static VIDEO_SEEK             = 'video_seek';             // 拖动节目进度条
	static VIDEO_TOGGLE           = 'video_toggle';           // 节目启动或播放
	static VIDEO_NEXT             = 'video_next';             // 进入下一个节目
	static VIDEO_STOP 	          = 'video_stop';             // 节目停止
	static VIDEO_PLAY             = 'video_play';             // 节目播放
	static VIDEO_REPLAY           = 'video_replay'; 
	static VIDEO_VOLUME           = 'video_volume';           // 节目音量
	static VIDEO_BIP              = 'video_bip';              // bip报文
	static VIDEO_STORAGE          = 'video_storage';
	static VIDEO_ONLINE           = 'video_online';           // bip实时在线统计
	static VIDEO_BUFFER_TIP       = 'video_buffer_tip';
	static VIDEO_SESSION_UPDATE   = 'video_session_update';
	static VIDEO_RECOM            = 'video_recom';            // 节目后推荐
	static START_RECORD           = 'start_record';           // localstorage开始记录
	static STOP_RECORD            = 'stop_record';            // localstorage结束记录
	static ADD_VALUE              = 'add_value';              // localstorage存储累加值
	static ADV_EVENT              = 'adv_event';
	static ADV_PLAY               = 'adv_play';               //播放广告
	static ADV_OVER               = 'adv_over';               //广告结束
	static ADV_CONNECT            = 'adv_connect';            //广告通信上了
	static ADV_SETUP              = 'adv_setup';
	static ADV_ROLL_DELETE        = 'adv_roll_delete';
	static VIDEO_SHOW             = 'video_show';
	static VIDEO_START            = 'video_start';            
	static VIDEO_EXPAND           = 'video_expand';           // 剧场模式
	static VIDEO_PAY              = 'video_pay';              // 付费节目处理
	static VIDEO_POST             = 'video_post';
	static VIDEO_COUNTDOWN        = 'video_countdown';        // 定时上线节目
	static VIDEO_MOUSEMOVE        = 'video_mousemove';
	static VIDEO_USERINFO         = 'video_userinfo';         // 更新用户信息
	static VIDEO_PREVIEW_SNAPSHOT = 'video_preview_snapshot'; // 预览缩略图
}