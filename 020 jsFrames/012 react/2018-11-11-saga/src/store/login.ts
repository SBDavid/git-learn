type LOGIN = 'login';
type PENDING = 'pending';
type LOGOUT = 'logout';

type LOGIN_TYPE = LOGIN|PENDING|LOGOUT;

export interface loginAction {
    type: LOGIN_TYPE;
}

export type loginState = String;

export default function login(state: loginState, action: loginAction) {
    if (action) {
        return action.type;
    } else {
        return 'logout';
    }
}