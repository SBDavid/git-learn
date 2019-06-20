
// Available variables:
// Machine (machine factory function)
// assign (action)
// XState (all XState exports)

const config = {
  id: '投币机',
  initial: '收集到0元',
  states: {
    '收集到0元': {
      on: {
        '投入5元': '收集到5元',
        '投入10元': '收集到10元',
      }
    },
    '收集到5元': {
      on: {
        '投入5元': '收集到10元',
        '投入10元': '收集到15元',
      }
    },
    '收集到10元': {
      on: {
        '投入5元': '收集到15元',
        '投入10元': '收集到20元',
      }
    },
    '收集到15元': {
      on: {
        '投入5元': '收集到20元',
        '投入10元': '收集到25元',
      }
    },
    '收集到20元': {
      on: {
        '投入5元': '收集到25元',
        '投入10元': {
          actions: '错误'
        }
      }
    },
    '收集到25元':{
      onEntry: '完成',
      on: {
        '重置': '收集到0元'
      }
    }
  }
};

const actions = {
    '错误': () => {alert('错误')},
    '完成': () => {alert('完成')}
}


const fetchMachine = Machine(config, {
  actions: actions
});