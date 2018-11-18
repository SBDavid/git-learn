export interface User {
    id: String;
}

export function createUser(id: String): User {
    return {
        id
    }
}