var data = 0;

onconnect = function(e) {
  var port = e.ports[0];

  port.onmessage = function(e) {
    if (e.data.type === 'get') {
      port.postMessage(data);
    }

    if (e.data.type === 'add') {
      data++;
    }

  }

}
