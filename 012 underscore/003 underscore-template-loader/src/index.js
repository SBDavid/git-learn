var _ = require('underscore');

var hello = require('./temps/hello.htm');
var compiledTemps = {
    hello: hello
}

window.onload = function() {
    document.body.innerHTML += compiledTemps.hello({name: "world"})
}
