var demo = require('./temps/demo');
/* var withHelpDemo = require('./temps/withHelpDemo.js');
var eachHelpDemo = require('./temps/eachHelpDemo.js');
var partialsDemoUser = require('./temps/partialsDemoUser.js'); */

window.onload = function() {

    document.body.appendChild(demo("Help使用"));
    /* document.body.appendChild(withHelpDemo('David', 'Tang'));
    document.body.appendChild(eachHelpDemo());
    document.body.appendChild(partialsDemoUser()); */
}