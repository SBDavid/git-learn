import * as sio from 'socket.io';
import chatHandler from './chat';
const port = 80;


const server = sio(port);

const chatChannel = server.of('/chat');

chatChannel.on('connection', chatHandler(server));

console.log('sockit.io is listening on ' + port);