var express = require('express');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var md5 = require('js-md5');
var routes = require('./controllers/index');
var users = require('./controllers/userController');
var auth = require('./controllers/authController');
var socket = require('./controllers/chanelController');
var session = require('express-session');
var userModel = require('./models/User');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/irc');

var app = express();

//var server = require('http').Server(app);



var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Requested-With");

  //var token = req.headers.authorization;
  //console.log(token);
  //var decoded = jwt.verify(token, 'jwtSecret');
  //console.log(token);
/*  try {
    var decoded = jwt.verify(token, 'jwtSecret');
  } catch(err) {
    res.send(err);
  }*/
  //var decoded = jwt.verify(token, 'jwtSecret');
//  console.log(decoded);
  next();
});

app.use(express.static(__dirname + '/public'));
var mySecret = 'jwtSecret';
//app.use(expressJwt({ secret: mySecret }).unless({ path: ['/login', '/register' ]}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/user', users);
app.use('/', auth);
/*app.get('/', function(req, res) {
  //send the index.html in our public directory
  res.sendfile('index.html');
});*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


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

var server = app.listen(8080);
var users = {};

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {
  console.log('new connection');
  var defaultRoom = 'general';

  var messages = [];
  var AuthMe = false;
  for(var k in users) {

    socket.emit('nouveau_client', users[k]);
  }

  socket.on('nouveau_client', function(pseudo) {
      AuthMe = pseudo;
      //AuthMe.avatar = 'https://gravatar.com/avatar/'+ md5(pseudo.email) + '?s=50';
      //console.log(pseudo._id);
      socket.emit('logged');
      users[AuthMe._id] = AuthMe;
     // users.push(AuthMe);
      io.sockets.emit('nouveau_client', AuthMe);
  });

  socket.on('message', function (message) {

    console.log(message);
    
    io.sockets.emit('message', { pseudo: AuthMe, message: message });

  });

  socket.on('disconnect', function () {
    if(!AuthMe) {
       return false;
    }

    delete users[AuthMe._id];
    io.sockets.emit('disconnect', AuthMe);
  })
  console.log(users);


});
module.exports = app;
