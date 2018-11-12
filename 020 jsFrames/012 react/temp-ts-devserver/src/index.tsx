import { render } from 'react-dom';
import * as React from 'react';
import App from './app';

window.onload = function () {
    render(
        <App />,
        document.getElementById('root'),
    );
}