import { call, take, actionChannel, put } from 'redux-saga/effects';
import { delay, buffers, eventChannel} from 'redux-saga';
import { receMsgReq } from '../api/chat';
import api from '../api';
import { addMessage } from '../store/messages';

export interface sendMsgAction {
    type: 'SEND_MSG',
    text: string
}

/**
 * 监听信息发送，并阻塞2秒
 *
 * @export
 */
export function* watchSendMsg() {
    while(true) {
        const action = yield take("SEND_MSG");
        yield delay(2000);
        yield call(api.chat.send, action.text);
    }
}
/**
 * 使用actionChannel监听信息发送，并阻塞2秒
 *
 * @export
 */
export function* watchSendMsgInChannel() {
    const requestChan = yield actionChannel('SEND_MSG');
    while (true) {
        const action = yield take(requestChan);
        console.info('sendMsg', action.text);
        yield delay(100);
        yield call(api.chat.send, action.text);
    }
}

/**
 * 创建eventChannel
 *
 * @returns
 */
function createReceMsgChannel() {
    return eventChannel(emmiter => {

        api.chat.regist('receMsgReq', (res: receMsgReq) => {
            emmiter(res);
        });

        return () => {
            // TODO 取消事件监听
        }
    }, buffers.fixed(10));
}

export function* watchReceMsgInChannel() {
    const channel = yield call(createReceMsgChannel);
    while(true) {
        const res:receMsgReq = yield take(channel);
        if (res.success === false) {
            console.warn('收到新消息失败');
        } else {
            yield delay(500);
            yield put(addMessage(
                res.content.msg.user.id,
                res.content.msg.id,
                res.content.msg.text,
                res.content.msg.time
            ));
        }
    }
}

export default function* sendMsg(action: sendMsgAction): Iterator<any> {
    yield delay(2000);
    yield call(api.chat.send, action.text);
}