function leak(arg) {
    this.arg = arg;
}

function test() {
    var l1= new leak('It is a leak');

    function l() {
        console.info('Here you are!')
        l1.arg = 'Here you are!'
        document.body.removeEventListener('click', l);
    }

    document.body.addEventListener('click', l)
}

test();

