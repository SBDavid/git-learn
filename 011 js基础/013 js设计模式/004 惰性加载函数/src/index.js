var lazy = require('./lazyFun');

lazyFun = new lazy();

lazyFun.addEvent(window, 'load', function(){
    console.info('window.load');
})

lazyFun.addEvent(window, 'load', function(){
    console.info('window.load')
})