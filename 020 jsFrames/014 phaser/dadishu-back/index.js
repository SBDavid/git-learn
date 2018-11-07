const rooms = require('./rooms');
const User = require('./user');
const utils = require('./utils');

const ws = require('nodejs-websocket')
const port = 3000;



const server = ws.createServer((conn) => {

    const queries = utils.parseQuery(conn.path);
    let targetRoom = null;
    let gameLoopTimer = null;

    console.log('New connection', queries);
    conn.on("text", function(str){

        const response = JSON.parse(str);
        console.log("Received text", response);

        if (response.signal === 'setUserReady') {
            targetRoom.setUserReady(queries.userId);
        }
    });

    conn.on("close",function(code,reason){
        console.log("connection closed")
    });
    conn.on("error",function(err){
        console.log("handle err")
        console.log(err)
    });

    if (!queries.userId) {
        const res = {
            scene: 'match',
            success: false,
            msg: 'userId为空'
        }
        conn.sendText(JSON.stringify(res));
        conn.close();
    }
    
    if (!queries.roomId) {
        const res = {
            scene: 'match',
            success: false,
            msg: 'roomId为空'
        }
        conn.sendText(JSON.stringify(res));
        conn.close();
    }

    if (rooms.isUserAlreadyJoined(queries.userId)) {
        const res = {
            scene: 'match',
            success: false,
            msg: '用户已经加入房间'
        }
        conn.sendText(JSON.stringify(res));
        conn.close();
        return;
    }

    // 获取房间
    targetRoom = rooms.find(queries.roomId);

    // 创建房间
    if (!targetRoom) {
        targetRoom = rooms.create(queries.roomId);
    }

    if (targetRoom.users.length === 2) {
        const res = {
            scene: 'match',
            success: false,
            msg: '房间已满'
        }
        conn.sendText(JSON.stringify(res));
        conn.close();
        return;
    }

    // 加入房间
    targetRoom.userJoin(new User(queries.userId));

    gameLoopTimer = setInterval(() => {
        if (targetRoom.users.length === 0) {
            // 结束游戏
            clearInterval(gameLoopTimer);
            rooms.remove(queries.roomId);
        }

        if (targetRoom.gameState === 'match') {
            const res = {
                scene: 'match',
                success: true,
                msg: '等待配对',
                state: {
                    targetRoom
                }
            };
            conn.sendText(JSON.stringify(res));
        }
    }, 1000);
});

server.listen(port);


console.log('websocket server listening on port ' + port)