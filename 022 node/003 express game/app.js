var express = require('express');
var app = express();

// app config
app.set('view engine', 'pug');
app.set('views', ['./apps/snake/views']);

// public static file
app.use('/static', express.static('static'));

// routers
app.use('/snake', require('./apps/snake/router'));

var server = app.listen(81, function () {
	console.info('Example app listening on port 81!');
});