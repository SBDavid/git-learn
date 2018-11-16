export interface Message {
    id: String;
    user: User;
    text: String;
    time: Number;
}

interface User {
    id: String;
}

export type messagesState = Message[];

export interface messagesAction {
    type: 'add';
    message: Message;
}

export default function messages(state: messagesState = [], action: messagesAction) {
    if (action.type === 'add') {
        const newState: Message[] = [];
        newState.concat(state, [action.message]);
        return newState;
    } else {
        return state;
    }
}