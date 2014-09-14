var express = require('express');
var mailer = require('../mailer');
var mongoose = require('mongoose');

var crypto = require("crypto");
var router = express.Router();

var algorithm = 'aes256';
var key = 'theflockteam';
var cipher = crypto.createCipher(algorithm, key);

/* GET home page. */
router.get('/', function(req, res) {
	render(req, res, 'index');
});

router.get('/Login', function(req, res) {
	render(req, res, 'login');
	console.log('The session user id is ' + req.session.user);
});

router.get('/Register', function(req, res) {
	render(req, res, 'Register');
});

router.get('/Navbar', function(req,res){
	render(req, res, 'navbar')
});

router.get('/Person', function(req,res) {
	render(req, res, 'person');
})

router.get('/Navbar1',function(req,res){
	render(req, res, 'navbar1.hjs')
});

router.post('/RegisterNow', function(req, res, next) {
  if (req.body.email === '' || req.body.FirstName === '' || req.body.LastName === '') {
    console.log('You must provide an email address, first and last name.');
    res.redirect('/Register');
  } else {

	  var pin = makeid();

  	var Person = mongoose.model('person');
		var email_person = new Person();
	  		email_person.first_name = req.body.FirstName;
	  		email_person.last_name = req.body.LastName;
	  		email_person.email = req.body.email;
	  		email_person.pin = pin;

		Person.find( { email : req.body.email } , function (err, user) {
			if (user.length == 0) { 
	  		email_person.save(function (err, saved) {
	  			if (!err) {
	  				console.log('Saved!');
	  			} else {
	  				console.log('Error!');
	  			}
	  			emailpin(pin, req.body.email, res);
				});
			} else {
				if (!user[0].password) {
					console.log(user[0].pin);
					emailpin(user[0].pin, req.body.email, res);
				} else {
					res.redirect('/Login');
				}
			}
		});
	}
});

router.post('/ConfirmRegister', function (req, res, next) {
	var Person = mongoose.model('person');
	Person.findOne( { email : req.body.email } , function(err, user) {
		if ( user.pin === req.body.Pin ) {
			var password = req.body.Password;
			var encrypted = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');
			Person.findOneAndUpdate( { email : req.body.email }, { password: encrypted }, function(err, data) {
				if (err) {
					console.log('Could not update');
				} else {
					console.log('Saved!');
				}
			});
		}
	});
	res.redirect('/Home');
});

router.post('/RegisterAgain', function (req, res, next) {
	var Person = mongoose.model('person');
	console.log(req.body.email);
	Person.findOne({ email : req.body.email } , function(err, user) {
		if (!user) {
			res.redirect('/Register');
		} else if (user.password) {
			res.redirect('/Login');
		} else {
			console.log(user);
			emailpin(user.pin, req.body.email, res);
		}
	});
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
	      console.log(err);
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

function render(req, res, pagename) {
	var id = req.session.user;
	console.log(id);
	var registerorprofile;
	var loginorout;
	if (id) {
		registerorprofile = 'Profile';
		loginorout = 'Log Out';
	} else {
		registerorprofile = 'Register';
		loginorout = 'Log In';
	}
  res.render(pagename, { InOrOut : loginorout, RegisterOrProfile : registerorprofile });
}

module.exports = router;
