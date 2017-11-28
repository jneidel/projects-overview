const mongo = require( "mongodb" ).MongoClient,
    assert = require( "assert" ),
    md5 = require( "md5" );

require( "dotenv" ).config( { path: "../var.env" } );

exports.validateRegister = ( req, res, next ) => {
    req.checkBody( "username", "Please supply a username." ).notEmpty();
    req.sanitizeBody( "username" );
    req.checkBody( "email", "Please supply a valid email address." ).isEmail();
    req.sanitizeBody( "email" ).normalizeEmail( {
        remove_dots            : false,
        remove_extension       : false,
        gmail_remove_subaddress: false,
    } );
    req.checkBody( "password", "Please supply a password." ).notEmpty();
    req.checkBody( "password-confirm", "Please supply a confirm password." ).notEmpty();
    req.checkBody( "password-confirm", "Your passwords do not match." ).equals( req.body.password );

    const errors = req.validationErrors();
    if ( errors ) {
        req.flash( "error", errors.map( err => err.msg ) );
        res.render( "register", {
            title: "Register", 
            body: req.body,
            flashes: req.flash() 
        } );
        return;
    }
    return next();
};

exports.register = ( req, res ) => {
    mongo.connect( process.env.DATABASE, ( err, db ) => {
        assert.equal( err, null );
        console.log( "Connected to mongodb for register" );

        const doc = {
            username: req.body.username.trim().toLowerCase(),
            email: req.body.email.trim().toLowerCase(),
            password: md5( req.body.password )
        }

        db.collection( "users" ).insertOne( doc, function(err, result) {
            if ( err || result.result.ok != 1 ) {
                req.flash( "error", "Account could not be registered." );
                return;
            }
            req.flash( "success", "Successfully registerd." );
            res.render( "register", { title: "Login" } );
        } );
    } );
};

exports.login = ( req, res ) => {
    req.flash( "success", "Successfully logged in." );
    res.render( "login", { title: "Login" } );
};

/* exports.isLoggedIn = (req, res, next) => {
    if ( req.isAuthenticated() ) return next();
    
    req.flash( "error", "You must be logged in to visit this page." );
    res.redirect( "back" );
}; */