
// Available variables:
// Machine (machine factory function)
// assign (action)
// XState (all XState exports)

const loginMachine = {
    initial: 'loading1',
    states: {
        loading1: {
            invoke: {
                src: 'loading'
            },
            on: {
                LOGIN_SUCCESS: {
                    target: 'loading2',
                    actions: 'loginSuccess'
                },
                CANCEL_REQUEST: {
                    target: '#logout'
                }
            }
        },
        loading2: {
            invoke: {
                src: 'loading'
            },
            on: {
                LOGIN_SUCCESS: {
                    target: '#login',
                    actions: 'loginSuccess'
                },
                CANCEL_REQUEST: {
                    target: '#logout'
                }
            }
        }
    }
}

const fetchMachine = Machine({
  initial: 'authLoading',
    context: {
      userToken: ''
    },
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
            id: 'logout',
            on: {
                REQUEST_USER_TOKEN: 'loading'
            }
        },
        loading: loginMachine,
        login: {
            id: 'login',
            on: {
                LOGOUT: {
                    target: 'logout',
                    actions: 'clearUserToken'
                }
            }
        }
    }
}, {
  actions: {
    loginSuccess: () => {
        console.info('loginSuccess')
    }
  },
  services: {
    loading: (context, event) => (callback, onEvent) => {
        const timer = setTimeout(() => {
            callback({
                type: 'LOGIN_SUCCESS',
                userToken: 'this is a token'
            });
        }, 3000);

        return () => {
            clearTimeout(timer);
        }
    }
  }
});