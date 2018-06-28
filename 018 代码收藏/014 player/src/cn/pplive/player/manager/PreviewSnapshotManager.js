/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import Global from "./Global";

class EventDispatcher {

    constructor(){
        this._listener = {};
    }

    addEvent(type, fn) {
        if (typeof type === "string" && typeof fn === "function") {
            if (typeof this._listener[type] === "undefined") {
                this._listener[type] = [fn];
            } else {
                this._listener[type].push(fn);    
            }
        }
        return this;
    }

    fireEvent(type) {
        if (type && this._listener[type]) {
            let events = {
                            type: type,
                            target: this
                        }
            for (let length = this._listener[type].length, start=0; start<length; start+=1) {
                this._listener[type][start].call(this, events);
            }
        }
        return this;
    }

    removeEvent(type, key) {
        let listeners = this._listener[type];
        if (listeners instanceof Array) {
            if (typeof key === "function") {
                for (let i=0, length=listeners.length; i<length; i+=1){
                    if (listeners[i] === key){
                        listeners.splice(i, 1);
                        break;
                    }
                }
            } else if (key instanceof Array) {
                for (let lis=0, lenkey = key.length; lis<lenkey; lis+=1) {
                    this.removeEvent(type, key[lenkey]);
                }
            } else {
                delete this._listener[type];
            }
        }
        return this;
    }
}

export default class PreviewSnapshotManager extends EventDispatcher {

    static PREVIEW_SNAPSHOT = 'preview_snapshot';
    static isSingleton = false;
    static instance;

    $dataObj;
    $requestArr = [];
    $isRequest = false;
    
    static getInstance() {
		if (!PreviewSnapshotManager.instance) {
			PreviewSnapshotManager.isSingleton = true;
            PreviewSnapshotManager.instance = new PreviewSnapshotManager();
			PreviewSnapshotManager.isSingleton = false;
		}
		return PreviewSnapshotManager.instance;
    }

    /**
     * 截图请求的内存释放
     */
    dispose() {
        this.$dataObj = null;
        this.$requestArr = [];
        this.$isRequest = false;
    }
    
    /**
     * 请求截图数据大图
     * @param	url          大图url地址
     * @param	snapshotObj  当前请求的相关自定义属性对象
     */
    loadData(url, snapshotObj = null) {
        if (this.$requestArr.length > 0) {
            for (let reqObj of this.$requestArr) {
                if (reqObj['url'] == url) {
                    //Global.debug('预览截图请求重复  ===>>>');
                    return;
                }
            }
        }
        this.$requestArr.unshift({
                                    'url'     : url,
                                    'snapshot': snapshotObj
                                });
        this.execute();
    }

    execute() {
        if (!this.$isRequest && this.$requestArr.length > 0) {
            this.load(this.$requestArr[0]);
        }
    }

    load(obj) {
        this.$isRequest = true;
        this.$dataObj = { };
        this.$dataObj['snapshot'] = obj['snapshot'];
        this.$dataObj['url'] = obj['url'];
        Global.debug('预览大图请求地址  ===>>>  ' + obj['url'], ', 请求时间点  ===>>> ', obj['snapshot']['posi']);
        let $img = new Image();
        $img.src = obj['url'];
        $img.onload = this.onTargetHandler;
        $img.onabort = this.onTargetHandler;
        $img.onerror = this.onTargetHandler;
    }

    onTargetHandler = (e) => {
        if (this.$requestArr.length > 0) {
            for (let reqObj of this.$requestArr) {
                if (reqObj['url'] == this.$dataObj['url']) {
                    this.$requestArr.splice(this.$requestArr.indexOf(reqObj), 1);
                    Global.debug('请求结束后，删除请求队列中的相关元素  ===>>>');
                    break;
                }
            }
        }
        switch(e.type) {
            case 'abort':
            case 'error':
                Global.debug('预览截图请求错误 | 中断  ===>>>  ', e.toString());
                break;
            case 'load':
                this.$dataObj['content'] = e.target;
                this.fireEvent(PreviewSnapshotManager.PREVIEW_SNAPSHOT);
                break;
            default:
                break;
        }
        this.$isRequest = false;
        this.execute();
    }

    get dataObj() {
        return this.$dataObj;
    }

}