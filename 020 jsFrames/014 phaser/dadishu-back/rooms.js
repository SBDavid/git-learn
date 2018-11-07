const Room = require('./room');

class Rooms {
    constructor() {
        this.rooms = [];
    }

    create(roomId) {
        const newRoom = new Room(roomId);
        this.rooms.push(newRoom);
        return newRoom;
    }

    remove(roomId) {
        const index = this.rooms.findIndex((val) => {
            return val.roomId === roomId;
        });

        this.rooms.splice(index, 1);
    }

    has(roomId) {
        return this.rooms.findIndex((val) => {
            return val.roomId === roomId;
        }) !== -1;
    }

    find(roomId) {
        const index = this.rooms.findIndex((val) => {
            return val.roomId === roomId;
        });

        return this.rooms[index];
    }

    isUserAlreadyJoined(userId) {
        for (let i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].hasUserId(userId)) {
                return true
            }
        }
        return false;
    }

    findRoomByUserId(userId) {
        for (let i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].hasUserId(userId)) {
                return this.rooms[i];
            }
        }
        return null;
    }
}

const rooms = new Rooms();

module.exports = rooms;