"use strict";
// 聊天室业务逻辑
Object.defineProperty(exports, "__esModule", { value: true });
var User_1 = require("../User");
var Message_1 = require("./Message");
var ChatRoom = /** @class */ (function () {
    function ChatRoom() {
        this.users = new Map();
        this.messages = [];
    }
    Object.defineProperty(ChatRoom.prototype, "userAmount", {
        /**
         * 获取用户数量
         *
         * @readonly
         * @memberof ChatRoom
         */
        get: function () {
            return this.users.size;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 判断用户时候已经登录房间
     *
     * @param {String} id 用户ID
     * @returns
     * @memberof ChatRoom
     */
    ChatRoom.prototype.hasUser = function (id) {
        return this.users.has(id);
    };
    /**
     * 更具ID返回用户
     *
     * @param {String} id
     * @returns
     * @memberof ChatRoom
     */
    ChatRoom.prototype.findUser = function (id) {
        return this.users.get(id);
    };
    /**
     * 增加登录的用户
     *
     * @param {String} id
     * @memberof ChatRoom
     */
    ChatRoom.prototype.addUser = function (id) {
        this.users.set(id, new User_1.default(id));
    };
    /**
     * 注销用户, 用户注销后历史消息无法显示用户信息
     *
     * @param {String} id
     * @memberof ChatRoom
     */
    ChatRoom.prototype.removeUser = function (id) {
        this.users.delete(id);
    };
    /**
     * 用户发送信息
     *
     * @param {String} id
     * @param {String} text
     * @memberof ChatRoom
     */
    ChatRoom.prototype.addMessage = function (id, text) {
        var user = this.findUser(id);
        if (user) {
            var msg = new Message_1.default(this.messageId++, user, text, +new Date());
            this.messages.push(msg);
        }
    };
    return ChatRoom;
}());
exports.ChatRoom = ChatRoom;
var publicRoom = new ChatRoom();
exports.default = publicRoom;
//# sourceMappingURL=ChatRoom.js.map