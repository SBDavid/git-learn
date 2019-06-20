
// Available variables:
// Machine (machine factory function)
// assign (action)
// XState (all XState exports)

const fetchMachine = Machine({
    initial: '查找本地Token中',
    context: {
        userToken: ''
    },
    states: {
        '查找本地Token中': {
            on: {
                '本地没有找到Tokan': '未登录',
                '从本地查找到Tokan': '已登录'
            }
        },
        '未登录': {
            id: 'logout',
            on: {
                '点击登录按钮': '登录中'
            }
        },
        '登录中': {
            initial: '第一阶段登陆',
            on: {
                '接口返回500': '错误'
            },
            states: {
                '第一阶段登陆': {
                    invoke: {
                        src: '登录服务'
                    },
                    on: {
                        '登陆成功': {
                            target: '第二阶段登陆',
                            actions: '显示第一阶段成功'
                        },
                        '取消登录': {
                            target: '#logout'
                        }
                    }
                },
                '第二阶段登陆': {
                    invoke: {
                        src: '登录服务'
                    },
                    on: {
                        '登陆成功': {
                            target: '#login',
                            actions: '显示第二阶段成功'
                        },
                        '取消登录': {
                            target: '#logout'
                        }
                    }
                }
            }
        },
        '已登录': {
            id: 'login',
            on: {
                '注销': {
                    target: '未登录',
                    actions: '清除token'
                }
            }
        },
        '错误': {}
    }
}, {
        actions: {
            '保存token': () => {
                alert('保存token')
            },
            '清除token': () => {
                alert('清除token')
            },
            '显示第一阶段成功': () => {
              alert('第一阶段成功')
            },
            '显示第二阶段成功': () => {
              alert('第二阶段成功')
            }
        },
        services: {
            '登录服务': (context, event) => (callback, onEvent) => {
                const timer = setTimeout(() => {
                    callback({
                        type: '登陆成功',
                    });
                }, 2000);

                return () => {
                    clearTimeout(timer);
                }
            }
        }
    });
