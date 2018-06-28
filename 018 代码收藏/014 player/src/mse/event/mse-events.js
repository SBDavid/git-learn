/*
 * Copyright (C) 2016 Bilibili. All Rights Reserved.
 *
 * @author zheng qian <xqq@xqq.im>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const MSEEvents = {
    ERROR: 'error',
    SOURCE_OPEN: 'source_open',
    UPDATE_END: 'update_end',
    BUFFER_FULL: 'buffer_full',
    BUFFER_EMPTY:'buffer_empty',
    PLAY_COMPLETE: "play_complete",	// 播放完成
    PLAY_FAILED: "play_failed",	// 播放失败（点播播放失败，直播长时间无法获取数据时(3分钟)，会抛[FAIL]事件）
    ONAIR_SHOW :'onair_show',
    ONAIR_HIDE :'onair_hide',
    LIVE_STREAM_STOPPED:'live_steram_stopped',
    STREAM_SPEED:'stream_speed',//下载速度
    LIVE_CORE_DAC_LOG : "live_core_dac_log",
    P2P_DAC_LOG : "p2p_dac_log",
    PLAY_RESULT : "play_result_report",
    
////////////////////////////////////////////////////////////////    
    DEMUX_ERROR: 'demux_error',
    INIT_SEGMENT: 'init_segment',
    MEDIA_SEGMENT: 'media_segment',
    HTTP_DOWNLOAD_DATA_ERROR: 'http_download_data_error',
    HTTP_DOWNLOAD_TIMEOUT:'http_download_timeout',
	DOWNLOAD_HEADER_REQUEST : "__download_header_request__",
    RECEIVE_SUBPIECE : "__receive_subpiece__",
    GET_SEEK_TIME : "__get_seek_time__",
    DOWNLOAD_REQUEST : "__download_request__",
    DOWNLOAD_COMPLETE :"__download_complete__",//每个SEGMENT的小分段加载完成
//  SEGMENT_DOWNLOAD_COMPLETE :"__SEGMENT_DOWNLOAD_COMPLETE__",//大段加载完成
    SEGMENT_REMUX_COMPLETE :"__segment_remux_complete__",//大段解析完成    
    CDN_CHECK_OK : "_cdn_check_ok_",
	CDN_CHECK_FAIL:  "_cdn_check_fail_",
	MP4_HEADER_OK:"_mp4_header_ok_",//解析MP4头文件完成
    MP4_HEADER_ERROR:"_mp4_header_error_",//解析MP4头文件失败
    GET_REALSEEKTIME:"_get_realseektime_",//获取点播跳转的真实seektime
    BUFFER_FULL_ERROR:'_buffer_full_error_', 
};

export default MSEEvents;