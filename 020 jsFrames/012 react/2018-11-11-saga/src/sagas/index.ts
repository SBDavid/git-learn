import { all } from 'redux-saga/effects'
import { watchSendMsg, sendMsgAction } from './chat';

export type sagaAction = sendMsgAction;

export function* rootSaga() {
    yield all([watchSendMsg()]);
}