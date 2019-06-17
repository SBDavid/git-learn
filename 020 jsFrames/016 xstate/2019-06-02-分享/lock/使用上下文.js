
// Available variables:
// Machine (machine factory function)
// assign (action)
// XState (all XState exports)

const fetchMachine = Machine({
  id: 'lock',
  initial: 'open',
  context: {
    lock1: false,
    lock2: false
  },
  states: {
    open: {
      on: { CLOSE: 'close'}
    },
    close: {
      on: {
        OPEN: {
          target: 'open',
          cond: 'bothUnlock'
        },
        UNLOCK1: {
          actions: assign((context) => {return {lock1: false}})
        },
        UNLOCK2: {
          actions: assign((context) => {return {lock2: false}})
        },
        LOCK1: {
          actions: assign((context) => {return {lock1: true}})
        },
        LOCK2: {
          actions: assign((context) => {return {lock2: true}})
        }
      }
    }
  }
}, {
  guards: {
    bothUnlock: (context) => {
      return !context.lock1 && !context.lock2
    }
  }
});
