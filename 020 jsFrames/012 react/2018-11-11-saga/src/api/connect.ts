import * as sio from 'socket.io-client';

const socket = sio('http://192.168.72.199:80/chat');

export default socket;