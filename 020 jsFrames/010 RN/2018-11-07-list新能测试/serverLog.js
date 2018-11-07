const ws = require('nodejs-websocket')
const port = 3001;

const server = ws.createServer((conn) => {
    console.log('WebSocket Log is connected');

    conn.on("text", function(text) {
        console.log(text);
    })

    conn.on("close",function(code,reason){
        console.log("connection closed");
    });
    conn.on("error",function(err){
        console.log("handle err")
        console.log(err)
    });
});

server.listen(port);
console.log('websocket server listening on port ' + port)