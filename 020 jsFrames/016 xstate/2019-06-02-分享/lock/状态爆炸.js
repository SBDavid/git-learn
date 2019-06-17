
// Available variables:
// Machine (machine factory function)
// assign (action)
// XState (all XState exports)

const fetchMachine = Machine({
  id: 'lock',
  initial: 'open',
  states: {
    open: {
      on: { CLOSE: 'l1f_l2f'}
    },
    l1f_l2f: {
      on: {
        UL1: 'l1t_l2f',
        UL2: 'l1f_l2t',
        OPEN: 'open'
      }
    },
    l1t_l2f: {
      on: {
        L1: 'l1f_l2f',
        UL2: 'l1t_l2t',
      }
    },
    l1f_l2t: {
      on: {
        UL1: 'l1t_l2t',
        L2: 'l1f_l2f',
      }
    },
    l1t_l2t: {
      on: {
        L1: 'l1f_l2t',
        L2: 'l1t_l2f'
      }
    }
  }
}, {});
