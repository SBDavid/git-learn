
let start = []
for (let index = 0; index < 10000; index++) {
    (function (i) {
        start.push(new Date());
        setTimeout(function () {
            console.info((new Date()) - start[i]);
        }, 300);
    })(index)

}
console.info('wan')