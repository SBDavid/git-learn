require('es6-promise').polyfill();
var axios = require('axios');

axios.get('https://api.github.com/')
  .then(function (res) {
    console.log('success res: ', res);
  })
  ['catch'](function (err) {
    console.error('fail err: ', err);
  });