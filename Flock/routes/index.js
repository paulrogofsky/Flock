var express = require('express');
var router = express.Router();

var Facebook = require('facebook-node-sdk');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/login', function(req, res) {
	res.render('login');
});

router.get('/facebook', Facebook.loginRequired(), function (req, res) {
  req.facebook.api('/me', function(err, user) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello, ' + user.name + '!');
  });
});

module.exports = router;
