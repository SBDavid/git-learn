console.info('this is index.js');

import('./modA').then(({default: print}) => {
    print();
});