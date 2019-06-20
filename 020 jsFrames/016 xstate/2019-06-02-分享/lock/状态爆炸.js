
// Available variables:
// Machine (machine factory function)
// assign (action)
// XState (all XState exports)

const fetchMachine = Machine({
  id: 'lock',
  initial: '开启',
  states: {
    '开启': {
      on: { '关闭宝箱': '解锁_解锁'}
    },
    '解锁_解锁': {
      on: {
        '左边上锁': '锁定_解锁',
        '右边上锁': '解锁_锁定',
        '打开宝箱': '开启'
      }
    },
    '锁定_锁定': {
      on: {
        '左边开锁': '解锁_锁定',
        '右边开锁': '锁定_解锁'
      }
    },
    '解锁_锁定': {
      on: {
        '左边上锁': '锁定_锁定',
        '右边开锁': '解锁_解锁'
      }
    },
    '锁定_解锁': {
      on: {
        '左边开锁': '解锁_解锁',
        '右边上锁': '锁定_锁定',
      }
    }
  }
}, {});
