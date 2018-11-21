import { all } from 'redux-saga/effects'
import { watchSendMsg, watchSendMsgInChannel, watchReceMsgInChannel, sendMsgAction } from './chat';

export type sagaAction = sendMsgAction;

export function* rootSaga() {
    yield all([watchSendMsgInChannel(), watchReceMsgInChannel()]);
}