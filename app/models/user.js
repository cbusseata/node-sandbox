var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});

userSchema.methods.generateHash = function( password, callback ) {
    return bcrypt.hash( password, bcrypt.genSaltSync(8), null, callback );
};

userSchema.methods.validPassword = function( password, callback ) {
    bcrypt.compare( password, this.local.password, callback );
};

module.exports = mongoose.model( 'User', userSchema );