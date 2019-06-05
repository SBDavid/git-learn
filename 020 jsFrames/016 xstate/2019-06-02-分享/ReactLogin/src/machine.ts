import {MachineConfig, assign, Sender, Receiver, ActionFunctionMap, MachineOptions} from 'xstate';

export interface Context {
    userToken: string;
}

// 初始上下文数据
export const initialContext: Context = {
    userToken: ''
}

// 状态定义
export interface State {
    states: {
        autoLoading: {},
        logout: {},
        loading: {},
        login: {}
    }
}

// 事件定义
interface NoAuto {
    type: 'NO_AUTH'
}

interface HasAuto {
    type: 'HAS_AUTH',
    userToken: string
}

interface Login {
    type: 'LOGIN',
    userToken: string
}

interface Logout {
    type: 'LOGOUT',
    userToken: string
}

interface RequestUserToken {
    type: 'REQUEST_USER_TOKEN',
    userToken: string
}

export type ApiEvent =
| NoAuto
| HasAuto
| Login
| Logout
| RequestUserToken

export const config: MachineConfig<Context, State, ApiEvent> = {
    initial: 'autoLoading',
    context: initialContext,
    states: {
        autoLoading: {
            on: {
                NO_AUTH: 'logout',
                HAS_AUTH: {
                    target: 'login',
                    actions: 'cacheUserToken'
                }
            }
        },
        logout: {
            on: {
                REQUEST_USER_TOKEN: 'loading'
            }
        },
        loading: {
            on: {
                LOGIN: {
                    target: 'login',
                    actions: 'saveUserToken'
                }
            }
        },
        login: {
            on: {
                LOGOUT: {
                    target: 'logout',
                    actions: 'clearUserToken'
                }
            }
        }
    }
}

const actions: ActionFunctionMap<Context, ApiEvent> = {
    cacheUserToken: assign((context, event: HasAuto) => {
        return {
            userToken: event.userToken
        }
    }),
    saveUserToken: assign((context, event: Login) => {
        // localStorage
        return {
            userToken: event.userToken
        }
    }),
    clearUserToken: assign((context, event: Logout) => {
        // localStorage
        return {
            userToken: ''
        }
    }),
}

export const option: Partial<MachineOptions<Context, ApiEvent>> = {
    actions
}
