var temp = require("./withHelpDemo.hbs");

function template(first, last) {

    var dom = document.createElement('div');

    dom.innerHTML = temp({
        name: {
            firstname: first,
            lastname: last
        }
    });
    return dom.children[0];
}

module.exports = template;