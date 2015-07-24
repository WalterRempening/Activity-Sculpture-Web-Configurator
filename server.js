/**
 * Configurator Backend
 * Setup Express server and routes, initialize passport session,
 * handle connections to database and mongoose models
 * @type {*|exports|module.exports}
 */

// Load modules
var express = require( 'express' );
var app = express();
var passport = require( 'passport' );
var WithingsStrategy = require( 'passport-withings' ).Strategy;
var settings = require( './server/config/settings.json');
var db = require( './server/config/db.json' );
var server = require( 'http' ).Server( app );
var io = require( 'socket.io' )( server );
var mongoose = require( 'mongoose' );
var path = require( 'path' );
var favicon = require( 'serve-favicon' );
var bodyParser = require( 'body-parser' );
var methodOverride = require( 'method-override' );
var csrf = require( 'csurf' );
var session = require( 'express-session' );
var cookieParser = require( 'cookie-parser' );
var MongoStore = require( 'connect-mongo' )( session );
var WCUser = require( './server/models/user' );
var port = process.env.PORT || 3000;

mongoose.connect( db.url );

// configure Express app
app.use( bodyParser.json() );
app.use( bodyParser.json( { type: 'application/vnd.api+json' } ) );
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( cookieParser() );
app.use( favicon( __dirname + '/public/favicon.ico' ) );
app.use( methodOverride( 'X-HTTP-Method-Override' ) );
app.use( express.static( path.join( __dirname, '/public' ) ) );
app.use( session( {
  secret: process.env.COOKIE_SECRET || 'Superdupertopsecret',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore( { mongooseConnection: mongoose.connection } )
} ) );
app.use( csrf() );
app.use( function ( req, res, next ) {
  res.cookie( 'XSRF-TOKEN', req.csrfToken() );
  next();
} );

// configure passport session handling
app.use( passport.initialize() );
app.use( passport.session() );
passport.use( new WithingsStrategy( {
    consumerKey: settings.withings.key,
    consumerSecret: settings.withings.secret,
    callbackURL: settings.withings.callback
  },
  function ( token, tokenSecret, profile, done ) {
    console.log( "Authenticating user" );
    WCUser.findOne( {
      "meta.userid": profile.id
    }, function ( err, dbuser ) {
      if ( err ) throw err;
      if ( !dbuser ) {
        console.log( "User not found, creating new user" );
        WCUser.create( {
          oauth: {
            token: token,
            token_secret: tokenSecret
          },
          meta: {
            userid: profile.id,
            deviceid: profile.deviceid
          }
        }, function ( err, newuser ) {
          if ( err ) throw err;
          return done( err, {
            id: newuser.meta.userid,
            token: newuser.oauth.token,
            secret: newuser.oauth.token_secret
          } );
        } );
      } else {
        return done( err, {
          id: dbuser.meta.userid,
          token: dbuser.oauth.token,
          secret: dbuser.oauth.token_secret
        } );
      }
    } );
  } ) );

passport.serializeUser( function ( user, done ) {
  console.log( "Serialize User " + user.id );
  done( null, user.id );
} );

passport.deserializeUser( function ( id, done ) {
  console.log( "Deserialize User " + id );
  WCUser.findOne( { "meta.userid": id }, function ( err, user ) {
    console.log( "Found user in db:" + id );
    done( err, {
      id: user.meta.userid,
      token: user.oauth.token,
      secret: user.oauth.token_secret
    } );
  } );
} );

// start app
server.listen( port );
require( './server/routes' )( app, passport ); // configure our routes
require( './server/socket-events' )( io ); // configure socketio events

// frontend routes
app.get( '*', function ( req, res ) {
  res.sendFile( '/public/index.html', { "root": __dirname } );
} );

console.log( 'Express server listening on port: ' + port );
exports = module.exports = app;