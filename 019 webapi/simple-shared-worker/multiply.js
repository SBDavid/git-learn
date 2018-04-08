

if (!!window.SharedWorker) {
  var myWorker = new SharedWorker("worker.js");

  myWorker.port.onmessage = function(e) {
    var data = e.data;
    
    console.info('onmessage', data);

    set(data+1);
  }

  function set(data) {
    myWorker.port.postMessage({
      type: 'set',
      val: data
    });
  }

  for(var i=0; i<10000; i++) {
    myWorker.port.postMessage({
      type: 'get'
    });
  }
}
