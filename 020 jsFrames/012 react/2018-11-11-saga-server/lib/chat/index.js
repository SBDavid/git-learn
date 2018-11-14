"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ChatRoom_1 = require("./ChatRoom");
var loginReq_1 = require("./listeners/loginReq");
var sendMsgReq_1 = require("./listeners/sendMsgReq");
function index(server) {
    return function (socket) {
        console.info('chatroom connected id:', socket.id);
        socket.on('loginReq', loginReq_1.default(socket, ChatRoom_1.default));
        socket.on('sendMsgReq', sendMsgReq_1.default(server, socket, ChatRoom_1.default));
        socket.on('disconnect', function () {
            console.info('disconnect');
        });
    };
}
exports.default = index;
//# sourceMappingURL=index.js.map