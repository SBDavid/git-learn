import { render } from 'react-dom';
import * as React from 'react';
import App from './page/app';
import { Provider } from 'react-redux';
import store from './store';

window.onload = function () {
    render(
        <Provider store={store}>
            <App tempDispatch={ store.dispatch }/>
        </Provider>,
        document.getElementById('root'),
    );
}