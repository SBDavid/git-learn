import {User, createUser} from './User';

export interface Message {
    id: number;
    user: User;
    text: String;
    time: number;
}
/**
 *
 *
 * @export
 * @param {String} id 自增ID
 * @param {User} user 发送者
 * @param {String} text 消息内容
 * @param {number} time 事件
 */
export function createMessage (id: number, user: User, text: String, time: number): Message{
    return {
        id,
        user,
        text,
        time
    }
}