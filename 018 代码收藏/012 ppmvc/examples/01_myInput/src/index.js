var myInput = require("./modules/myInput/index");


var myName = new myInput('我的名字', '铁柱');

window.onload = function() {
    document.getElementById('container').appendChild(myName.getView().el)
}