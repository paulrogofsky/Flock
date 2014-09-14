var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var uuid = require('node-uuid');

router.get('/Events', function (req, res) {
	render_events(req, res);
})

router.get('/Events/:event_id/Groups', function(req, res) {
	render_groups(req, res, req.params.event_id);
});

router.get('/Events/:event_id/Groups/Create', function(req, res) {
	if (!req.session.user) {
		req.session.redirect = '/Events/' + req.params.event_id + '/Groups/Create';
		res.redirect('/Login');
	}
	render_create_group(req, res, req.params.event_id);
});

router.get('/Events/:event_id/Groups/:group_id', function(req, res) {
	render_group(req, res, req.params.event_id, req.params.group_id);
});

router.get('/Person/Edit', function(req, res) {
	if (!req.session.user) {
		req.session.redirect = '/Person/Edit';
		res.redirect('/Login');
	}
	render(req, res, 'CreatePerson');
});

router.get('/Find', function(req, res) {
	render(req, res, 'Find');
});

router.get('/Create', function(req, res) {
	if (!req.session.user) {
		req.session.redirect = '/Create';
		res.redirect('/Login');
	}
	render(req, res, 'Create');
});

router.get('/Events/Create',function(req, res) {
	if (!req.session.user) {
		req.session.redirect = '/Events/Create';
		res.redirect('/Login');
	}
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
	group.event_id = req.body.EventId;
	group.creator_id = req.body.creator_id;
	group.description = req.body.description;
	var group_uuid = uuid.v4();
	group.uuid = group_uuid;

	save_group = {
		name : group.name,
		member_ids : group.member_ids,
		event_id : group.event_id,
		creator_id : group.creator_id,
		description : group.description,
		uuid : group.uuid
	};

	group.save(function (err, saved) {
		if (err) {
			console.log(err);
			res.redirect('/');
		} else {
			console.log('Saved!');
			var Event = mongoose.model('event');

			console.log(group_uuid);

			Event.findOneAndUpdate(
		    { uuid : req.body.EventId},
		    {$push: { groups : save_group }},
		    function(err, person) {
		       if (err) {
		       	console.log(err)
		       } else {
		       	console.log(person);
		       }
		    }
			);
			res.redirect('/Events/' + req.body.EventId + '/Group/' + group_uuid);
		}
	});
});

router.post('/PersonalProfile', function(req, res) {
	
});

function render_group(req, res, event_id, group_id) {
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
			res.redirect('/Events/' + event_id);
		}	else {
			console.log(created_event);
			var groups = created_event.groups

			var Group = mongoose.model('event');
			Group.findOne( { uuid : group_id } , function (err, group) {
				if (err) {
					console.log(err);
				} else {
					console.log('NEW LINE : ' + group)
					var Person = mongoose.model('person');
					Person.findOne( { uuid : group.creator_id } , function (err, creator) {
						Person.find ( { uuid : { $in: group.member_ids } }, function (err, members) {
							res.render('group', {
								LinkInOrOut : linkinorout,
								InOrOut : loginorout,
								RegisterOrProfile : registerorprofile,
								events: created_event,
								group: group,
								created_event : created_event,
								creator : creator,
								members: members
							});
						})
					});
				}
			});
		}
	});
}

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
			var groups = created_event.groups

	    res.render('groups', {
				LinkInOrOut : linkinorout,
				InOrOut : loginorout,
				RegisterOrProfile : registerorprofile,
				events: created_event,
				groups: groups
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
			parameters = {
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
				event_id : event_id,
				create_link : 'Events/' + event_id + '/Groups/Create'
			}

			if (req.session.user) {
				parameters.logged_in = true;
			}
			res.render('event', parameters);
		}
	});
}

function render_events(req, res) {
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
  Event.find( { } , function (err, events) {
  	var Group = mongoose.model('group');
  	var parameters = {
	  		LinkInOrOut : linkinorout,
				InOrOut : loginorout,
				RegisterOrProfile : registerorprofile,
				events : events,
  	}

  	if (req.session.user) {
  		parameters.logged_in = true
  	}

  	res.render('Events', parameters);
  });
}

function render_create_group(req, res, event_id) {
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

  var Person = mongoose.model('person');
  Person.findOne( { uuid : id } , function (err, user) {
  	if (err) {
  		console.log(err);
  	} else if (!user) {
  		console.log('No user signed in');
  		res.session.alert = 'You need to be signed in to do that.';
  		res.redirect('/Login');
  	} else {
  		res.render('CreateGroup', {
  			LinkInOrOut : linkinorout,
				InOrOut : loginorout,
				RegisterOrProfile : registerorprofile,
				creator_id : user._id,
				eventId : event_id
  		});
  	}
  })
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