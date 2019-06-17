
// Available variables:
// Machine (machine factory function)
// assign (action)
// XState (all XState exports)

const fetchMachine = Machine({
  id: 'lock',
  initial: 'open',
  states: {
    open: {
      on: { CLOSE: 'close'}
    },
    close: {
      type: 'parallel',
      on: {
        OPEN: {
          target: 'open',
          in: {
            close: {
              lock1: 'unlock',
              lock2: 'unlock',
            }
          }
        }
      },
      states: {
        lock1: {
          initial: 'unlock',
          states: {
            locked: {
              on: {
                UNLOCK1: 'unlock'
              }
            },
            unlock: {
              on: {
                LOCK1: 'locked'
              }
            }
          }
        },
        lock2: {
          initial: 'unlock',
          states: {
            locked: {
              on: {
                UNLOCK2: 'unlock'
              }
            },
            unlock: {
              on: {
                LOCK2: 'locked'
              }
            }
          }
        }
      }
    }
  }
}, {});
