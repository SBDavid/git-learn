window.onload = function () {
    window.ws = new WebSocket("ws://127.0.0.1:8181");

    ws.onopen = function (evt) {
        console.log("Connection open ...");
        
        /* setInterval(function() {
            var now = new Date();
            ws.send(now.getMilliseconds()+'');
        }, 10) */
        var now = new Date();
        ws.send(now.getMilliseconds()+'');
    
    };

    ws.onmessage = function (evt) {
        var now = new Date();
        console.log("Received Message: " + evt.data);
        ws.close();
    };

    ws.onclose = function (evt) {
        console.log("Connection closed.");
    };
}