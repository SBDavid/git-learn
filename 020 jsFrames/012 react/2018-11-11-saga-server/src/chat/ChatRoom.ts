// 聊天室业务逻辑

import User from '../User';
import Message from './Message';

export class ChatRoom {
    // 已登录用户
    users: Map<String, User>;
    // 房间所有消息（实时）
    messages: Message[];
    // 消息自增ID
    messageId: 0;

    constructor() {
        this.users = new Map<String ,User>();
        this.messages = [];
    }

    /**
     * 获取用户数量
     *
     * @readonly
     * @memberof ChatRoom
     */
    get userAmount() {
        return this.users.size;
    }

    /**
     * 判断用户时候已经登录房间
     *
     * @param {String} id 用户ID
     * @returns
     * @memberof ChatRoom
     */
    hasUser(id: String) {
        return this.users.has(id);
    }

    /**
     * 更具ID返回用户
     *
     * @param {String} id
     * @returns
     * @memberof ChatRoom
     */
    findUser(id: String) {
        return this.users.get(id);
    }

    /**
     * 增加登录的用户
     *
     * @param {String} id
     * @memberof ChatRoom
     */
    addUser(id: String) {
        this.users.set(id, new User(id));
    }

    /**
     * 注销用户, 用户注销后历史消息无法显示用户信息
     *
     * @param {String} id
     * @memberof ChatRoom
     */
    removeUser(id: String) {
        this.users.delete(id);
    }

    /**
     * 用户发送信息
     *
     * @param {String} id
     * @param {String} text
     * @memberof ChatRoom
     */
    addMessage(id: String, text: String) {
        const user = this.findUser(id);
        if (user) {
            const msg = new Message(this.messageId++, user, text, +new Date());
            this.messages.push(msg);
        }
    }
}

const publicRoom = new ChatRoom();

export default publicRoom;