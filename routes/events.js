var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var uuid = require('node-uuid');

router.get('/Events/:event_id/Groups', function(req, res) {
	console.log(req.params.event_id);
	render_groups(req, res, req.params.event_id);
});

router.get('/Events/:event_id/Groups/Create', function(req, res) {
	render(req, res, 'CreateGroup');
});

router.get('/Events/:event_id/Groups/:group_id', function(req, res) {
	render(req, res, 'group');
});

router.get('/Person/Edit', function(req, res) {
	render(req, res, 'CreatePerson');
});

router.get('/Find', function(req, res) {
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
	var Group = mongoose.model('group');
	var group = new Group();
	group.name = req.body.GroupName;
	group.member_ids = req.body.members;
	group.max_size = req.body.max_size;
	group.event_id = req.body.eventId;
	group.creator_id = req.body.creator_id;
	group.description = req.body.description;
	var group_uuid = uuid.v4();
	group.uuid = group_uuid;

	group.save(function (err, saved) {
		if (err) {
			console.log(err);
			res.redirect('/');
		} else {
			console.log('Saved!');
			res.redirect('/Events/' + req.body.eventId + '/Group/' + group_uuid);
		}
	});
});

router.post('/PersonalProfile', function(req, res) {
	
});

function render_groups(req, res, event_id) {
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
			console.log('Could not find event');
			res.redirect('/Events');
		}	else {
			console.log(created_event);
			var group_ids = created_event.group_id

			Group = mongoose.model('group');
			Group.find({
	    'uuid': { $in: group_ids }
			}, function(err, groups){
			    console.log(groups);

			    res.render('groups', {
						LinkInOrOut : linkinorout,
						InOrOut : loginorout,
						RegisterOrProfile : registerorprofile,
						events: created_event,
						groups: groups
					});
			});
		}
	});
}

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
			console.log('Could not find event');
			res.redirect('/Events');
		}	else {
			console.log('List of tags: ' + created_event.tags)
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
				groups : created_event.groups,
				create_link : 'Events/' + event_id + '/Groups/Create'
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