var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('cookie-session');


var facebook = require('./routes/facebook');
var events = require('./routes/events');
var routes = require('./routes/index');
var app = express();

var debug = require('debug')('Flock');
app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});

var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:flockbro@ds035310.mongolab.com:35310/flockdb');

mongoose.model('person', {
  first_name: String,
  last_name: String,
  email: String,
  pin: String,
  password: String,
  age: Number,
  events_gone: [String],
  events_going: [String],
  facebook: String,
  uuid: String
});

mongoose.model('event', {
  name: String,
  date: Date,
  start_time: String,
  end_time: String,
  location: String,
  description: String,
  details: String,
  tags: [String],
  group_id: [String]
});

mongoose.model('group', {
  name: String,
  member_ids: [String],
  max_size: Number,
  event_id: String,
  creator_id: String,
  description: String
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'theflockteam'}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', events);
app.use('/', facebook);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
