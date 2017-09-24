var express = require('express');
var app = express();

app.get('/', function (req, res){
	res.send('tangjiaiwe');
});

var server = app.listen(80, function() {
	console.info('started');
});
