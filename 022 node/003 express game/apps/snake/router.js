var express = require('express');
var router = express.Router();


router.get('/', function (req, res) {
	res.render('index', { x: 10, y: 10, num: 100 });
});

router.use('/static', express.static('apps/snake/static'));

module.exports = router;