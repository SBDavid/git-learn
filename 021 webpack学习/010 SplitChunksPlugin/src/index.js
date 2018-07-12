import(/* webpackChunkName: "module1" */ './module1').then(m => {
    m.default();
    console.info('index module1');
});

import m2 from './module2';

m2();

console.info('index is loaded');