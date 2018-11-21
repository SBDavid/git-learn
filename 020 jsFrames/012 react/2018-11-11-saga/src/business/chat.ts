import api from '../api';

import { receMsgReq, sendMsgRes } from '../api/chat';
import store from '../store';
import { addMessage } from '../store/messages';

class Chat {
    start() {
        this.receMsgReq();
    }


    sendMsgReq(text: string) {
        store.dispatch({
            type: 'SEND_MSG',
            text
        })
    }

    receMsgReq() {
        /* api.chat.regist('receMsgReq', (res: receMsgReq) => {
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
        }); */
    }
}

export default new Chat();