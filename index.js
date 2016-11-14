var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var cookieParser = require('cookie-parser');
var login = require('./app/login');
const config = require('./config.json');
app.use(bodyParser.json());

app.use(express.static(__dirname));
app.use(require('cors')());

app.use(cookieParser());

app.use(login.auth);
app.use('/login', login.router);

require("./app/admin.js")(app, io);
require("./app/user.js")(io);
require("./app/register.js")(app);
db = require("./app/db.js");

var argv = require('minimist')(process.argv.slice(2));
const port = argv.p || 8080;

app.get('/', function (req, res) {

  switch (req.role) {
  case 'voter':
    res.redirect('/vote');
    break;
  case 'admin':
    res.redirect('/admin');
    break;
  case 'register':
    res.redirect('/register');
    break;
  default:
    res.sendFile(__dirname + '/client/index.html');
    break;
  }
});

app.use(function(req, res, next) {
  if (req.role !== 'voter' ||!req.userId) { return next(); }
  db.validateUser(req.userId, function(exists) {
    if(!exists) {
      req.userId = null;
      req.role = null;
    }
    next();
  });
});

app.use('/admin', function(req, res, next) {
  if (req.role !== 'admin') {
    return res.redirect('/');
  }
  next();
});
app.use('/register', function(req, res, next) {
  if (req.role !== 'register') {
    res.redirect('/');
  }
  next();
});
app.use('/results', function(req, res, next) {
  if (req.role !== 'admin') {
    return res.redirect('/');
  } 
  next();
});

app.get('/logout', function(req, res) {
  res.clearCookie('userId');
  res.clearCookie('username');
  res.clearCookie('hash');
  res.redirect('/');
});

server.listen(port, function () {
  console.log('Server listening on port', port);
});

app.get('/bundle.js', function (req, res) {
  res.sendFile(__dirname + '/client/bin/app.bundle.js');
});
app.get('/app.bundle.js.map', function (req, res) {
  res.sendFile(__dirname + '/client/bin/app.bundle.js.map');
});

app.get('*', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
});
