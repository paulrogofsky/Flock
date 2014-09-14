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
	console.log(req.session.user);
	res.redirect('/');
})

router.post('/Login', function (req, res, next) {
	var Person = mongoose.model('person');
	Person.findOne( { email : req.body.email } , function(err, user) {
		if (err) {
			console.log('Could not update');
		} else if (!user) {
			res.redirect('/Login');
		}	else {
			var encrypted = user.password;
			if (user.password === decrypt(encrypted)) {
				var user_id = user.uuid;
				req.session.user = user_id;
			} else {
				res.redirect('/Login');
			}
		}
	});
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
			var user_id = uuid.v4();
			var password = req.body.Password;
			var encrypted = encrypt(password);
			Person.findOneAndUpdate( { email : req.body.email }, { password: encrypted, uuid : user_id }, function(err, data) {
				if (err) {
					console.log('Could not update');
				} else {
					console.log('Saved!');
				}
			});
			req.session.user = user_id;
		}
	});
	res.redirect('/');
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
    registerorprofile = 'Profile';
    loginorout = 'Log Out';
    linkinorout = 'Logout';
  } else {
    registerorprofile = 'Register';
    loginorout = 'Log In';
    linkinorout = 'Login'
  }
  res.render(pagename, { LinkInOrOut : linkinorout, InOrOut : loginorout, RegisterOrProfile : registerorprofile });
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
