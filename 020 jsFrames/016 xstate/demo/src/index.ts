import { Machine, actions, interpret } from 'xstate';

const lightMechine = Machine({
  id: 'light',
  initial: 'red',
  states: {
    red: {
      activities: ['redActivity'],
      on: {
        TIMER: {
          target: 'green',
          actions: [actions.send('TIMER', {
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
      console.info('TurnOnYellow')
    }
  },
  activities: {
    redActivity: () => {
      function stopRedActivity() {

      }
      return stopRedActivity;
    },
    greenActivity: () => {
      console.info('greenActivity');
      function stopGreenActivity() {

      }
      return stopGreenActivity;
    }
  }
});

const service = interpret(lightMechine);

service.start();

service.send({
  type: 'TIMER'
});

