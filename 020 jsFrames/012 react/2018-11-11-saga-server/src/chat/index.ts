import * as sio from 'socket.io';

import publicRoom from './ChatRoom';
import loginReq from './listeners/loginReq';
import sendMsgReq from './listeners/sendMsgReq';

export default function index (server: sio.Server) {

    return (socket: sio.Socket) => {

        console.info('chatroom connected id:', socket.id);
    

        socket.on('loginReq', loginReq(socket, publicRoom));
        socket.on('sendMsgReq', sendMsgReq(server, socket, publicRoom));
    
        socket.on('disconnect', function () {
            console.info('disconnect');
        });
    }
}