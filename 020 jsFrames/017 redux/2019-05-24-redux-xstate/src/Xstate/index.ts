import {MachineConfig} from 'xstate';

interface Context {

}

interface State {
    states: {
        on: {},
        off: {}
    }
}

type ApiEvent =
| {type: 'TOGGLE'}

const config: MachineConfig<Context, State, ApiEvent> = {
    initial: 'off',
    states: {
        on: {
            on: {
                TOGGLE: 'off'
            }
        },
        off: {
            on: {
                TOGGLE: 'on'
            }
        }
    }
}

export default config;