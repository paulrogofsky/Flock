var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var uuid = require('node-uuid');

var graph = require('fbgraph');

var conf = {
    client_id:      '722772554464882',
    client_secret:  'c7be44048e6a4571b8804ade0bac16da',
    scope:          'email, user_friends',
    redirect_uri:   'http://localhost:3000/Facebook'
};

router.get('/facebook', function(req, res) {
  // we don't have a code yet
  // so we'll redirect to the oauth dialog
  if (!req.query.code) {
    var authUrl = graph.getOauthUrl({
        "client_id":     conf.client_id,
        "redirect_uri":  conf.redirect_uri,
        "scope":         conf.scope
    });

    if (!req.query.error) { //checks whether a user denied the app facebook login/permissions
      res.redirect(authUrl);
    } else {  //req.query.error == 'access_denied'
      res.send('access denied');
    }
    return;
  }

  // code is set
  // we'll send that and get the access token
  graph.authorize({
      "client_id":      conf.client_id,
      "redirect_uri":   conf.redirect_uri,
      "client_secret":  conf.client_secret,
      "code":           req.query.code
  }, function (err, facebookRes) {
    if (err) {
      console.log('Failed authentication');
      res.redirect('/Login');
    } else {
      // Successfully authenticated
      var person_id = uuid.v4();

    	graph.get('/me', function(err, data) {

    		var Person = mongoose.model('person');
    		var fb_person = new Person();
  		  		fb_person.first_name = data.first_name;
  		  		fb_person.last_name = data.last_name;
  		  		fb_person.facebook = data.id;
            fb_person.uuid = person_id;

    		Person.find( { facebook : data.id } , function (err, user) {
    			if (user.length == 0) { 
  		  		fb_person.save(function (err, saved) {
  		  			if (!err) {
  		  				console.log('Saved!');
  		  			} else {
  		  				console.log('Error!');
  		  			}
  	  			});
    			}
    		});        
    	});

      req.session.user = person_id;
      res.redirect('/');
    }
  });
});

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

module.exports = router;
