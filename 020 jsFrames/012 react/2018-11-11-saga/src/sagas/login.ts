// 登陆相关

import api from '../api';
import { call, put, take } from 'redux-saga/effects';
import { loginAction } from '../store/reducers';

export interface loginAction {
    type: 'LOGIN'
}

export function* watchLogin() {
    while(true) {
        const action: loginAction = yield take('LOGIN');
        yield call(api.login.login);
        yield put({
            type: action.type
        });
    }
}
