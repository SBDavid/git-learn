import {MachineConfig, assign, ServiceConfig, Sender, Receiver, ActionFunctionMap, MachineOptions} from 'xstate';

export interface Context {
    userToken: string;
}

// 初始上下文数据
export const initialContext: Context = {
    userToken: ''
}

export const initialState = 'authLoading';

// 状态定义
export interface StateSchema {
    states: {
        authLoading: {},
        logout: {},
        loading: {},
        login: {}
    }
}

// 事件定义
interface NoAuth {
    type: 'NO_AUTH'
}

interface HasAuth {
    type: 'HAS_AUTH',
    userToken: string
}

interface LoginSuccess {
    type: 'LOGIN_SUCCESS',
    userToken: string
}

interface Logout {
    type: 'LOGOUT'
}

interface RequestUserToken {
    type: 'REQUEST_USER_TOKEN',
    userName: string
}

interface CancelRequest {
    type: 'CANCEL_REQUEST'
}

export type ApiEvent =
| NoAuth
| HasAuth
| LoginSuccess
| Logout
| RequestUserToken
| CancelRequest

export const config: MachineConfig<Context, StateSchema, ApiEvent> = {
    initial: initialState,
    context: initialContext,
    states: {
        authLoading: {
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
            invoke: {
                src: 'loading'
            },
            on: {
                LOGIN_SUCCESS: {
                    target: 'login',
                    actions: 'saveUserToken'
                },
                CANCEL_REQUEST: {
                    target: 'logout'
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
    cacheUserToken: assign((context, event: HasAuth) => {
        return {
            userToken: event.userToken
        }
    }),
    saveUserToken: assign((context, event: LoginSuccess) => {
        localStorage.setItem('userToken', event.userToken);
        return {
            userToken: event.userToken
        }
    }),
    clearUserToken: assign((context, event: Logout) => {
        localStorage.removeItem('userToken');
        return {
            userToken: ''
        }
    }),
}

const services: Record<string, ServiceConfig<Context>> = {
    loading: (context: Context, event: ApiEvent) => (callback: Sender<ApiEvent>, onEvent: Receiver<ApiEvent>) => {
        const timer = setTimeout(() => {
            callback({
                type: 'LOGIN_SUCCESS',
                userToken: 'user-token'
            });
        }, 3000);

        return () => {
            clearTimeout(timer);
        }
    }
}

export const option: Partial<MachineOptions<Context, ApiEvent>> = {
    actions,
    services
}
