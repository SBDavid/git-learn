
// Available variables:
// Machine (machine factory function)
// assign (action)
// XState (all XState exports)

const fetchMachine = Machine({
  id: 'lock',
  initial: '打开',
  states: {
    '打开': {
      on: { '关闭宝箱': '关闭'}
    },
    '关闭': {
      type: 'parallel',
      on: {
        '打开宝箱': {
          target: '打开',
          in: {
            '关闭': {
              '左边的锁': '解锁',
              '右边的锁': '解锁'
            }
          }
        }
      },
      states: {
        '左边的锁': {
          initial: '解锁',
          states: {
            '锁定': {
              on: {
                '左边解锁': '解锁'
              }
            },
            '解锁': {
              on: {
                '左边上锁': '锁定'
              }
            }
          }
        },
        '右边的锁': {
          initial: '解锁',
          states: {
            '锁定': {
              on: {
                '右边解锁': '解锁'
              }
            },
            '解锁': {
              on: {
                '右边上锁': '锁定'
              }
            }
          }
        },
      }
    }
  }
}, {});
