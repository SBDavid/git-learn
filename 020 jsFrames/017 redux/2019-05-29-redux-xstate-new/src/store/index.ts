import { createStore, applyMiddleware } from 'redux';
import {rootReducer} from './reducers';
import reduxXstate from '../middleware';
import {config, actions} from '../xstate';

const store = createStore(rootReducer, applyMiddleware(reduxXstate({
    toggle: {
        config,
        options: {
            actions
        }
    }
})));

export default store;