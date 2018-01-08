import Vue from 'vue';
import Vuex from 'vuex'
Vue.use(Vuex);

interface State {
  count: number;
}

interface resetPayload {
  count: number;
}

interface incrementPayload {
  amount: number;
}

let state: State = {
  count: 0
}

export const store = new Vuex.Store({
  state: state,
  mutations: {
    increment(state: State, payload: incrementPayload):void {
      state.count += payload.amount;
    }
  },
  getters: {
    count(state: State): string  {
      return state.count + ' getter'
    }
  },
  actions: {
    reset({state: State}, payload: resetPayload): void {
      setTimeout(function() {
        state.count = payload.count;
      }, 3000)
    }
  }
})

export function dispatchReset(payload: resetPayload):void {
  store.dispatch('reset', payload);
}

export function commitIncement(payload: incrementPayload): void {

  store.commit('increment', payload);
}

