import { call, takeEvery, take } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import api from '../api';
import { Action } from 'redux';

export interface sendMsgAction {
    type: 'SEND_MSG',
    text: string
}

export function* watchSendMsg() {
    while(true) {
        const action = yield take("SEND_MSG");
        yield delay(2000);
        yield call(api.chat.send, action.text);
    }
}


/* export default function* sendMsg(text: string): Iterator<any> {
    yield call(api.chat.send, text);
} */