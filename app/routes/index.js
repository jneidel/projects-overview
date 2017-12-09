const express = require( "express" ),
    router = express.Router(),
    passport = require( "passport" ),
    appController = require( "../controllers/appController" ),
    accountController = require( "../controllers/accountController" ),
    databaseController = require( "../controllers/databaseController" ),
    { catchErrors } = require( "../handlers/errorHandlers" ),
    ensureLogin = require( "connect-ensure-login" );

router.get( "/", appController.renderItems );

router.get( "/key", ( req, res ) => {
    try {
        const fs = require("fs");
        const rsa = require("node-rsa");
        const atob = require("atob")

        fs.readFile( "./private-key.pem", ( err, privateKey ) => {
            if ( err ) return console.log( err );
                
            const key = new rsa();
            key.importKey( privateKey, "pkcs1-private-pem" );

            console.log( key.decrypt( atob(req.query.key), "utf8" ))
        } )
    } catch (error) {
        console.log(error)
    }
    
    res.sendStatus(200)
} )

// Account
router.get( "/login", appController.login );
router.get( "/register", appController.register );
router.post( "/register",
    accountController.validateRegister,
    accountController.register,
    passport.authenticate( "local", {
        failureRedirect          : "/login",
        failureFlash             : true,
        successFlash             : "You successfully logged in.",
        successReturnToOrRedirect: "/login",
    } )
);
router.get( "/logout", ( req, res ) => {
    req.logout();
    req.flash( "success", "Successfully logged out." );
    res.redirect( "/login" );
} );

// API
router.post( "/api/login", accountController.login );
router.post( "/api/update", databaseController.updateDatabase );
router.get( "/api/generate-cardId", databaseController.generateCardId );
router.post( "/api/add-new-card", databaseController.addNewCard );
router.get( "/api/get-userid", databaseController.getUserId );

module.exports = router;
