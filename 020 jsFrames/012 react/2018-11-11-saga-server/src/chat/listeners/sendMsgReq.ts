// 监听用户请求登录信息
import * as sio from 'socket.io';
import publicRoom, { ChatRoom } from '../ChatRoom';
import Message from '../models/Message';

type Ack = (response: {success: boolean, content?: {msg: Message}}) => void

export default function sendMsgReq(server: sio.Server, socket: sio.Socket, room: ChatRoom) {
    return (id: String, text: String, ack: Ack) => {
        console.info(`sendMsgReq id: ${id} text: ${text}`);
        if (!room.hasUser(socket.id)) {
            console.warn('用户未登录');
            ack({
                success: false
            })
        } else {
            room.addMessage(socket.id, text);
            ack({
                success: true
            })
            const msg = publicRoom.addMessage(id, text);
            server.nsps['/chat'].emit('receMsgReq', {success: true, content: {
                msg
            }});
        }
    }
}