/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import $ from 'jquery';
import puremvc from "puremvc";
import Global from "manager/Global";
import { H5Common } from "common/H5Common";
import H5Notification from "common/H5Notification";
import { H5CommonUtils } from "common/H5CommonUtils";
import PreviewSnapshotManager from "manager/PreviewSnapshotManager";

export class H5PreSnapshotProxy extends puremvc.Proxy {

    static NAME = 'h5_pre_snapshot_proxy';
    $posi;

    check(posi, row) {
        if (isNaN(H5Common.row) && isNaN(H5Common.column)) return null;
        let $beg = 0;
        if (Global.getInstance().videoType == 1) {
            $beg = Math.floor(posi / (Global.getInstance().playData.interval * row * H5Common.column));
            return {
                    'interval': Global.getInstance().playData.interval,
                    'column'  : H5Common.column,
                    'row'     : row,
                    'beg'     : $beg,
                    'end'     : Global.getInstance().playData['duration'],
                    'posi'    : posi,
                    'height'  : H5Common.snapshotHeight / H5Common.row * row
                };
        } else {
            $beg = Math.floor(posi / (Global.getInstance().playData.interval * row * H5Common.column)) * (Global.getInstance().playData.interval * row * H5Common.column);
            let $end = $beg + (Global.getInstance().playData.interval * row * H5Common.column);
            if ($end <= Global.getInstance().startTime) {
                return {
                        'interval': Global.getInstance().playData.interval,
                        'column'  : H5Common.column,
                        'row'     : row,
                        'beg'     : $beg,
                        'end'     : $end,
                        'posi'    : posi,
                        'height'  : H5Common.snapshotHeight / H5Common.row * row
                    };
            } else {
                return row!=1 ? this.check(posi, 1) : null
            }
        }
        return null;
    }

    initData(posi) {
        this.$posi = posi;
        let $url;
        let $obj = this.check(this.$posi, H5Common.row);
        if (Global.getInstance().videoType == 1) {
            if (H5Common.preSnapshot) {//若预览截图已经存在于缓存中，则直接获取
                for (let dataObj of H5Common.preSnapshot) {
                    let $total = dataObj['snapshot']['interval'] * dataObj['snapshot']['row'] * dataObj['snapshot']['column'];
                    if (this.$posi >= dataObj['snapshot']['beg'] * $total && this.$posi < (dataObj['snapshot']['beg'] + 1) * $total) {
                        this.getSnapshot(dataObj['content'], dataObj['snapshot']);
                        return;
                    }
                }
            }
            $url = '//panoimage.pptv.com/' + H5Common.snapshotVersion + '/' + Global.getInstance().cid;
        } else {
            if (!$obj) {
                Global.debug('预览截图暂未生成，请求取消 ===>>>');
                this.sendNotification(H5Notification.VIDEO_PREVIEW_SNAPSHOT, {
                                                                                'posi':this.$posi
                                                                            });
                return;
            }
            if (H5Common.preSnapshot) {//若预览截图已经存在于缓存中，则直接获取
                for (let dataObj of H5Common.preSnapshot) {
                    if (this.$posi >= dataObj['snapshot']['beg'] && this.$posi <= dataObj['snapshot']['end']) {
                        this.getSnapshot(dataObj['content'], dataObj['snapshot']);
                        return;
                    }
                }
            }
            $url = '//live.panoimage.pptv.com/pano/' + Global.getInstance().stream[H5Common.ft]['rid'];
        }
        this.sendNotification(H5Notification.VIDEO_PREVIEW_SNAPSHOT, {
                                                                        'posi': this.$posi
                                                                    });
        if ($obj) {
            $url += '_' + $obj['interval'];
            $url += '_' + $obj['column'];
            $url += 'x' + $obj['row'];
            $url += '_' + $obj['beg'];
            $url += '_' + $obj['height'] + '.jpg';
            PreviewSnapshotManager.getInstance().loadData($url, $obj);
            PreviewSnapshotManager.getInstance().addEvent(PreviewSnapshotManager.PREVIEW_SNAPSHOT, this.onPreviewSnapshot);		
        }
    }

    onPreviewSnapshot = (e) => {
        try {
            if (!H5Common.preSnapshot) H5Common.preSnapshot = [];
            H5Common.preSnapshot.push(e.target.dataObj);
            this.getSnapshot(e.target.dataObj['content'], e.target.dataObj['snapshot']);
        }catch (e) { };
    }

    getSnapshot(target, obj, url) {
        let $index = 0;
        if (Global.getInstance().videoType == 1) {
            $index = Math.floor((this.$posi - obj['interval'] * obj['row'] * obj['column'] * obj['beg']) / obj['interval']);
        } else {
            $index = Math.floor((this.$posi - obj['beg']) / obj['interval']);
        }
        if ($index < 0 || $index > obj['column'] * obj['row'] - 1) return;
        this.sendNotification(H5Notification.VIDEO_PREVIEW_SNAPSHOT, {
                                                                        'posi': this.$posi,
                                                                        'bmp' : {
                                                                                    'url' : target.src,
                                                                                    'x' : $index % obj['column'] * (target.width / obj['column']),
                                                                                    'y' : Math.floor($index / obj['column']) * (target.height / obj['row']),
                                                                                    'width' : target.width / obj['column'] >> 0,
                                                                                    'height' : target.height / obj['row'] >> 0
                                                                                }
                                                                    });
    }
    
    /**
     * 释放过期缓存
     * @param	isAll  是否清除所有数据
     * @param	start  起始时间点  用于清除部分过期数据
     */
    disposed(isAll, start = NaN) {
        if (H5Common.preSnapshot) {
            if (isAll) {
                H5Common.preSnapshot = null;
                PreviewSnapshotManager.getInstance().dispose();
            } else {
                if (isNaN(start)) return;
                for (let dataObj of H5Common.preSnapshot) {
                    if (dataObj['snapshot']['end'] < start) {
                        H5Common.preSnapshot.splice(H5Common.preSnapshot.indexOf(dataObj), 1);
                        break;
                    }
                }
            }
        }
    }

}