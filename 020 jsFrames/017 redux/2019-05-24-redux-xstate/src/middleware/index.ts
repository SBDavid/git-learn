import { interpret, Machine } from 'xstate';

export default (machineConfig: any) => {

    const machine = Machine(machineConfig);
    const interpreter = interpret(machine);
    interpreter.start();

    return (store: any) => (next: any) => {

        interpreter.onTransition((state, event) => {
            next({
                type: event.type,
                state: state.value,
                isXstate: true
            })
        });

        return (action: any) => {

            if (action.isXstate) {
                console.info('yes')
                interpreter.send(action.type);
            } else {
                let result = next(action)
            }
            
            console.log('next state', action, store.getState())
            return;
        }
    }
}