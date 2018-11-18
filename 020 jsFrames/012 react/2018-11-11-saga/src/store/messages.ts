import {Message} from '../model/Message';

export type messagesState = Message[];

export interface messagesAction {
    type: 'add';
    message: Message;
}

export default function messages(state: messagesState = [], action: messagesAction) {
    if (action.type === 'add') {
        let newState: Message[] = [];
        newState = newState.concat(state, [action.message]);
        return newState;
    } else {
        return state;
    }
}