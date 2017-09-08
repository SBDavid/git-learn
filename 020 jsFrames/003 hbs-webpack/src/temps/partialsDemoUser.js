var temp = require("./partialsDemoUser.hbs");

function template(first, last) {

    var dom = document.createElement('div');

    dom.innerHTML = temp({
        names: [{
                firstname: 'David',
                lastname: 'Tang'
            },
            {
                firstname: 'Test',
                lastname: 'Tang'
            },
        ]
    });
    return dom.children[0];
}

module.exports = template;