

if (!!window.SharedWorker) {

  var count = 0;

  var myWorker = new SharedWorker("worker.js");

  myWorker.port.onmessage = function(e) {
    var data = e.data;
    
    console.info('onmessage', data);

    if (count < 10000) {
      add();
      get();
      count++;
    }
  }

  function add() {
    myWorker.port.postMessage({
      type: 'add'
    });
  }

  function get() {
    myWorker.port.postMessage({
      type: 'get'
    });
  }

  get();
}
