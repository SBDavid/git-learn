
// Available variables:
// Machine (machine factory function)
// XState (all XState exports)



const mechine = Machine({
    id: 'userJoin',
    initial: 'init',
    context: {
      msg: null
    },
    states: {
      init: {
        onEntry: XState.actions.cancel('keepDisplayTimer'),
        on: {
          JOIN_USER: {
            target: 'keepDisplay',
            actions: ['SET_MSG']
          }
        }
      },
      keepDisplay: {
        onEntry: XState.actions.send('UNLOCK', {delay: 2000, id: 'keepDisplayTimer'}),
        onExit: XState.actions.cancel('keepDisplayTimer'),
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
      SET_MSG: XState.actions.assign({
        msg: (ctx, event) => {
          return event.msg
        }
      })
    }
  });