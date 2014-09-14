var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var uuid = require('node-uuid');

router.get('Events/:event_id/Groups/Create', function(req, res) {
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

router.get('/Events/Create',function(req, res) {
	render(req, res, 'CreateEvent');
});

router.get('/Events/:event_id', function (req, res) {
	render_event(req, res, req.params.event_id);
});

router.post('/CreateEvent', function(req, res) {
	var Event = mongoose.model('event');
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
			console.log(err);
			res.redirect('/')
		} else {
			console.log('Saved!');
			res.redirect('/Events/' + event_id);
		}
	});
});

router.post('/CreateGroup', function(req, res) {
	
});

router.post('/PersonalProfile', function(req, res) {
	
});

function render_event(req, res, event_id) {
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
	var Event = mongoose.model('event');
	Event.findOne( { uuid : event_id } , function (err, created_event) {
		if (err) {
			console.log(err);
		} else if (!created_event) {
			res.redirect('/Events');
		}	else {
			res.render('event', {
				LinkInOrOut : linkinorout,
				InOrOut : loginorout,
				RegisterOrProfile : registerorprofile,
				name : created_event.name,
				location : created_event.location,
				date : created_event.date,
				start : created_event.start_time,
				end : created_event.end_time,
				size : created_event.size,
				description : created_event.description,
				details : created_event.details,
				keywords : created_event.tags,
				groups : created_event.groups
			});
		}
	});
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

module.exports = router;