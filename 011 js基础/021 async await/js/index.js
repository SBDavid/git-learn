async function test(params) {
    console.info(11);
    setTimeout(function(){
        console.info('timeout')
    }, 0);
    return true;
}
 function pro() {
    return new Promise(function(resolve, reject) {
        resolve(1);
    })
}

async function a() {
    var res = await test();
    console.info(res);
    if (true) {
        var r = await pro();
        console.info(r);
    }
    
}

a();