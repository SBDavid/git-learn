/* window.onload = function () {

    var worker = new SharedWorker('worker.js');

    worker.port.onmessage = function (e) {
        console.info(e.data);
    };

    worker.port.postMessage('get');
} */

window.onload = function () {
    var squareNumber = document.querySelector('#number3');

    var result2 = document.querySelector('.result2');

    if (!!window.SharedWorker) {
        var myWorker = new SharedWorker("worker.js");

        squareNumber.onchange = function () {
            myWorker.port.postMessage([squareNumber.value, squareNumber.value]);
            console.log('Message posted to worker');
        }

        myWorker.port.onmessage = function (e) {
            result2.textContent = e.data;
            console.log('Message received from worker');
        }
    }

    var form = document.querySelector('form');

    form.onsubmit = function (e) {
        e.preventDefault();
    };
}

