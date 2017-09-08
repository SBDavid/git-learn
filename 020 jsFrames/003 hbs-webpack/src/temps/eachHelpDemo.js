var temp = require("./eachHelpDemo.hbs");

function template(first, last) {

    var dom = document.createElement('div');

    dom.innerHTML = temp({
        editNames: ['11', '22'],
        edits: [{
            editName: 'vscode'
        },
        {
            editName: 'webstorm'
        }]
    });
    return dom.children[0];
}

module.exports = template;