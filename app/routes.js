module.exports = function( app, passport ) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get( '/', function(req, res) {
        res.render( 'index' );
    });

    // =====================================
    // PROFILE PAGE ========================
    // =====================================
    app.get( '/profile', function(req, res) {
        res.render( 'profile' );
    });

    // =====================================
    // LOGIN PAGE (with login links) =======
    // =====================================
    app.get( '/login', function(req, res) {
        if (req.isAuthenticated()) {
            res.redirect( '/' );
        }

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post( '/login', passport.authenticate( 'local-login', {
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get( '/auth/facebook', passport.authenticate( 'facebook', { scope : [ 'email' ] }));

    // handle the callback after facebook has authenticated the user
    app.get( '/auth/facebook/callback', passport.authenticate( 'facebook', {
        successRedirect : '/profile',
        failureRedirect : '/',
        failureFlash : true // allow flash messages
    }));

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // TWITTER ROUTES ======================
    // =====================================
    app.get( '/auth/twitter', passport.authenticate( 'twitter' ));

    // handle the callback after twitter has authenticated the user
    app.get( '/auth/twitter/callback', passport.authenticate( 'twitter', {
        successRedirect: '/profile',
        failureRedirect: '/'
    }));

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    app.get( '/auth/google', passport.authenticate( 'google', { scope : [ 'profile', 'email' ] }));

    // the callback after google has authenticated the user
    app.get( '/auth/google/callback', passport.authenticate( 'google', {
        successRedirect: '/profile',
        failureRedirect: '/'
    }));

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // CATCH ALL (HOME PAGE) ===============
    // =====================================
    app.get( '*', function(req, res) {
        res.render( 'index' );
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }

    // if they aren't redirect them to the home page
    res.redirect('/');
}