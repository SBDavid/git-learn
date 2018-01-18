var m1Temp = require("./m1.hbs");
var m2Temp = require("./m2.hbs");

var tmpls = {
    m1Temp,
    m2Temp
}

function template(tmplName) {

    var dom = document.createElement('div');

    dom.innerHTML = tmpls[tmplName]({
        data: 'This is content.data'
      });
    return dom.children[0];
}

module.exports = template;