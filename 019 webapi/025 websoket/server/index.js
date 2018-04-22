var WebSocketServer = require('ws').Server,
wss = new WebSocketServer({ port: 8181 });
wss.on('connection', function (ws) {
    console.log('client connected');
    ws.on('message', function (message) {
        console.log(message);
        /* setInterval(function() {
            ws.send('服务端收到消息');
        }, 1000); */
        if (message === '1000') {
            ws.terminate();
            console.log('terminate');
        }

        if (message === '500') {
            ws.send('服务端收到消息', {
                fin: false 
            });
        }

        if (message === '100') {
            ws.send('100', {
                fin: true 
            });
        }
    });

    ws.on('close', function close() {
        console.log('disconnected');
    });
});

