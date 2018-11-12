import { render } from 'react-dom';
import * as React from 'react';
import App from './app';
import reducers from './reducers';

import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import sagas from './sagas';

const sagaMiddleWare = createSagaMiddleware();
const store = createStore(
    reducers,
    applyMiddleware(sagaMiddleWare)
)

sagaMiddleWare.run(sagas);

window.onload = function () {
    render(
        <App />,
        document.getElementById('root'),
    );
}