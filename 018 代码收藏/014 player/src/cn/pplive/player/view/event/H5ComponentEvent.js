/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

//import keyMirror from 'fbjs/lib/keyMirror';

export default class H5ComponentEvent {

	static WEB_PLAY               = 'web_play';
	static SKIN_TIPS              = 'skin_tips';
	static CONTROL_STATE          = 'control_state';
	static VIDEO_TITLE            = 'video_title';
	static VIDEO_STATE            = 'video_state';
	static VIDEO_TOGGLE           = 'video_toggle';
	static VIDEO_BARRAGE          = 'video_barrage';
	static VIDEO_CENTER           = 'video_center';
	static VIDEO_UPDATE           = 'video_update';
	static VIDEO_FD_COUNTDOWN     = 'video_fd_countdown';
	static VIDEO_SCREEN           = 'video_screen';           // 播放器全屏处理
	static VIDEO_BUFFER           = 'video_buffer';
	static VIDEO_BUFFER_FULL      = 'video_buffer_full';
	static VIDEO_BUFFER_TIP       = 'video_buffer_tip';
	static VIDEO_SEEK             = 'video_seek';
	static VIDEO_PLAY             = 'video_play';
	static VIDEO_REPLAY           = 'video_replay';
	static VIDEO_VOLUME           = 'video_volume';
	static VIDEO_VOLUME_STATE     = 'video_volume_state';
	static VIDEO_VOLUME_ADV       = 'video_volume_adv';
	static VIDEO_FAILED  		  = 'video_failed';
	static VIDEO_BIP              = 'video_bip';
	static VIDEO_STORAGE          = 'video_storage';
	static VIDEO_ONLINE           = 'video_online';
	static START_RECORD           = 'start_record';           // localstorage开始记录
	static STOP_RECORD            = 'stop_record';            // localstorage结束记录
	static ADD_VALUE              = 'add_value';              // localstorage存储累加值
	static ADS_STATUS             = 'ads_status';
	static ADV_ROLL_COUNTDOWN     = 'adv_roll_countdown';     
	static ADV_ROLL_START         = 'adv_roll_start';         // 线性广告开始 (pre-roll | mid-roll | post-roll)
	static ADV_ROLL_END           = 'adv_roll_end';           // 线性广告结束 (pre-roll | mid-roll | post-roll)
	static ADV_EVENT              = 'adv_event';
	static VIDEO_SWITCH           = 'video_switch';
	static VIDEO_ONAIR            = 'video_onair';
	static VIDEO_START            = 'video_start';
	static VIDEO_NEXT             = 'video_next';
	static VIDEO_STOP             = 'video_stop';
	static VIDEO_POST             = 'video_post';
	static VIDEO_SKIP             = 'video_skip';
	static VIDEO_PAY              = 'video_pay';
	static VIDEO_MOUSEMOVE        = 'video_mousemove';
	static VIDEO_COUNTDOWN        = 'video_countdown';        // 定时上线节目
	static VIDEO_PREVIEW_SNAPSHOT = 'video_preview_snapshot'; // 预览缩略图
}