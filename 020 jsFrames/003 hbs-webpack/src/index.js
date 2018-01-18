var demo = require('./temps/demo');
var withHelpDemo = require('./temps/withHelpDemo.js');
var eachHelpDemo = require('./temps/eachHelpDemo.js');
var partialsDemoUser = require('./temps/partialsDemoUser.js');
var classHelp = require('./temps/classHelperDemo.js');
var BlockExpressions = require('./temps/BlockExpressions/index.js');
var ifDemo = require('./temps/if/index.js');
var dynamicModules = require('./temps/dynamicModules/index.js');

window.onload = function() {

    //document.body.appendChild(demo("Help使用"));
   // document.body.appendChild(withHelpDemo('David', 'Tang'));
    //document.body.appendChild(eachHelpDemo());
    // document.body.appendChild(partialsDemoUser());
    // document.body.appendChild(classHelp())
    // document.body.appendChild(BlockExpressions())
    // document.body.appendChild(ifDemo());
    document.body.appendChild(dynamicModules('m1Temp'));
    document.body.appendChild(dynamicModules('m2Temp'));
}