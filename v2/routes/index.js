const express = require( "express" ),
    router = express.Router(),
    appController = require( "../controller/appController" );

router.get( "/", appController.renderList );

module.exports = router;
