
var localVar = 'localVar';

global.globalVar = 'globalVar';

// console.info('moduleA before exports', module);

module.exports.localVar = localVar;

/* console.info('moduleA after exports', module); */