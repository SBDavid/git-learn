import Vue from 'vue';
import Vuex from 'vuex'
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++
    }
  },
  getters: {
    count: state => {
      return state.count + ' getter'
    }
  },
  actions: {
    reset: ({state}) => {
      setTimeout(function() {
        state.count = 0;
      }, 3000)
    }
  }
})

export default store;