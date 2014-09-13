var express = require('express');
var router = express.Router();

var graph = require('fbgraph');

var conf = {
    client_id:      '722772554464882',
    client_secret:  'c7be44048e6a4571b8804ade0bac16da',
    scope:          'public_profile, user_friends',
    redirect_uri:   'http://localhost:3000/facebook'
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
    res.redirect('/Home');
  });
});

var options = {
    timeout:  3000
  , pool:     { maxSockets:  Infinity }
  , headers:  { connection:  "keep-alive" }
};

graph.setOptions(options);

// user gets sent here after being authorized
router.get('/Home', function(req, res) {
  graph.get('joshkarnofsky/picture', function (err, data) {
  	console.log(data);
  });
});

module.exports = router;
