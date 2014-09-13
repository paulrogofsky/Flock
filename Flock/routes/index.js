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

  	var Person = mongoose.model('person');
		var email_person = new Person();
	  		email_person.first_name = req.body.FirstName;
	  		email_person.last_name = req.body.LastName;
	  		email_person.email = req.body.Email;
	  		email_person.pin = pin;

		Person.find( { email : req.body.Email } , function (err, user) {
			if (user.length == 0) { 
	  		email_person.save(function (err, saved) {
	  			if (!err) {
	  				console.log('Saved!');
	  			} else {
	  				console.log('Error!');
	  			}
	  			emailpin(pin, req.body.Email, res);
				});
			} else {
				if (!user[0].password) {
					console.log(user[0].pin);
					emailpin(user[0].pin, req.body.Email, res);
				} else {
					res.redirect('/Login');
				}
			}
		});
	}
});

function emailpin(pin, email, res)
{
	var mailOptions = {
	    from: 'The Flock Team <theflockteam@gmail.com>',
	    to: email,
	    subject: 'Welcome to Flock!',
	    text: 'Welcome to Flock! A new way to enjoy the events you love. Please confirm your email with the following key: ' + pin
	  };

	  mailer.sendMail(mailOptions, function(err, info) {
	    if (err) {
	      next(err);
	    } else {
	      console.log('Message sent successfully!');
				res.render('ConfirmRegister', { Email : email });
	    }
	  });
}

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

module.exports = router;
