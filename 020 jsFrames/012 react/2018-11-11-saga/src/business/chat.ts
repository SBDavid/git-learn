import api from '../api';

import { receMsgReq, sendMsgRes } from '../api/chat';
import store from '../store';
import { addMessage } from '../store/messages';
import { loginAction, messagesAction, userIdAction } from '../store/reducers';

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

    sendMsgReq(text: string) {
        store.dispatch({
            type: 'SEND_MSG',
            text
        })
    }

    receMsgReq() {
        api.chat.regist('receMsgReq', (res: receMsgReq) => {
            if (res.success) {
                store.dispatch(addMessage(
                    res.content.msg.user.id,
                    res.content.msg.id,
                    res.content.msg.text,
                    res.content.msg.time
                ));
            } else {
                console.warn('收到新消息失败');
            }
        });
    }
}

export default new Chat();