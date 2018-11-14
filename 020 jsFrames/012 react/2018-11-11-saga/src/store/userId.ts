export type userIdState = String;
export interface userIdAction {
    type: 'setUserId';
    userId: String;
}

export default function userId(state: userIdState, action: userIdAction) {
    if (action.type === 'setUserId') {
        return action.userId;
    } else {
        return 'null';
    }
}