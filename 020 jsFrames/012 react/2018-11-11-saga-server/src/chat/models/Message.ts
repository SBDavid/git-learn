import User from '../../User';

export default class Message {
    /**
     * 自增ID
     *
     * @type {Number}
     * @memberof Message
     */
    id: Number;
    /**
     * 发送者
     *
     * @type {User}
     * @memberof Message
     */
    user: User;
    /**
     * 消息内容
     *
     * @type {String}
     * @memberof Message
     */
    text: String;
    /**
     * 发送时间
     *
     * @type {Number}
     * @memberof Message
     */
    time: Number;
    constructor(id: Number, user: User, text: String, time: Number) {
        this.id = id;
        this.user = user;
        this.text = text;
        this.time = time;
    }
}