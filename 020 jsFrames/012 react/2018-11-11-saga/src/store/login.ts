type LOGIN = 'login';
type PENDING = 'pending';
type LOGOUT = 'logout';

type LOGIN_TYPE = LOGIN|PENDING|LOGOUT;

export interface loginAction {
    type: LOGIN_TYPE;
}

export type loginState = String;

export default function login(state: loginState = 'logout', action: loginAction) {
    if (action.type === 'login' || action.type === 'logout' || action.type === 'pending') {
        return action.type;
    } else {
        return state;
    }
}