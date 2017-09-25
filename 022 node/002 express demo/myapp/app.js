var express = require('express');
var app = express();

app.get('/', function (req, res) {
	res.send('tangjiaiwe');
});

app.get('/user', function (req, res) {
	res.send('Got a PUT request at /user')
});

app.get('/users/:userId/books/:bookId', function (req, res) {
	res.send(JSON.stringify(req.params));
})

app.use('/static', express.static('public'));

var server = app.listen(80, function () {
	console.info('started');
});
