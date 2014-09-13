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

router.get('/facebook', Facebook.loginRequired(), function(req, res) {
  req.FB.api('/me', function(err, user) {
    res.send('Hello, ' + user.name + '!');
  });
});

router.get('/register', function(req, res) {
	res.render('Register')
});

module.exports = router;
