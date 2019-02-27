import { createStore } from 'redux';

interface TodoAction {
    text: string;
    type: string;
}

function todos(state = [], action: TodoAction) {
    switch (action.type) {
      case 'ADD_TODO':
        return [
          ...state,
          {
            id: 0,
            text: action.text
          }
        ]
      default:
        return state
    }
  }

const store = createStore(todos);

console.info(store.getState())

store.dispatch({
    type: 'ADD_TODO',
    text: 'tang'
})

console.info(store.getState())

let neartDispatch = false;
// subscribe
function subscribeA () {
    console.info('subcreibeA', store.getState())
    if (!neartDispatch) {
        neartDispatch = true;
        store.dispatch({
            type: 'ADD_TODO',
            text: 'wei'
        })
    }
}
store.subscribe(subscribeA);
store.dispatch({
    type: 'ADD_TODO',
    text: 'jia'
})