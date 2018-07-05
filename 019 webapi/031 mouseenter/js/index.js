window.onload = function() {
    var outter = document.getElementById('outter');
    var inner = document.createElement('div');
    inner.className = 'inner'

    outter.addEventListener('click', function() {
        console.info('outter click');
    });

    inner.addEventListener('click', function() {
        console.info('inner click');
    });


    setTimeout(function(){
        console.info('setTimeout');
    })

    new Promise(function(resolve) {
        resolve('resolve');
    }).then(res => {
        console.info(res);
    })
    
    outter.appendChild(inner);

    inner.click();
    console.info('end')
}