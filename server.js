// set up =====================================

var express = require( 'express' );
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require( 'mongoose' );
var passport = require( 'passport' );
var flash = require( 'connect-flash' );

var cookieParser = require( 'cookie-parser' );
var bodyParser   = require( 'body-parser' );
var session      = require( 'express-session' );

var configDB = require( './config/database.js' );


// Configuration ==============================
mongoose.connect( configDB.url );

require( './config/passport' )( passport );

// Express
app.set( 'view engine', 'ejs' );
app.set( 'views', __dirname + '/public/views' );

app.use( express.static( __dirname + '/public' ) );

app.use( cookieParser() ); // read cookies (needed for auth)
app.use( bodyParser() ); // get information from html forms


// required for passport
app.use( session({ secret: 'ilovescotchscotchyscotchscotch' }) ); // session secret
app.use( passport.initialize() );
app.use( passport.session() ); // persistent login sessions
app.use( flash() ); // use connect-flash for flash messages stored in session

app.use(function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    next();
});

// routes ======================================================================
require( './app/routes.js' )( app, passport ); // load our routes and pass in our app and fully configured passport

// Listen =====================================

app.listen( port );
console.log( 'App listening on port ' + port );
