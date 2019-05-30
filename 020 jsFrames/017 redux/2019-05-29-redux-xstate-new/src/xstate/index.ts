import {MachineConfig, assign, Sender, Receiver} from 'xstate';

interface Context {
    count: number;
}

const initialContext: Context = {
    count: 0
}

interface State {
    states: {
        done: {},
        loading: {}
    }
}

type ApiEvent =
| {type: 'TOGGLE'}
| {type: 'DONE'}

const loadingService = (context: Context, event: ApiEvent) => (callback: Sender<ApiEvent>, onEvent: Receiver<ApiEvent>) => {
    const timer = setTimeout(() => {
        callback('DONE')
    }, 1000);

    return () => {
        clearTimeout(timer);
    }
}

export const config: MachineConfig<Context, State, ApiEvent> = {
    initial: 'done',
    context: initialContext,
    states: {
        done: {
            on: {
                TOGGLE: 'loading'
            }
        },
        loading: {
            invoke: {
                src: loadingService
            },
            on: {
                DONE: {
                    target: 'done',
                    actions: ['count']
                }
            }
        }
    }
}

export const actions = {
    count: assign<Context>((context) => {
        return {
            count: context.count + 1
        }
    })
}