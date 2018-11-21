"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ChatRoom_1 = require("../ChatRoom");
function sendMsgReq(server, socket, room) {
    return function (id, text, ack) {
        console.info("sendMsgReq id: " + id + " text: " + text);
        if (!room.hasUser(socket.id)) {
            console.warn('用户未登录');
            ack({
                success: false
            });
        }
        else {
            room.addMessage(socket.id, text);
            ack({
                success: true
            });
            var msg = ChatRoom_1.default.addMessage(id, text);
            server.nsps['/chat'].emit('receMsgReq', { success: true, content: {
                    msg: msg
                } });
        }
    };
}
exports.default = sendMsgReq;
//# sourceMappingURL=sendMsgReq.js.map