import { combineReducers } from 'redux';
import login, { loginAction, loginState } from './login';
import userId, { userIdAction, userIdState } from './userId';
import messages, {messagesAction, messagesState} from './messages';
import { type } from 'os';

export type loginAction = loginAction;
export type userIdAction = loginAction;
export type messagesAction = loginAction;

export interface Store {
    messages: messagesState;
    login: loginState;
    userId: userIdState;
}

const rootReducer = combineReducers({
    login,
    messages,
    userId
});

export default rootReducer;