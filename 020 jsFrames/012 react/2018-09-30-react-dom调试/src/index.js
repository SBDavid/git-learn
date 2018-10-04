import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';


window.onload = function () {
    ReactDOM.render(
        <App />,
        document.getElementById('root')
    );
}