var esprima = require('esprima');

var r = esprima.parseScript('answer = 42');

console.log(r);