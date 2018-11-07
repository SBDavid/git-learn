const ws = require('nodejs-websocket')
const port = 3000;

const server = ws.createServer((conn) => {
    console.log('New connection');

    let counter = 0;
    let startTime = +new Date();

    const timer = setInterval(() => {
        conn.sendText(JSON.stringify({
            key: ++counter,
            backgroundColor: counter%2 === 0 ? 'powderblue' : 'skyblue'
        }));
        console.info(+new Date() - startTime, counter);
        startTime = +new Date();
    }, 100);

    conn.on("close",function(code,reason){
        console.log("connection closed");
        clearInterval(timer);
    });
    conn.on("error",function(err){
        console.log("handle err")
        console.log(err)
        clearInterval(timer);
    });
});

server.listen(port);
console.log('websocket server listening on port ' + port)