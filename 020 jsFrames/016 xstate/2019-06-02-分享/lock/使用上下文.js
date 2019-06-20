
// Available variables:
// Machine (machine factory function)
// assign (action)
// XState (all XState exports)

const fetchMachine = Machine({
  id: 'lock',
  initial: '开启',
  context: {
    lock1: false,
    lock2: false
  },
  states: {
    '开启': {
      on: { '关闭宝箱': '关闭'}
    },
    '关闭': {
      on: {
        '打开宝箱': {
          target: '开启',
          cond: '两个锁都处于锁定状态'
        },
        '左边解锁': {
          actions: assign((context) => {return {lock1: false}})
        },
        '右边解锁': {
          actions: assign((context) => {return {lock2: false}})
        },
        '左边上锁': {
          actions: assign((context) => {return {lock1: true}})
        },
        '右边上锁': {
          actions: assign((context) => {return {lock2: true}})
        }
      }
    }
  }
}, {
  guards: {
    '两个锁都处于锁定状态': (context) => {
      return !context.lock1 && !context.lock2
    }
  }
});
