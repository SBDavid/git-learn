import User from '../User';
import Message from './Message';

class ChatRoom {
    users: Map<String, User>;
    messages: Message[];
    messageId: 0;

    constructor() {
        this.users = new Map<String ,User>();
        this.messages = [];
    }

    get userAmount() {
        return this.users.size;
    }

    hasUser(id: String) {
        return this.users.has(id);
    }

    findUser(id: String) {
        return this.users.get(id);
    }

    addUser(id: String) {
        this.users.set(id, new User(id));
    }

    removeUser(id: String) {
        this.users.delete(id);
    }

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