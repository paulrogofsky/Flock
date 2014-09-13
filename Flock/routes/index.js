var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/Login', function(req, res) {
	res.render('login');
});

router.get('/Register', function(req, res) {
	res.render('Register')
});

router.get('/Navbar', function(req,res){
	res.render('navbar')
});

router.get('/Person', function(req,res) {
	res.render('person');
})

router.get('/Navbar1',function(req,res){
	res.render('navbar1.hjs')
});

module.exports = router;
