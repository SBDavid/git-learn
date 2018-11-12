"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_dom_1 = require("react-dom");
var React = require("react");
var app_1 = require("./app");
var reducers_1 = require("./reducers");
var redux_1 = require("redux");
var redux_saga_1 = require("redux-saga");
var sagas_1 = require("./sagas");
var sagaMiddleWare = redux_saga_1.default();
var store = redux_1.createStore(reducers_1.default, redux_1.applyMiddleware(sagaMiddleWare));
sagaMiddleWare.run(sagas_1.default);
window.onload = function () {
    react_dom_1.render(React.createElement(app_1.default, null), document.getElementById('root'));
};
//# sourceMappingURL=index.js.map