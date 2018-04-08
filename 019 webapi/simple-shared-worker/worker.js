var data = 0;

onconnect = function(e) {
  var port = e.ports[0];

  port.onmessage = function(e) {

    if (e.data.type === 'get') {
      port.postMessage(data);
      //data++;
    }

    if (e.data.type === 'set') {
      data = e.data.val;
    }

  }

}
