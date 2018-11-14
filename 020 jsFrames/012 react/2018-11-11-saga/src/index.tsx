import { render } from 'react-dom';
import * as React from 'react';
import App from './page/app';
import reducers from './store/reducers';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import sagas from './sagas';

const sagaMiddleWare = createSagaMiddleware();
const store = createStore(
    reducers,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
    //applyMiddleware(sagaMiddleWare)
)

// sagaMiddleWare.run(sagas);

window.onload = function () {
    render(
        <Provider store={store}>
            <App tempDispatch={ store.dispatch }/>
        </Provider>,
        document.getElementById('root'),
    );
}