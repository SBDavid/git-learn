import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import App2 from './app2';


window.onload = function () {
    ReactDOM.render(
        <App />,
        document.getElementById('root')
    );
}