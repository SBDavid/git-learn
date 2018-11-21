import reducers, { Store } from './reducers';

import { createStore, applyMiddleware, compose } from 'redux';
import { loginAction, userIdAction, messagesAction } from './reducers';
import { sagaAction, rootSaga} from '../sagas';
import createSagaMiddleware from 'redux-saga';

const sagaMiddleWare = createSagaMiddleware();

type storeAction = loginAction|userIdAction|messagesAction|sagaAction;

const composeEnhancer = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore<Store, storeAction, {}, {}>(
    reducers,
    composeEnhancer(applyMiddleware(sagaMiddleWare))
)

sagaMiddleWare.run(rootSaga);

export default store;