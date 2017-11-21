const express = require( "express" ),
    router = express.Router(),
    appController = require( "../controller/appController" );

router.get( "/", appController.renderItems );
router.post( "/api/update", appController.updateDatabase );
// router.post( "/api/data" );

module.exports = router;
