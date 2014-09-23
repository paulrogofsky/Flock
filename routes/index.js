var express = require('express');
var mailer = require('../mailer');
var mongoose = require('mongoose');
var uuid = require('node-uuid');

var crypto = require("crypto");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	render(req, res, 'index');
});

router.get('/Login', function(req, res) {
	render(req, res, 'login');
});

router.get('/Register', function(req, res) {
	render(req, res, 'Register');
});

router.get('/Founders',function(req,res) {
	render(req,res,'Founders');
});

router.get('/Navbar', function(req, res){
	render(req, res, 'navbar')
});

router.get('/Person', function(req, res) {
	render(req, res, 'person');
})

router.get('/Navbar1', function(req, res){
	render(req, res, 'navbar1.hjs')
});

router.get('/Logout', function(req, res) {
	console.log(req.session.user);
	req.session.user = null;
	req.session.facebook = false;
	req.session.name = null;
	console.log(req.session.user);
	req.session.alert = 'You have been signed out';
	res.redirect('/Login');
})

router.post('/Login', function (req, res, next) {
	var Person = mongoose.model('person');
	Person.findOne( { email : req.body.email } , function(err, user) {
		if (err) {
			console.log('Could not update');
		} else if (!user) {
			req.session.alert = 'Sorry, that email is not correct.';
			res.redirect('/Login');
		}	else {
			var encrypted = user.password;
			var decrypted = decrypt(encrypted);
			if (req.body.password === decrypted) {
				var user_id = user.uuid;
				req.session.user = user_id;
				req.session.facebook = false;
				req.session.name = user.first_name + " " + user.last_name;


				var redirect = req.session.redirect;
				req.session.redirect = null;
				if (!redirect) {
					res.redirect('/');
				} else {
					res.redirect(redirect);
				}
			} else {
				req.session.alert = 'Sorry, that password was incorrect.';
				res.redirect('/Login');
			}
		}
	});
});

router.post('/RegisterNow', function(req, res, next) {
  if (req.body.email === '' || req.body.FirstName === '' || req.body.LastName === '') {
    req.session.alert = 'You must provide an email address, first and last name.';
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
					req.session.alert = 'Your email has already been registered.';
					res.redirect('/Login');
				}
			}
		});
	}
});

router.post('/ConfirmRegister', function (req, res, next) {
	var Person = mongoose.model('person');
	Person.findOne( { email : req.body.Email } , function(err, user) {
		console.log(user);
		if ( user.pin === req.body.Pin ) {
			var user_id = uuid.v4();
			var password = req.body.Password;
			var encrypted = encrypt(password);
			Person.findOneAndUpdate( { email : user.email, pin : user.pin }, { password: encrypted, uuid : user_id }, function(err, data) {
				if (err) {
					console.log('Could not update');
				} else {
					console.log('Saved!');
				}
			});
			req.session.user = user_id;
		} else {
			req.session.alert = 'That pin was incorrect. Please re-enter the pin from your email.';
			console.log('That pin is incorrect' + user.pin + ' vs. ' + req.body.Pin);
		}
	});
	res.redirect('/');
});

router.post('/RegisterAgain', function (req, res, next) {
	var Person = mongoose.model('person');
	console.log(req.body.email);
	Person.findOne({ email : req.body.email } , function(err, user) {
		if (!user) {
			req.session.alert = 'That email has never been sent a pin. Please register.';
			res.redirect('/Register');
		} else if (user.password) {
			req.session.alert = 'Your email has already been registered.';
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
				res.render('ConfirmRegister', { Email : email, LinkInOrOut : 'Login', InOrOut : 'Log In', RegisterOrProfile : 'Register' });
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
  var registerorprofile;
  var loginorout;
  var linkinorout;
  if (id) {
  	if (req.session.facebook) {
	    registerorprofile = "Profile";
  	} else {
  		registerorprofile = req.session.name;
  	}
    loginorout = 'Log Out';
    linkinorout = 'Logout';
  } else {
    registerorprofile = 'Register';
    loginorout = 'Log In';
    linkinorout = 'Login'
  }

  var alert = req.session.alert;
  req.session.alert = null;
  res.render(pagename, { LinkInOrOut : linkinorout, InOrOut : loginorout, RegisterOrProfile : registerorprofile, alert : alert });
}

function encrypt(text){
  var cipher = crypto.createCipher('aes-256-cbc','d6F3Efeq')
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher('aes-256-cbc','d6F3Efeq')
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

module.exports = router;
