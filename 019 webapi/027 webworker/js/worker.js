/* var data = 0;
console.info('load worker');
onconnect = function(e) {
  console.info('onconnect', e)
  var port = e.ports[0];
  port.onmessage = function(e) {
    if(e.data=='get'){
        port.postMessage(data);
    }else{
        data=e.data;
    }
  }
} */

onconnect = function(e) {
  var port = e.ports[0];

  port.onmessage = function(e) {
    var workerResult = 'Result: ' + (e.data[0] * e.data[1]);
    port.postMessage(workerResult);
  }

}