var express = require('express')
var cookieParser = require('cookie-parser')
var cors = require('cors')
var app = express()

app.get('/setCookie'
,cookieParser() ,function (req, res, next) {
    res.cookie('count', '1', {
    });

    res.append('Access-Control-Allow-Origin', '*');
    res.append('Access-Control-Allow-Methods', ['GET'])

    res.json(req.cookies)
})

app.get('/getCookie' , cookieParser(),function (req, res, next) {
    res.json(req.cookies)
})

app.get('/check-cookie', cookieParser(), function (req, res, next) {
    res.append('Access-Control-Allow-Origin', 'http://read-cookie.com');
    res.append('Access-Control-Allow-Methods', ['GET'])
    res.append('Access-Control-Allow-Credentials', 'true');
    res.send(req.cookies)
})

app.use(express.static('read-cookie'));

app.listen(80, function () {
  console.log('CORS-enabled web server listening on port 80')
})