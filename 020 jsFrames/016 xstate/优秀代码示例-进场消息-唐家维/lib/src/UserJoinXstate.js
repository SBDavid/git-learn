import { Machine, interpret, assign, actions } from 'xstate';
var send = actions.send, cancel = actions.cancel;
var mechine = Machine({
    id: 'userJoin',
    initial: 'init',
    context: {
        msg: null
    },
    states: {
        init: {
            onEntry: cancel('keepDisplayTimer'),
            on: {
                JOIN_USER: {
                    target: 'keepDisplay',
                    actions: ['SET_MSG']
                }
            }
        },
        keepDisplay: {
            onEntry: send('UNLOCK', { delay: 2000, id: 'keepDisplayTimer' }),
            onExit: cancel('keepDisplayTimer'),
            on: {
                JOIN_USER: {
                    internal: false,
                    target: 'keepDisplay',
                    actions: ['SET_MSG']
                },
                UNLOCK: {
                    target: 'display'
                },
                LEAVE_ROOM: {
                    target: 'init'
                },
                PAUSE: {
                    target: 'pause'
                }
            }
        },
        display: {
            on: {
                HIDE: {
                    target: 'hide'
                },
                LEAVE_ROOM: {
                    target: 'init'
                },
                JOIN_USER: {
                    target: 'keepDisplay',
                    actions: ['SET_MSG']
                },
                PAUSE: {
                    target: 'pause'
                }
            }
        },
        hide: {
            on: {
                JOIN_USER: {
                    target: 'keepDisplay',
                    actions: ['SET_MSG']
                },
                LEAVE_ROOM: {
                    target: 'init'
                },
                PAUSE: {
                    target: 'pause'
                }
            }
        },
        pause: {
            on: {
                LEAVE_ROOM: {
                    target: 'init'
                },
                HIDE: {
                    target: 'hide'
                }
            }
        }
    }
}, {
    actions: {
        SET_MSG: assign({
            msg: function (ctx, event) {
                return event.msg;
            }
        })
    }
});
var service = interpret(mechine);
// 打印状态转移
service.onTransition(function (nextState) {
    console.info('onTrasition', nextState);
});
// 启动状态
service.start();
// 进入房间
service.send({
    type: 'JOIN_USER',
    msg: 'David 进入房间'
});
// 暂停进场消息
setTimeout(function () {
    service.send('PAUSE');
}, 1000);
setTimeout(function () {
    service.send('PAUSE');
}, 3000);
// 恢复进场消息
setTimeout(function () {
    service.send('HIDE');
}, 4000);
// 进入房间
setTimeout(function () {
    service.send({
        type: 'JOIN_USER',
        msg: 'David 进入房间'
    });
}, 5000);
// 隐藏进场消息
setTimeout(function () {
    service.send('HIDE');
}, 8000);
// 关闭进场消息
setTimeout(function () {
    service.stop();
}, 9000);
