var express = require('express');
var mailer = require('../mailer');
var mongoose = require('mongoose');
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

router.post('/RegisterNow', function(req, res, next) {
  if (req.body.Email === '' || req.body.FirstName === '' || req.body.LastName === '') {
    console.log('You must provide an email address, first and last name.');
    res.redirect('/Register');
  } else {

	  var pin = makeid();

	  var mailOptions = {
	    from: 'The Flock Team <theflockteam@gmail.com>',
	    to: req.body.Email,
	    subject: 'Welcome to Flock!',
	    text: 'Welcome to Flock! A new way to enjoy the events you love. Please confirm your email with the following key: ' + pin
	  };

	  mailer.sendMail(mailOptions, function(err, info) {
	    if (err) {
	      next(err);
	    } else {
	      console.log('Message sent successfully!');
				res.render('ConfirmRegister', { Email : req.body.Email });
	    }
	  });
	}
});

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

module.exports = router;
