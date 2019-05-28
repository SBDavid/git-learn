import {AddAction, ToggleAction} from './actions';
import { combineReducers } from 'redux'

const initState = {
    num: 0
};

export function add(state = initState, action: AddAction) {
    if (action.type === 'ADD') {
        return {
            num: state.num + 1
        }
    } else {
        return state;
    }
}

export function switcher(state = 'off', action: ToggleAction) {
    if (action.type === 'TOGGLE' && action.isXstate) {
        return action.state;
    } else {
        return 'off'
    }
}



export default combineReducers({
    add,
    switcher
});