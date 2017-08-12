window.onload = function() {
    console.log('test')
    var box = document.getElementById('box');
    console.time('testForEach');
    for(let count = 0; count < 1000; count++) {
        console.log('test')
        setTimeout(function(){
            box.style.transform = 'translateX('+ count +'px)'
        },count * 17);
    }
    console.timeEnd('testForEach');
}