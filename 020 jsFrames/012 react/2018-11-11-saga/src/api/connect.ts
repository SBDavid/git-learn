import * as sio from 'socket.io-client';

const socket = sio('http://192.168.1.3:80/chat');

export default socket;