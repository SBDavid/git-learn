var express = require('express');
var app = express();

app.set('view engine', 'pug');
app.set('views', './views');

var router = express.Router();

router.get('/', function (req, res) {
	res.render('index', { num: 4 });
});

app.use('/static', express.static('public'));

app.use('/router', router)

var server = app.listen(80, function () {
	console.info('started');
});
