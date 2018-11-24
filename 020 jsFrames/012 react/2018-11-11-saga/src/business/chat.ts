
import store, { sagaMiddleWare } from '../store';
import { watchReceMsgInChannel, stopReceMsgInChannel } from '../sagas/chat';
class Chat {
    sendMsgReq(text: string) {
        store.dispatch({
            type: 'SEND_MSG',
            text
        })
    }

    startReceMsgReq() {
        sagaMiddleWare.run(watchReceMsgInChannel);
    }

    stopReceMsgReq() {
        stopReceMsgInChannel();
    }
}

export default new Chat();