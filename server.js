var express = require('express');
var app = express();

var Grant = require('grant-express');
grant = new Grant(require('./config/settings.json'));

var server = require('http').Server(app);
var io = require('socket.io')(server);

var mongoose = require('mongoose');
var WCUser = require('./backend-app/models/user');
var db = require('./config/db.json');

var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cors = require('cors');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var request = require('request');
var withings = require("withings-api");

var port = process.env.PORT || 3000;
mongoose.connect(db.url);

app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
  name: 'grant',
  secret: 'very secret',
  saveUninitialized: true,
  resave: true
}));
app.use(grant);
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(path.join(__dirname, '/public')));

// start app ===============================================
server.listen(port);
require('./backend-app/routes')(app, WCUser, withings, grant, request); // configure our routes
require('./backend-app/socket-events')(io, WCUser, withings, grant, request); // configure socketio events

// frontend routes =========================================================
// route to handle all angular requests
app.get('*', cors(), function(req, res) {
  res.sendFile('/public/index.html', {"root": __dirname});
});

// shoutout to the user
console.log('Express server listening on port: ' + port);

// expose app
exports = module.exports = app;