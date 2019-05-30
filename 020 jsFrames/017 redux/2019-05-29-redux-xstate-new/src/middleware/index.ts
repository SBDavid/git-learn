import { interpret, Machine, DefaultContext, MachineOptions, EventObject, Interpreter, MachineConfig} from 'xstate';

interface MachineConfigs{
    [x: string]: {
        config: MachineConfig<DefaultContext, any, EventObject>,
        options: Partial<MachineOptions<DefaultContext, EventObject>>
    }
}

interface Action{
    type: string;
    machineName?: string;
}

export default (machineConfig: MachineConfigs) => {

    const interpreters = new Map<string, Interpreter<DefaultContext>>();

    Object.keys(machineConfig).forEach((key) => {
        const machine = Machine(machineConfig[key].config, machineConfig[key].options);
        const interpreter = interpret(machine);
        // 保存状态机
        interpreters.set(key, interpreter);
        // 启动
        interpreter.start();
    });

    return (store: any) => (next: any) => {
        interpreters.forEach((val, key) => {
            val.onTransition((state, event) => {
                next({
                    type: `$$UpdateStateMachine${key}`,
                    value: state.value,
                    context: state.context
                })
            })
        });

        return (action: Action) => {
            if (action.machineName && interpreters.has(action.machineName)) {
                console.info('接收到一个 状态机action');
                const interpreter = interpreters.get(action.machineName) as Interpreter<DefaultContext>;

                interpreter.send(action);
            } else {
                console.info('接收到一个 普通的action');
                return next(action)
            }
        }
    }
}