"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function loginReq(socket, room) {
    return function () {
        console.info('loginReq');
        if (room.hasUser(socket.id)) {
            console.warn('用户已经登陆');
            socket.emit('loginRes', { success: false });
        }
        room.addUser(socket.id);
        socket.emit('loginRes', { success: true });
    };
}
exports.default = loginReq;
//# sourceMappingURL=loginReq.js.map