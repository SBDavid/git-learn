var demoTemp = require("./classHelperDemo.hbs");

function classHelper(name) {

    var dom = document.createElement('div');

    dom.innerHTML = demoTemp({
        data: 'c1',
        data1: 'd b'
    });

    return dom.children[0];
}

module.exports = classHelper;