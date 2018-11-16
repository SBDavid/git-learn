import api from '../api';

import { receMsgReq, sendMsgRes } from '../api/chat';
import store from '../store';

class Chat {
    start() {
        this.sendMsgRes();
        this.receMsgReq();
    }

    sendMsgRes() {
        api.chat.regist("sendMsgRes", (res: sendMsgRes) => {
            if (res.success) {
                console.info('消息发送成功');
            } else {
                console.warn('消息发送失败');
            }
        });
    }

    sendMsgReq(text: String) {
        api.chat.send(text);
    }

    receMsgReq() {
        api.chat.regist('receMsgReq', (res: receMsgReq) => {
            if (res.success) {
                console.info('收到新消息', res.content);
            }
        });
    }
}

export default new Chat();