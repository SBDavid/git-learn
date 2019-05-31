export type TitleState = string;

export const UpdateTitle = 'UpdateTitle';

export interface UpdateTitleAction {
    type: typeof UpdateTitle
    title: TitleState;
}

export function updateTitle(title: TitleState): UpdateTitleAction {
    return {
        type: UpdateTitle,
        title
    }
}

// xstate中的action
export interface ToggleState {
    value: string;
    context: {
        count: number;
    }
};

export const Toggle = 'TOGGLE';

export interface ToggleAction {
    type: typeof Toggle;
    machineName: 'toggle'
}

export interface ToggleXstateAction {
    type: '$$UpdateStateMachinetoggle';
    value: string;
    context: {
        count: number;
    }
}

export function toggle(): ToggleAction {
    return {
        type: Toggle,
        machineName: 'toggle'
    }
}

// xstate中的action 不使用中间件

export const ToggleNoMi = 'TOGGLENOMI';

export interface ToggleXstateNoMiAction {
    type: '$$UpdateStateMachineToggleNoMi';
    value: string;
    context: {
        count: number;
    }
}

export function toggleNoMi(value: string, context: {count: number}): ToggleXstateNoMiAction {
    return {
        type: '$$UpdateStateMachineToggleNoMi',
        value,
        context
    }
}