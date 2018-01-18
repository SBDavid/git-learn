var temp = require("./temp.hbs");

function template(first, last) {

    var dom = document.createElement('div');

    dom.innerHTML = temp({
        isActive: false
      });
    return dom.children[0];
}

module.exports = template;