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

import Global from "../../cn/pplive/player/manager/Global";
import {BaseLoader, LoaderStatus, LoaderErrors} from './loader.js';
import {RuntimeException} from '../utils/exception.js';

// For FireFox browser which supports `xhr.responseType = 'moz-chunked-arraybuffer'`
class MozChunkedLoader extends BaseLoader {

    static isSupported() {
        try {
            let xhr = new XMLHttpRequest();
            // Firefox 37- requires .open() to be called before setting responseType
            xhr.open('GET', '//example.com', true);
            xhr.responseType = 'moz-chunked-arraybuffer';
            return (xhr.responseType === 'moz-chunked-arraybuffer');
        } catch (e) {
            Global.debug('MozChunkedLoader', e.message);
            return false;
        }
    }

    constructor() {
        super('xhr-moz-chunked-loader');
        this.TAG = 'MozChunkedLoader';
        this._needStash = true;

        this._xhr = null;
        this._requestAbort = false;
        this._contentLength = null;
        this._receivedLength = 0;
    }

    destroy() {
        if (this.isWorking()) {
            this.abort();
        }
        if (this._xhr) {
            this._xhr.onreadystatechange = null;
            this._xhr.onprogress = null;
            this._xhr.onloadend = null;
            this._xhr.onerror = null;
            this._xhr = null;
        }
        super.destroy();
    }

    open(dataSource) {
        this._dataSource = dataSource;
        let sourceURL = dataSource.url;
        let xhr = this._xhr = new XMLHttpRequest();
        xhr.open('GET', sourceURL, true);
        xhr.responseType = 'moz-chunked-arraybuffer';
        xhr.onreadystatechange = this._onReadyStateChange;
        xhr.onprogress = this._onProgress;
        xhr.onloadend = this._onLoadEnd;
        xhr.onerror = this._onXhrError;

        // cors is auto detected and enabled by xhr

        // withCredentials is disabled by default
        if (dataSource.withCredentials && xhr['withCredentials']) {
            xhr.withCredentials = true;
        }

        this._status = LoaderStatus.kConnecting;
        xhr.send();
    }

    abort() {
        this._requestAbort = true;
        if (this._xhr) {
            this._xhr.abort();
        }
        this._status = LoaderStatus.kComplete;
    }

    _onReadyStateChange = (e) => {
        let xhr = e.target;

        if (xhr.readyState === 2) {  // HEADERS_RECEIVED
            if (xhr.status !== 0 && (xhr.status < 200 || xhr.status > 299)) {
                this._status = LoaderStatus.kError;
                if (this._onError) {
                    this._onError(LoaderErrors.HTTP_STATUS_CODE_INVALID, {code: xhr.status, msg: xhr.statusText});
                } else {
                    throw new RuntimeException('MozChunkedLoader: Http code invalid, ' + xhr.status + ' ' + xhr.statusText);
                }
            } else {
                this._status = LoaderStatus.kBuffering;
            }
        }
    }

    _onProgress = (e) => {
        if (this._contentLength === null) {
            if (e.total !== null && e.total !== 0) {
                this._contentLength = e.total;
                if (this._onContentLengthKnown) {
                    this._onContentLengthKnown(this._contentLength);
                }
            }
        }

        let chunk = e.target.response;
        let byteStart = this._receivedLength;
        this._receivedLength += chunk.byteLength;
		if (this._onDataArrival) {
        	this._onDataArrival(chunk, byteStart, this._receivedLength);
        }
    }

    _onLoadEnd = (e) => {
        if (this._requestAbort === true) {
            this._requestAbort = false;
            return;
        } else if (this._status === LoaderStatus.kError) {
            return;
        }

        this._status = LoaderStatus.kComplete;
        if (this._onComplete) {
            this._onComplete(0, this._receivedLength - 1);
        }
    }

    _onXhrError = (e) => {
        this._status = LoaderStatus.kError;
        let type = 0;
        let info = null;

        if (this._contentLength && e.loaded < this._contentLength) {
            type = LoaderErrors.EARLY_EOF;
            info = {code: -1, msg: 'Moz-Chunked stream meet Early-Eof'};
        } else {
            type = LoaderErrors.EXCEPTION;
            info = {code: -1, msg: e.constructor.name + ' ' + e.type};
        }

        if (this._onError) {
            this._onError(type, info);
        } else {
            throw new RuntimeException(info.msg);
        }
    }

}

export default MozChunkedLoader;