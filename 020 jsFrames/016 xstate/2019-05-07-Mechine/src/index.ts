import { Machine, assign, MachineConfig, StateSchema, EventObject, MachineOptions } from 'xstate';

interface Context {
  count: number;
}

interface Schema extends StateSchema {
  states: {
    init: {
    }
  }
}

interface Event extends EventObject {
  type: 'ADD'
}

const config: MachineConfig<Context, Schema, Event> = {
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
}

const option: Partial<MachineOptions<Context, Event>> = {
  actions: {
    add: assign((context, event ) => {
      console.info('assign');
      return ({
          count: context.count + 1
      });
    }),
    print: () => {
      console.info('print');
    }
  }
}

const M = Machine(config, option);

const s1 = M.transition('init', {type: 'ADD'}, {count: 3});

console.info(s1.value, s1.context.count);

const s2 = M.transition('init', {type: 'ADD'}, {count: 8});

console.info(s2.value, s2.context.count, s2.actions);

