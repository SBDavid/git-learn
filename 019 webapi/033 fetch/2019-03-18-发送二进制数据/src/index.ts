import express from "express";
import getRawBody from 'raw-body';
var contentType = require('content-type')

const app = express();

app.use(function (req, res, next) {
  if (req.headers['content-type'] === 'application/octet-stream') {
      // using rawbody to read arrray buffer
      console.info('getRowbocy', contentType.parse(req).parameters.charset)
      getRawBody(req, {
        length: req.headers['content-length'],
        limit: '1mb',
        encoding: contentType.parse(req).parameters.charset
      }, function (err, string) {
          if (err)
              return next(err)

          req.body = string
          next()
      })
  } 
  else {
      next()
  }

});

app.post('/test', (req: express.Request, res: express.Response) => {
  console.info(req.body);



  res.send(200);
});

app.get('/', express.static('static'));

app.listen(3000, () => console.log('Example app listening on port 3000!'))