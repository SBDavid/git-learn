import Vue from 'vue';
import Vuex from 'vuex'
Vue.use(Vuex);


interface State {
    count: number,
    isReset: boolean
}

interface incrementPayload {
  amount: number
}

let state: State = {
    count: 0,
    isReset: false
}

export const store = new Vuex.Store({
  state: state,
  mutations: {
    increment(state: State, payload: incrementPayload): void {
      state.count += payload.amount;
    }
  },
  getters: {
    count(state: State): string {
      return state.count + ' getter'
    }
  },
  actions: {
    reset({state: State}): boolean {
      setTimeout(function() {
        state.count = 0;
        state.isReset = true;
      }, 3000);
      return true;
    },
    increment({state: State, commit}, payload: incrementPayload): void {
      commit('increment', payload);
    }
  }
})

export const dispatchIncrement = (payload: incrementPayload) => {
  store.dispatch('increment', payload);
}