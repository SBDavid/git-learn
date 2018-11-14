import * as sio from 'socket.io';

import publicRoom from './ChatRoom';

export default function index (server: sio.Server) {

    return (socket: sio.Socket) => {

        console.info('chatroom connected id:', socket.id);
    
        socket.on('loginReq', () => {

            console.info('loginReq');
            if (publicRoom.hasUser(socket.id)) {
                console.warn('用户已经登陆');
                socket.emit('loginRes', {success: false});
            }

            publicRoom.addUser(socket.id);

            socket.emit('loginRes', {success: true});
        });
    
        socket.on('disconnect', function () {
            console.info('disconnect');
        });
    }
}