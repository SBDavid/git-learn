function test(arg) {
    this.arg = arg;
}

function run() {
    var v1 = new test('v1');

    var timer = setTimeout(function() {
        var tset = v1.arg;
    }, 50000);

    clearTimeout(timer);
}

run();

