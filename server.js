// server.js

// modules =================================================
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
//var mongoose = require('mongoose');
//var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cors = require('cors');

// configuration ===========================================
var db = require('./config/db');
var port = process.env.PORT || 3000;

// connect to our mongoDB database
// don't forget to initialize mongodb first
//mongoose.connect(db.url);

// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());
// parse application/vnd.api+json as json
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// select favicon
//app.use(favicon(__dirname + '/public/favicon.ico'));
// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));
// set the static files location /public/img will be /img for users
app.use(express.static(path.join(__dirname, '/public')));
// start app ===============================================
// startup our app at http://localhost:8080
server.listen(port);
require('./backend-app/routes')(app); // configure our routes
require('./backend-app/socket-events')(io); // configure socketio events

// frontend routes =========================================================
// route to handle all angular requests
app.get('*', cors(), function(req, res) {
    res.sendFile('/public/index.html', {"root" : __dirname });
});

// shoutout to the user
console.log('Magic happens on port ' + port);

// expose app
exports = module.exports = app;