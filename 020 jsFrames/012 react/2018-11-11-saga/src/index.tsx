import { render } from 'react-dom';
import * as React from 'react';
import App from './page/app';
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga';
import sagas from './sagas';
import store from './store';
const sagaMiddleWare = createSagaMiddleware();

// sagaMiddleWare.run(sagas);

window.onload = function () {
    render(
        <Provider store={store}>
            <App tempDispatch={ store.dispatch }/>
        </Provider>,
        document.getElementById('root'),
    );
}