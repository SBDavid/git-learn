
var cRefer = null;
require.ensure([]
    , function (require) {
        cRefer = require('./moduleCommonJs');

        console.info(cRefer());
        test();
    }, function (error) {
        console.error('ensure error', error);
    },
    'test-chunk');

function test() {
    console.info(cRefer());
}


require([], function(b) {
    var c = require('./moduleAmd');
    console.info(c);
  });