const express = require( "express" ),
    router = express.Router(),
    appController = require( "../controller/appController" );

router.get( "/", appController.renderItems );
router.post( "/api", appController.updateDatabase );

module.exports = router;
