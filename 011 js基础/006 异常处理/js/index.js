


var f = function() {
    var tang = 1;
}

var f1 = function() {
    var tang = test;
}

var p = new Promise(function(resolve){
    f();
    resolve(1);
});

p.then(function(res){
    f1();
    console.info(res)
}).catch(function(error){
    console.log(error);
})