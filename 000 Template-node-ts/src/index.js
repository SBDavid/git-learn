import { Machine, interpret, assign } from 'xstate';

const BufferTastMechine = Machine({
  id: 'bufferTask',
  initial: 'idle',
  states: {
    idle: {
      on: {
        PUSH_TASK: {
          target: 'running', actions: 'pushTask'
        },
        PAUSE: {
          target: 'paused'
        },
      }
    },
    running: {
      on: {
        PAUSE: {
          target: 'paused'
        },
        PUSH_TASK: {
          internal: true, actions: 'pushTask'
        },
        CLEAR_TASKS: {
          target: 'idle', actions: 'clearTasks'
        },
        RESET: {
          target: 'idle', actions: 'reset'
        }
      },
      invoke: {
        id: 'popping',
        src: (ctx, event) => (callback, onEvent) => {

          let timer = null

          const processTask = () =>  {
            if (ctx.tasks.length > 0) {
              const task = ctx.tasks.shift()
              console.info('invoke popping', task)
              ctx.callback(...task)
              timer = setTimeout(() => {
                processTask()
              }, ctx.timeout)
            } else {
              callback('RESET')
            }
          }
    
          processTask()

          return () => {
            console.info('exit popping')
            clearTimeout(timer)
          }
        }
      }
    },
    paused: {
      on: {
        RESUME: {
          target: 'running'
        },
        PUSH_TASK: {
          internal: true, actions: 'pushTask'
        },
        CLEAR_TASKS: {
          internal: true, actions: 'clearTasks'
        },
        RESET: {
          target: 'idle', actions: 'reset'
        }
      }
    },
  }
}, {
  actions: {
    pushTask: (ctx, event) => {
      ctx.tasks.push(event.task)
    },
    reset: (ctx, event) => {
      ctx.tasks.splice(0, ctx.tasks.length)
    },
    clearTasks: assign({tasks: []})
  }
})

export default class BufferTask {

  constructor (callback = () => {}, timeout = 200, taskName = 'defalutTask') {
    this.taskName = taskName
    this.timeout = timeout
    this.tasks = []
    this.timer = null
    this.paused = false
    this.callback = callback

    this.pushTask = this.pushTask.bind(this)
    this.pause = this.pause.bind(this)
    this.resume = this.resume.bind(this)
    this.cleanTasks = this.cleanTasks.bind(this)

    this.machine = interpret(BufferTastMechine.withContext({
      taskName,
      timeout,
      tasks: [],
      timer: null,
      callback
    }))

    this.machine.onTransition((state, event) => {
      console.info('onTransition', state.value, event.type)
    })

    this.machine.start()
  }

  pause () {
    this.machine.send({
      type: 'PAUSE'
    })
  }

  resume () {
    this.machine.send({
      type: 'RESUME'
    })
  }

  cleanTasks () {
    this.machine.send({
      type: 'CLEAR_TASKS'
    })
  }

  pushTask (...args) {
    this.machine.send({
      type: 'PUSH_TASK',
      task: args
    })
  }
}
console.info('start')
const test = new BufferTask((arg, arg2) => {
  console.info('fire', arg, arg2)
}, 2000);

test.pushTask(1, 2);
test.pushTask(2, 2);
test.pushTask(3, 2);

setTimeout(() => {
  // test.pause()
  test.cleanTasks();
}, 2100)

setTimeout(() => {
  //test.resume()
}, 3100)

console.info('end')