var demoTemp = require("./demo.hbs");

function demo(name) {

    var dom = document.createElement('div');

    dom.innerHTML = demoTemp({
        name: name
    });

    return dom;
}

module.exports = demo;