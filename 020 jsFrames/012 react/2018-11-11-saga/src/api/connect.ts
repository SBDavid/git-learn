import * as sio from 'socket.io-client';

const socket = sio('http://localhost:80/chat');

export default socket;