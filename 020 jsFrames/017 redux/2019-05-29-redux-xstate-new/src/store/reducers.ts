import { combineReducers } from 'redux'
import {UpdateTitleAction, TitleState, UpdateTitle, ToggleState, ToggleXstateAction} from './actions';

const initialTitelState: TitleState = 'SwitchCount';

function title(state = initialTitelState, action: UpdateTitleAction): TitleState {
    if (action.type === UpdateTitle) {
        return action.title;
    } else {
        return state;
    }
}

// xstate中的reducer

const initialToggleState: ToggleState = {
    value: 'done',
    context: {
        count: 0
    }
};

function toggle(state = initialToggleState, action: ToggleXstateAction): ToggleState {
    if (action.type === '$$UpdateStateMachinetoggle') {
        return {
            value: action.value,
            context: action.context
        };
    } else {
        return state;
    }
}

export const rootReducer = combineReducers({
    title,
    toggle
});

export type AppState = ReturnType<typeof rootReducer>