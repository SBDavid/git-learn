var moduleA = require('./moduleA.js');

/* console.info(moduleA);
console.info(globalVar); */ 

/* var moduleB = require('./moduleB.js');

console.info(moduleB);

console.info(require.main === module); */

var moduleC = require('./moduleC.js');

console.info(moduleC.counter);
moduleC.incCounter();
console.info(moduleC.counter);