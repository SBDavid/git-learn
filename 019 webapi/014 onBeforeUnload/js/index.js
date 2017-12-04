window.addEventListener("beforeunload", function (e) {
    /* var confirmationMessage = "\o/";
  
    e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
    return confirmationMessage;              // Gecko, WebKit, Chrome <34 */

    var i = document.createElement('img');
    i.src = 'http://a.com/beforeunload';
});

window.addEventListener("unload", function (e) {
    /* var confirmationMessage = "\o/";
  
    e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
    return confirmationMessage;              // Gecko, WebKit, Chrome <34 */

    var i = document.createElement('img');
    i.src = 'http://a.com/unload';
});

window.addEventListener("pagehide", function (e) {

    var i = document.createElement('img');
    i.src = 'http://a.com/pagehide';
});

window.addEventListener("pageshow", function (e) {

    var i = document.createElement('img');
    i.src = 'http://a.com/pageshow';
});