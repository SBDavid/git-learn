const User = require('./user');

class Room {

    constructor(roomId) {
        this.roomId = roomId;
        this.users = [];
        this.gameState = 'match';
    }

    hasUserId(userId) {
        return this.users.findIndex((val) => {
            return val.userId === userId;
        }) !== -1;
    }

    findUser(userId) {
        const index = this.users.findIndex((val) => {
            return val.userId === userId;
        });

        return index !== -1 ? this.users[index] : null;
    }

    userJoin(user) {
        this.users.push(user);
    }

    setUserReady(userId) {
        const user = this.findUser(userId);
        if (user) {
            user.isReady = true;
        }
    }

    userQuit(user) {
        const index = this.users.findIndex((val) => {
            return val.userId === user.userId;
        });

        this.users.splice(index, 1);
    }
}

module.exports = Room;