import User from '../User';
import { truncateSync } from 'fs';

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