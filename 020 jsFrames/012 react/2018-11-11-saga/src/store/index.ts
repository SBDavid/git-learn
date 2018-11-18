import reducers, { Store } from './reducers';

import { createStore, applyMiddleware, Action } from 'redux';
import { loginAction, userIdAction, messagesAction } from './reducers';

const store = createStore<Store, loginAction|userIdAction|messagesAction, {}, {}>(
    reducers,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
    //applyMiddleware(sagaMiddleWare)
)

export default store;