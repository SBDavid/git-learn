
// Available variables:
// Machine (machine factory function)
// assign (action)
// XState (all XState exports)

const fetchMachine = Machine({
  id: 'counter',
  initial: 's0',
  states: {
    s0: {
      on: {
        e5: 's5',
        e10: 's10',
      }
    },
    s5: {
      on: {
        e5: 's10',
        e10: 's15',
      }
    },
    s10: {
      on: {
        e5: 's15',
        e10: 's20',
      }
    },
    s15: {
      on: {
        e5: 's20',
        e10: 's25',
      }
    },
    s20: {
      on: {
        e5: 's25',
        e10: {
          actions: 'error'
        }
      }
    },
    s25:{}
  }
}, {
  guards: {
    maxAttempts: ctx =>  ctx.attempts >= 5
  },
  delays: {
    TIMEOUT: 2000
  },
  actions: {
    error: () => {console.info('error')}
  }
});