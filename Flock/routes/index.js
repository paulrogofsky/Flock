var express = require('express');
var router = express.Router();

var Facebook = require('facebook-node-sdk');
var facebook = new Facebook({ appID: '722772554464882', secret: 'c7be44048e6a4571b8804ade0bac16da' });

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/Login', function(req, res) {
	res.render('login');
});

router.get('/Test', function(req,res) {
	req.facebook.api('/me', function(err, data) {
  	console.log(data);
	});
});

router.get('/Register', function(req, res) {
	res.render('Register')
});

router.get('/navbar', function(req,res){
	res.render('navbar')
});

router.get('/Person/')

module.exports = router;
