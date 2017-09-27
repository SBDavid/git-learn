var express = require('express');
var app = express();

var router = express.Router();

router.get('/', function (req, res) {
	res.send('tangjiaiwe');
});

router.get('/user', function (req, res) {
	res.send('Got a PUT request at /user')
});

router.get('/users/:userId/books/:bookId', function (req, res) {
	res.send(JSON.stringify(req.params));
})

router.use('/static', express.static('public'));

app.use('/router', router)

var server = app.listen(80, function () {
	console.info('started');
});
