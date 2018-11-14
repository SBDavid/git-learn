"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sendMsgReq(server, socket, room) {
    return function (id, text) {
        console.info("sendMsgReq id: " + id + " text: " + text);
        if (!room.hasUser(socket.id)) {
            console.warn('用户未登录');
            socket.emit('sendMsgRes', { success: false });
        }
        else {
            room.addMessage(socket.id, text);
            socket.emit('sendMsgRes', { success: true });
            server.nsps['/chat'].emit('receMsgReq', { success: true, content: {
                    id: id,
                    text: text
                } });
        }
    };
}
exports.default = sendMsgReq;
//# sourceMappingURL=sendMsgReq.js.map