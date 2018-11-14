// 监听用户请求登录信息
import * as sio from 'socket.io';
import { ChatRoom } from '../ChatRoom';

export default function sendMsgReq(server: sio.Server, socket: sio.Socket, room: ChatRoom) {
    return (id: String, text: String) => {
        console.info(`sendMsgReq id: ${id} text: ${text}`);
        if (!room.hasUser(socket.id)) {
            console.warn('用户未登录');
            socket.emit('sendMsgRes', {success: false});
        } else {
            room.addMessage(socket.id, text);
            socket.emit('sendMsgRes', {success: true});
            server.nsps['/chat'].emit('receMsgReq', {success: true, content: {
                id,
                text
            }});
        }
    }
}