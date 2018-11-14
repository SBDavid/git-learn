"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ChatRoom_1 = require("./ChatRoom");
function index(server) {
    return function (socket) {
        console.info('chatroom connected id:', socket.id);
        socket.on('loginReq', function () {
            console.info('loginReq');
            if (ChatRoom_1.default.hasUser(socket.id)) {
                console.warn('用户已经登陆');
                socket.emit('loginRes', { success: false });
            }
            ChatRoom_1.default.addUser(socket.id);
            socket.emit('loginRes', { success: true });
        });
        socket.on('disconnect', function () {
            console.info('disconnect');
        });
    };
}
exports.default = index;
//# sourceMappingURL=index.js.map