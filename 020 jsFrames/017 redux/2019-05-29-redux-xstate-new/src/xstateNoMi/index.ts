import { interpret, Machine} from 'xstate';
import {actions, config, Context, ApiEvent} from '../xstate';
import store from '../store';
import {toggleNoMi} from '../store/actions';

const machine = Machine<Context, any, ApiEvent>(config, {actions});

const _interpreter = interpret(machine);

_interpreter.start();

_interpreter.onTransition((state, event) => {
    store.dispatch(toggleNoMi(state.value as string, state.context));
});

export default _interpreter;