// 聊天消息接口

import socket from './connect';
import ResponseBase from './response';

export interface sendMsgRes extends ResponseBase {}
export interface receMsgReq extends ResponseBase {
    content: {
        id: String;
        text: String;
    }
}

export default class Chat {
    onSendMsgRes: (res: sendMsgRes) => void;
    onReceMsgReq: (req: receMsgReq) => void;

    constructor() {
        // 发送消息返回
        socket.on('sendMsgRes', (res: sendMsgRes) => {
            this.sendMsgResHandler(res);
        });
        // 服务端推动新消息
        socket.on('receMsgReq', (res: receMsgReq) => {
            this.receMsgReqHandler(res);
        })

        this.regist = this.regist.bind(this);
        this.sendMsgResHandler = this.sendMsgResHandler.bind(this);
        this.receMsgReqHandler = this.receMsgReqHandler.bind(this);
    }

    send(text: String) {
        if (socket.connected) {
            socket.emit('sendMsgReq', socket.id, text);
            console.info('sendMsgReq');
        } else {
            throw Error('connect broken');
        }
    }

    regist(event: 'sendMsgRes'|'receMsgReq', callback: (res: receMsgReq|sendMsgRes)=> void) {
        if (event === 'sendMsgRes') {
            this.onSendMsgRes = callback;
        } else if (event === 'receMsgReq') {
            this.onReceMsgReq = callback;
        }
    }

    sendMsgResHandler(res: sendMsgRes) {
        this.onSendMsgRes && this.onSendMsgRes(res);
    }

    // 收到服务端推送的消息
    receMsgReqHandler(req: receMsgReq) {
        this.onReceMsgReq && this.onReceMsgReq(req);
    }
}