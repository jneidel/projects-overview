const mongoose = require( "mongoose" ),
    bcrypt = require( "bcrypt-nodejs" ),
    validator = require( "validator" );

const userSchema = mongoose.Schema( {
    _id: {
        type: Number
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        validate : [ validator.isEmail, "Invalid Email Address" ],
        required: "Please supply a email address."
    },
    username: {
        type: String,
        lowercase: true,
        unique: true,
        trim: true,
        required: "Please supply a username."
    },
    password: {
        type: String,
        required: "Please supply a password"
    },
    cards: {
        type: Array
    },
    settings: {
        type: Object
    }
} );

/* userSchema.methods.generateHash = ( password ) => {
    return bcrypt.hashSync( password, bcrypt.genSaltSync(8), null );
};

userSchema.methods.validPassword = function( password ) {
    return bcrypt.compareSync( password, this.local.password );
}; */

module.exports = mongoose.model( "User", userSchema );
