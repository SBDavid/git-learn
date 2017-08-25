/* setTimeout(function(){
    var test = aaa;
},100);
var test = aaa;
setTimeout(function(){
    
    setTimeout(function(){
        console.info('success')
    },100);

},200); */

function err(i) {
    console.info(i)
    var test = aaa;
}
setTimeout(function(){
    err(1);
},0);

setTimeout(function(){
    err(2);
},0);

setTimeout(function(){
    err(3);
},0);