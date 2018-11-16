import reducers, { Store } from './reducers';

import { createStore, applyMiddleware, Action } from 'redux';


const store = createStore<Store, Action<any>, {}, {}>(
    reducers,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
    //applyMiddleware(sagaMiddleWare)
)

export default store;