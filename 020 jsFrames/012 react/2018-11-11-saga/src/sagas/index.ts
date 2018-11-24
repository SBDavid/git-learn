import { all } from 'redux-saga/effects'
import { watchSendMsgInChannel, sendMsgAction } from './chat';
import { watchLogin, loginAction } from './login';

export type sagaAction = sendMsgAction|loginAction;

export function* rootSaga() {
    yield all([watchSendMsgInChannel(), watchLogin()]);
}