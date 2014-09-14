var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var uuid = require('node-uuid');

router.get('/Events/Create',function(req, res) {
	render(req, res, 'CreateEvent');
});

router.get('/Groups/Create', function(req, res) {
	render(req, res, 'CreateGroup');
});

router.get('/Person/Edit', function(req, res) {
	render(req, res, 'CreatePerson');
});

router.get('/Events/Find', function(req, res) {
	render(req, res, 'Find');
});

router.get('/Create', function(req, res) {
	render(req, res, 'Create');
});

router.post('/CreateEvent', function(req, res) {
	var Event = mongoose.model('events');
	var created_event = new Event();
	created_event.name = req.body.EventName;
	created_event.date = req.body.EventDate;
	created_event.start_time = req.body.start;
	created_event.end_time = req.body.end;
	created_event.location = req.body.location;
	created_event.description = req.body.description;
	created_event.details = req.body.details;
	created_event.size = req.body.size;
	created_event.tags = req.body.tags.split(" ");
	var event_id = uuid.v4();
	created_event.uuid = event_id;

	created_event.save(function (err, saved) {
		if (err) {
			console.log('Error');
			res.redirect('/')
		} else {
			console.log('Saved!');
			res.redirect('/Events/:event_id')
		}
	});
});

router.post('/CreateGroup', function(req, res) {
	
});

router.post('/PersonalProfile', function(req, res) {
	
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