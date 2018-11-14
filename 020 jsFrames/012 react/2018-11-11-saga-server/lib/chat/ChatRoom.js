"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var User_1 = require("../User");
var Message_1 = require("./Message");
var ChatRoom = /** @class */ (function () {
    function ChatRoom() {
        this.users = new Map();
        this.messages = [];
    }
    Object.defineProperty(ChatRoom.prototype, "userAmount", {
        get: function () {
            return this.users.size;
        },
        enumerable: true,
        configurable: true
    });
    ChatRoom.prototype.hasUser = function (id) {
        return this.users.has(id);
    };
    ChatRoom.prototype.findUser = function (id) {
        return this.users.get(id);
    };
    ChatRoom.prototype.addUser = function (id) {
        this.users.set(id, new User_1.default(id));
    };
    ChatRoom.prototype.removeUser = function (id) {
        this.users.delete(id);
    };
    ChatRoom.prototype.addMessage = function (id, text) {
        var user = this.findUser(id);
        if (user) {
            var msg = new Message_1.default(this.messageId++, user, text, +new Date());
            this.messages.push(msg);
        }
    };
    return ChatRoom;
}());
var publicRoom = new ChatRoom();
exports.default = publicRoom;
//# sourceMappingURL=ChatRoom.js.map