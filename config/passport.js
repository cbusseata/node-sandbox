var LocalStrategy    = require( 'passport-local').Strategy;
var FacebookStrategy = require( 'passport-facebook' ).Strategy;
var TwitterStrategy = require( 'passport-twitter' ).Strategy;
var GoogleStrategy = require( 'passport-google-oauth' ).OAuth2Strategy;

var appRoot = require('app-root-path');
var User = require(appRoot.path + '/app/models/user');

// Load auth variables for other means of authentication
var configAuth = require( appRoot.path + '/config/auth' );

module.exports = function( passport ) {
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    passport.serializeUser(function( user, done ) {
        done( null, user.id );
    });

    passport.deserializeUser(function( id, done ) {
        User.findById(id, function( err, user ) {
            done( err, user );
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use( 'local-login', new LocalStrategy({
        // by default, local strategy uses username and password
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function( req, email, password, done ) {
        User.findOne({ 'local.email' : email }, function( err, user ) {
            // if there are any errors, return the error before anything else
            if (err) return done(err);

            // if no user is found, return the message
            if (!user) {
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            }

            var done1 = done;
            user.validPassword(password, function(error, valid) {
                if (error) {
                    // create the loginMessage and save it to session as flashdata
                    return done1(null, false, req.flash('loginMessage', 'Oops! Something went wrong.'));
                }

                if (!valid) {
                    return done1(null, false, req.flash('loginMessage', 'Oops!  Wrong email or password.'));
                }

                // all is well, return successful user
                return done1(null, user);
            });
        });
    }));

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================

    passport.use(new FacebookStrategy({
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields   : [ 'email' , 'name' ]
    },
    // facebook will send back the token and profile
    function( token, refreshToken, profile, done ) {

        // asynchronous
        process.nextTick(function() {
            // find the user in the database based on their facebook ID
            User.findOne({ 'facebook.id' : profile.id }, function( err, user ) {
                // if there are any errors, return the error before anything else
                if (err) return done(err);

                // if the user is found, log them in
                if (user) {
                    return done(null, user);
                } else {
                    // if there is no user found with that facebook ID, create them
                    var newUser = new User();

                    newUser.facebook.id = profile.id;
                    newUser.facebook.token = token;

                    // look at the passport user profile to see how names are returned
                    newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;

                    // facebook can return multiple emails so we'll take the first
                    newUser.facebook.email = profile.emails[0].value;

                    // save our user to the database
                    newUser.save(function(err) {
                        if (err) throw err;

                        return done(null, newUser);
                    });
                }
            });
        });
    }));

    // =========================================================================
    // TWITTER =================================================================
    // =========================================================================

    passport.use(new TwitterStrategy({
        consumerKey     : configAuth.twitterAuth.consumerKey,
        consumerSecret  : configAuth.twitterAuth.consumerSecret,
        callbackURL     : configAuth.twitterAuth.callbackURL
    },
    function( token, tokenSecret, profile, done ) {
        process.nextTick(function() {
            // find the user in the database using their google ID
            User.findOne({ 'twitter.id' : profile.id }, function( err, user ) {
                // if there are any errors, return the error before anything else
                if (err) return done(err);

                // if the user is found, log them in
                if (user) {
                    return done(null, user);
                } else {
                    // if there is no user found with that facebook ID, create them
                    var newUser = new User();

                    newUser.twitter.id = profile.id;
                    newUser.twitter.token = token;
                    newUser.twitter.name  = profile.username;
                    newUser.twitter.displayName = profile.displayName;

                    // save our user to the database
                    newUser.save(function( err ) {
                        if ( err ) throw err;

                        return done( null, newUser );
                    });
                }
            });
        });
    }));

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================

    passport.use(new GoogleStrategy({
        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL
    },
    function( token, refreshToken, profile, done ) {
        process.nextTick(function() {
            // find the user in the database using their google ID
            User.findOne({ 'google.id' : profile.id }, function( err, user ) {
                // if there are any errors, return the error before anything else
                if (err) return done(err);

                // if the user is found, log them in
                if (user) {
                    return done(null, user);
                } else {
                    // if there is no user found with that facebook ID, create them
                    var newUser = new User();

                    newUser.google.id = profile.id;
                    newUser.google.token = token;
                    newUser.google.name  = profile.displayName;
                    newUser.facebook.email = profile.emails[0].value;

                    // save our user to the database
                    newUser.save(function( err ) {
                        if ( err ) throw err;

                        return done( null, newUser );
                    });
                }
            });
        });
    }));
};