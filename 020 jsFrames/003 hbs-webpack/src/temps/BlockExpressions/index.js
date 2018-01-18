var temp = require("./peoples.hbs");

function template(first, last) {

    var dom = document.createElement('div');

    dom.innerHTML = temp({
        people: [
          {firstName: "Yehuda", lastName: "Katz"},
          {firstName: "Carl", lastName: "Lerche"},
          {firstName: "Alan", lastName: "Johnson"}
        ]
      });
    return dom.children[0];
}

module.exports = template;