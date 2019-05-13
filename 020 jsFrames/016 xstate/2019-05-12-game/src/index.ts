import { Machine, MachineConfig, StateSchema, MachineOptions, interpret,  } from 'xstate';

interface Player {
  userId: number;
  score: number;
  netState: 'OK'|'EX'|'LEAVE';
  isReady: boolean;
}

interface Context {
  players: Map<string, Player>;
}

interface Schema extends StateSchema {
  states: {
    phaseOne: {
    }
  }
}

type ApiEvent =
  | { type: 'JOIN' }
  | { type: 'LEAVE' }
  | { type: 'READY' }

const config: MachineConfig<Context, Schema, ApiEvent> = {
  id: 'gs',
  initial: 'phaseOne',
  context: {
    players: new Map<string, Player>()
  },
  on: {
    JOIN: {
    }
  },
  states: {
    phaseOne: {
      context: {
        players: new Map()
      },
      on: {
        JOIN: {},
        LEAVE: {},
        READY: {}
      }
    }
  }
}

const option: Partial<MachineOptions<Context, ApiEvent>> = {
  actions: {
  }
}

const M = Machine(config, option);
const interpreter = interpret(M).onTransition((state, event) => {
  if (state.history) {
      console.log('xstate', state.history.value, event.type, state.value);
  } else {
      console.log('xstate', event.type, state.value);
  }
});

interpreter.start();
interpreter.send('JOIN');

