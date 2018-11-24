import { call, take, actionChannel, put, cancelled } from 'redux-saga/effects';
import { delay, buffers, eventChannel, Buffer } from 'redux-saga';
import { receMsgReq } from '../api/chat';
import api from '../api';
import { addMessage } from '../store/messages';
import Message from '../page/component/Message';

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
 * 创建接受服务端buffer
 * 每隔maxTime毫秒或者累计超过maxAmount发射一次
 * 
 * @param {number} maxTime
 * @param {number} maxAmount
 * @returns {Buffer}
 */
function createReceMsgBuffer(maxTime: number = 300, maxAmount: number = 10): Buffer<receMsgReq> {
    const action: receMsgReq = {
        success: true,
        content: {
            msgs: []
        }
    }

    const {content: {msgs}} = action;

    let timer:number|null = null;
    let shouldFire = false;

    return {
        isEmpty: () => {
            console.info('isEmpty', msgs.length < maxAmount && !shouldFire)
            return msgs.length < maxAmount && !shouldFire
        },
        put: (msg) => {
            console.info('put', msgs.length)
            msgs.push(...msg.content.msgs);
            if (msgs.length > maxAmount) {
                clearTimeout(timer);
                timer = null;
                shouldFire = false;
                console.info('put maxAmount')
            } else if (timer === null) {
                timer = window.setTimeout(() => {
                    shouldFire = true;
                }, maxTime);
                console.info('put time')
            }
        },
        take: () => {
            if (msgs.length > 0) {
                shouldFire = false;
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }

                console.info('take', action)
                return {
                    success: true,
                    content: {
                        msgs: [{
                            text: 'test',
                            time: +new Date(),
                            user: {
                                id: '11111'
                            },
                            id: Math.random()
                        }]
                    }
                };
            }
            console.info('take')
        },
        flush: () => {
            shouldFire = false;
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            console.info('flush', action)
            return action;
        }
    };
}

const test = {
    put: (res: receMsgReq) => {
        console.info('put')
    },
    take: () => {
        return {
            success: false,
            content: {
                msgs: [{
                    text: 'test',
                    time: +new Date(),
                    user: {
                        id: '11111'
                    },
                    id: Math.random()
                }]
            }
        }
    },
    isEmpty: () => {
        return true;
    },
    flush: () => {
        return {
            success: false,
            content: {
                msgs: [{
                    text: 'test',
                    time: +new Date(),
                    user: {
                        id: '11111'
                    },
                    id: Math.random()
                }]
            }
        }
    }
}

/**
 * 创建eventChannel
 *
 * @returns
 */
function createReceMsgChannel() {
    return eventChannel(emmiter => {

        return api.chat.regist('receMsgReq', (res: receMsgReq) => {
            if (res.success) {
                console.info('emmiter')
                emmiter(res);
            } else {
                console.info('接受消息失败', res);
            }
        });

        
    }, createReceMsgBuffer(3000, 10));
}

// 创建channel
const channel = createReceMsgChannel();

export function stopReceMsgInChannel() {
    channel.close();
}

/**
 * 通过eventChannel监听websocket消息
 *
 * @export
 */
export function* watchReceMsgInChannel() {
    
    try {
        while(true) {
            const res:receMsgReq = yield take(channel);
            if (res.success === false) {
                console.warn('收到新消息失败');
            } else {
                for (let i=0; i<res.content.msgs.length; i++) {
                    yield delay(1000)
                    yield put(addMessage(
                        res.content.msgs[i].user.id,
                        res.content.msgs[i].id,
                        res.content.msgs[i].text,
                        res.content.msgs[i].time
                    ));
                }
            }
        }
    } finally {
        console.log('countdown cancelled');
    }
}

export default function* sendMsg(action: sendMsgAction): Iterator<any> {
    yield delay(2000);
    yield call(api.chat.send, action.text);
}