"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sio = require("socket.io");
var chat_1 = require("./chat");
var port = 80;
var server = sio(port);
var chatChannel = server.of('/chat');
chatChannel.on('connection', chat_1.default(server));
console.log('sockit.io is listening on ' + port);
//# sourceMappingURL=index.js.map