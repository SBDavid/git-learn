"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var xstate_1 = require("xstate");
var config = {
    id: 'gs',
    initial: 'phaseOne',
    context: {
        players: new Map()
    },
    on: {
        JOIN: {}
    },
    states: {
        phaseOne: {
            context: {
                players: new Map()
            },
            on: {
                JOIN: {},
                LEAVE: {},
                READY: {}
            }
        }
    }
};
var option = {
    actions: {}
};
var M = xstate_1.Machine(config, option);
var interpreter = xstate_1.interpret(M).onTransition(function (state, event) {
    if (state.history) {
        console.log('xstate', state.history.value, event.type, state.value);
    }
    else {
        console.log('xstate', event.type, state.value);
    }
});
interpreter.start();
interpreter.send('JOIN');
