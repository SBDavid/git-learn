const ADD = 'ADD';

export interface AddAction {
    type: 'ADD';
    isXstate: true
}

export function add(): AddAction {
    return {
        type: ADD,
        isXstate: true
    }
}

const TOGGLE = 'TOGGLE';

export interface ToggleAction {
    type: 'TOGGLE';
    isXstate: true;
    state: any;
}

export function toggle(state?: any): ToggleAction {
    return {
        type: TOGGLE,
        isXstate: true,
        state
    }
}