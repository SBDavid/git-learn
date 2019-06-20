
// Available variables:
// Machine (machine factory function)
// assign (action)
// XState (all XState exports)

const loginMachine = Machine({
    id: '登陆',
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
            on: {
                '点击登录按钮': '登录中'
            }
        },
        '登录中': {
            on: {
                '登录成功': {
                    target: '已登录',
                    actions: '保存token'
                },
                '取消登录': {
                    target: '未登录'
                }
            }
        },
        '已登录': {
            on: {
                '注销': {
                    target: '未登录',
                    actions: '清除token'
                }
            }
        }
    }
  }, {
    actions: {
      '保存token': () => {
        alert('保存token')
      },
      '清除token': () => {
        alert('清除token')
      }
    }
  });