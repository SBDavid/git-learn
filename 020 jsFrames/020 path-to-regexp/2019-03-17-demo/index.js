var pathToRegexp = require('path-to-regexp');

const regexp = pathToRegexp('/(.*)#(.*).(.*)[(.*)]')

console.info(regexp);

console.info(regexp.exec('/div#root.cls[3]/2'))