const mongo = require( "mongodb" ).MongoClient,
    assert = require( "assert" );

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
    res.send("Works");
};

exports.login = ( req, res ) => {
    res.send("Works");
};

/* exports.isLoggedIn = (req, res, next) => {
    if ( req.isAuthenticated() ) return next();
    
    req.flash( "error", "You must be logged in to visit this page." );
    res.redirect( "back" );
}; */