import {Message} from '../model/Message';
import { createMessage } from '../model/Message';
import { createUser } from '../model/User';

export type messagesState = Message[];

export interface messagesAction {
    type: 'add';
    message: Message;
}

export function addMessage(userId: String, messageId: number, text: String, time: number): messagesAction {
    return {
        type: 'add',
        message: createMessage(
            messageId,
            createUser(userId),
            text,
            time
        )
    };
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