var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('client-sessions');

var index = require('./routes/index');
var user = require('./routes/user');
var discover = require('./routes/discover');
var friends = require('./routes/friends');
var chat = require('./routes/chat');
var notifications = require('./routes/notifications');
var settings = require('./routes/settings');
var debug = require('./routes/debug');

var UserModel = require('./models/UserModel');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/minder');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  /*We put stuff in here if we want to ensure that stuff runs only if mongo is open.
  If we put stuff outside, we can't ensure that mongo is opened.*/
  console.log("Connected to mongodb!");
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here_asdf',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

app.use(function(req, res, next) {
  if (req.session && req.session.user) {
    UserModel.findOne({ email: req.session.user.email }, function(err, user) {
      user = user.toObject(); //Needed to delete properly. Mongoose object won't delete.
      if (user) {
        req.user = user;
        delete req.user.password; // delete the password from the session
        req.session.user = user;  //refresh the session value
        res.locals.user = user;
      }
      // finishing processing the middleware and run the route
      next(); //This must be here as well. This is asynchronous.
    });
  } else {
    next();
  }
});

app.use('/', index);
app.use('/friends', friends);
app.use('/chat', chat);
app.use('/user', user);
app.use('/discover', discover);
app.use('/notifications', notifications);
app.use('/settings', settings);
app.use('/debug', debug);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;