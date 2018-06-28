/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

export default class H5PlayerEvent {

	static VIDEO_ONNOTIFICATION      = 'onNotification';
	static VIDEO_ONINIT              = 'onInit';
	static VIDEO_ONREADY             = 'onReady';
	static VIDEO_ONERROR             = 'onError';
	static VIDEO_ONPLAYSTATE_CHANGED = 'onPlayStateChanged';
	static VIDEO_ONPROGRESS_CHANGED  = 'onProgressChanged';
	static VIDEO_ONMODE_CHANGED      = 'onModeChanged';
	static VIDEO_ONSTREAM_CHANGED    = 'onStreamChanged';
	static VIDEO_SUNING_BIP          = 'playInfoDeliver';

	/*** 移动端H5特有对外事件 ***/
	static VIDEO_NEXT                = 'nextvideo';
	static VIDEO_FULLSCREEN          = 'onFullscreen';
}