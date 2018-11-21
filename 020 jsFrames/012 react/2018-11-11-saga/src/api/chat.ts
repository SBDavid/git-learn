// 聊天消息接口

import socket from './connect';
import ResponseBase from './response';
import { Message } from '../model/Message';

export interface sendMsgRes extends ResponseBase {}
export interface receMsgReq extends ResponseBase {
    content: {
        msg: Message
    }
}

export default class Chat {
    onReceMsgReq: (req: receMsgReq) => void;

    constructor() {
        // 服务端推动新消息
        socket.on('receMsgReq', (res: receMsgReq) => {
            this.receMsgReqHandler(res);
        })

        this.regist = this.regist.bind(this);
        this.receMsgReqHandler = this.receMsgReqHandler.bind(this);
    }

    /**
     * 发送信息
     *
     * @param {String} text
     * @memberof Chat
     */
    send(text: String) {
        return new Promise((res, rej) => {
            if (socket.connected) {
                console.info('sendMsgReq');
                socket.emit('sendMsgReq', socket.id, text, (response: sendMsgRes) => {
                    res(response);
                });
            } else {
                rej('connect broken');
            }
        });
    }

    regist(event: 'receMsgReq', callback: (res: receMsgReq|sendMsgRes)=> void) {
        if (event === 'receMsgReq') {
            this.onReceMsgReq = callback;
        }
    }

    // 收到服务端推送的消息
    receMsgReqHandler(req: receMsgReq) {
        this.onReceMsgReq && this.onReceMsgReq(req);
    }
}