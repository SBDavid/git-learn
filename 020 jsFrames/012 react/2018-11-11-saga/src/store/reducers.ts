import { combineReducers } from 'redux';

export interface Message {
    id: String;
    user: User;
    text: String;
    time: Number;
}

interface User {
    id: String;
}

export interface Store {
    messages: Message[];
    login: 'login'|'pending'|'logout';
    userId: String;
}

function login(state: String, action: {type: String}) {
    if (action.type === 'login' || action.type === 'pending' || action.type === 'logout') {
        return action.type;
    } else {
        return 'logout';
    }
}

function userId(state: String, action: {type: String, userId: String}) {
    if (action.type === 'setUserId') {
        return action.userId;
    } else {
        return 'null';
    }
}

function messages(state: Message[], action: {type: String, message: Message}) {
    if (action.type === 'add') {
        const newState: Message[] = [];
        newState.concat(state, [action.message]);
        return newState;
    } else {
        return [];
    }
}

const rootReducer = combineReducers({
    login,
    messages,
    userId
});

export default rootReducer;