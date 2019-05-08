"use strict";

var _xstate = require("xstate");

const config = {
  id: 'test',
  initial: 'init',
  context: {
    count: 0
  },
  states: {
    init: {
      on: {
        ADD: {
          actions: ['add', 'print']
        }
      }
    }
  }
};
const option = {
  actions: {
    add: (0, _xstate.assign)((context, event) => {
      console.info('assign');
      return {
        count: context.count + 1
      };
    }),
    print: () => {
      console.info('print');
    }
  }
};
const M = (0, _xstate.Machine)(config, option);
const s1 = M.transition('init', {
  type: 'ADD'
}, {
  count: 3
});
console.info(s1.value, s1.context.count);
const s2 = M.transition('init', {
  type: 'ADD'
}, {
  count: 8
});
console.info(s2.value, s2.context.count, s2.actions);