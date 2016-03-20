var should = require('should');

var appRoot = require('app-root-path');
var User = require(appRoot.path + '/app/models/user');
var newUser = new User();

describe( 'newUser', function() {

    describe( '#generateHash()', function() {
        it( 'can generate a password hash', function( done ) {
            var hash = newUser.generateHash( 'myPassword', function( err, hash ) {
                if (err) throw err;

                hash.length.should.equal(60);
                done();
            });
        });
    });

    describe( '#validPassword()', function() {
        it( 'will validate a valid password', function( done ) {
            newUser.local.password = '$2a$08$UyyXFIqC392LAmQOpW2PceBidu8UKf8pHxjxf9ytM4llCUGitIEV.';
            newUser.validPassword( 'myPassword', function( err, valid ) {
                if (err) throw err;

                valid.should.equal(true);
                done();
            });
        });

        it( 'will not validate an invalid password', function( done ) {
            newUser.local.password = '$2a$08$UyyXFIqC392LAmQOpW2PceBidu8UKf8pHxjxf9ytM4llCUGitIEV.';
            newUser.validPassword( 'my_password', function( err, valid ) {
                if (err) throw err;

                valid.should.equal(false);
                done();
            });
        });
    });

});
