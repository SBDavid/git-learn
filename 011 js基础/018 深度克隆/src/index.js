var CircularJSON = require('circular-json-es6')

var obj = {a: {b: {}}, b:1};

obj.a.b.c = obj;

console.info(CircularJSON.stringify(obj));