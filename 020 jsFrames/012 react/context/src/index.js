import React from 'react';
import ReactDOM from 'react-dom';
import AppDyamicContext from './dynamicContext/app';
import AppComplexContext from './complexContext/app';


window.onload = function () {
    ReactDOM.render(
        <AppComplexContext />,
        document.getElementById('root')
    );
}