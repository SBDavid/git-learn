interface Message {
    username: String;
    text: String;
}

interface Store {
    messages: Message[];
}

const defaultStore: Store = {
    messages: []
}

export default function chatRoom(state: Store): Store {
    return defaultStore;
}