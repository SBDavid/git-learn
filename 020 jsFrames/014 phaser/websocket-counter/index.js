
var ws = require('nodejs-websocket')
const port = 3000;

const server = ws.createServer((conn) => {
    console.log('New connection', conn.path)
    conn.on("text",function(str){
        console.log("Received"+str)
        // conn.sendText(str.toUpperCase()+"!!!") //大写收到的数据
        conn.sendText(str)  //收到直接发回去
    })
    conn.on("close",function(code,reason){
        console.log("connection closed")
    })
    conn.on("error",function(err){
        console.log("handle err")
        console.log(err)
    })
});

server.listen(port);


console.log('websocket server listening on port ' + port)