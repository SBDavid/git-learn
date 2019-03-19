"use strict";

var _express = _interopRequireDefault(require("express"));

var _rawBody = _interopRequireDefault(require("raw-body"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var contentType = require('content-type');

const app = (0, _express.default)();
app.use(function (req, res, next) {
  if (req.headers['content-type'] === 'application/octet-stream') {
    // using rawbody to read arrray buffer
    console.info('getRowbocy', contentType.parse(req).parameters.charset);
    (0, _rawBody.default)(req, {
      length: req.headers['content-length'],
      limit: '1mb',
      encoding: contentType.parse(req).parameters.charset
    }, function (err, string) {
      if (err) return next(err);
      req.body = string;
      next();
    });
  } else {
    next();
  }
});
app.post('/test', (req, res) => {
  console.info(req.body);
  res.send(200);
});
app.get('/', _express.default.static('static'));
app.listen(3000, () => console.log('Example app listening on port 3000!'));