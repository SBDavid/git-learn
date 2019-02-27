"use strict";

var _xstate = require("xstate");

const lightMechine = (0, _xstate.Machine)({
  id: 'light',
  initial: 'red',
  states: {
    red: {
      activities: ['redActivity'],
      on: {
        TIMER: {
          target: 'green',
          actions: [_xstate.actions.send('TIMER', {
            delay: 1000
          })]
        }
      }
    },
    green: {
      activities: ['greenActivity'],
      on: {
        TIMER: {
          target: 'yellow',
          actions: ['TurnOnYellow']
        }
      }
    },
    yellow: {
      on: {
        TIMER: {
          target: 'red'
        }
      }
    }
  }
}, {
  actions: {
    TurnOnYellow: () => {
      console.info('TurnOnYellow');
    }
  },
  activities: {
    redActivity: () => {
      function stopRedActivity() {}

      return stopRedActivity;
    },
    greenActivity: () => {
      console.info('greenActivity');

      function stopGreenActivity() {}

      return stopGreenActivity;
    }
  }
});
const service = (0, _xstate.interpret)(lightMechine);
service.start();
service.send({
  type: 'TIMER'
});