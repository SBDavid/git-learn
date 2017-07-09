var mp = require('./promise.js');

console.info(mp);

var test = new mp.Promise(function(resolve){
    resolve(1)
}).then(function(res){
    console.info(res);
});