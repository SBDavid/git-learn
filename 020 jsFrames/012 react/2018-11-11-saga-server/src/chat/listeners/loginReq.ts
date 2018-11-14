// 监听用户请求登录信息
import * as sio from 'socket.io';
import { ChatRoom } from '../ChatRoom';

export default function loginReq(socket: sio.Socket, room: ChatRoom) {
    return () => {
        console.info('loginReq');
        if (room.hasUser(socket.id)) {
            console.warn('用户已经登陆');
            socket.emit('loginRes', {success: false});
        }

        room.addUser(socket.id);

        socket.emit('loginRes', {success: true});
    }
}