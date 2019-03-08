import { Machine, interpret, assign, actions } from 'xstate'
const { send, cancel } = actions

const mechine = Machine({
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
      onEntry: send('UNLOCK', {delay: 2000, id: 'keepDisplayTimer'}),
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
      msg: (ctx, event) => {
        return event.msg
      }
    })
  }
})

const service = interpret(mechine)

/*
打印状态转移
onTrasition init { type: 'xstate.init' }
onTrasition keepDisplay { type: 'JOIN_USER', msg: 'David 进入房间' }
onTrasition keepDisplay { type: 'HIDE' }
onTrasition display { type: 'UNLOCK' }
onTrasition hide { type: 'HIDE' }
onTrasition keepDisplay { type: 'JOIN_USER', msg: 'David 进入房间' }
onTrasition display { type: 'UNLOCK' }
onTrasition hide { type: 'HIDE' }
*/
service.onTransition((nextState, event) => {
  console.info('onTrasition', nextState.value, event);
});

// 启动状态
service.start();

// 进入房间
service.send({
  type: 'JOIN_USER',
  msg: 'David 进入房间'
});

// 隐藏进场消息
setTimeout(() => {
  service.send('HIDE');
}, 1000);

setTimeout(() => {
  service.send('HIDE');
}, 3000);

// 进入房间
setTimeout(() => {
  service.send({
    type: 'JOIN_USER',
    msg: 'David 进入房间'
  });
}, 5000);

// 隐藏进场消息
setTimeout(() => {
  service.send('HIDE');
}, 8000);

// 关闭进场消息
setTimeout(() => {
  service.stop();
}, 9000);