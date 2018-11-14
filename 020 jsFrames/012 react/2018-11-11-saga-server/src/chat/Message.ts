import User from '../User';

export default class Message {
    id: Number;
    user: User;
    text: String;
    time: Number;
    constructor(id: Number, user: User, text: String, time: Number) {
        this.id = id;
        this.user = user;
        this.text = text;
        this.time = time;
    }
}