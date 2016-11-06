var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var login = require('./app/login');

const config = require('./config.json');

app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(require('cors')());
app.use(login.auth);
app.use('/login', login.router);

require("./server/admin.js")(app, io);
require("./server/user.js")(io);
require("./server/register.js")(app);
db = require("./server/db.js");

var argv = require('minimist')(process.argv.slice(2));
const port = argv.p || 8080;

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

server.listen(port, function () {
  console.log('Server listening on port', port);
});

app.get('/logout', function(req, res) {
  res.clearCookie('userId');
  res.clearCookie('username');
  res.clearCookie('hash');
  res.redirect('/');
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
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
