const express = require( "express" ),
    router = express.Router(),
    appController = require( "../controller/appController" );

router.get( "/", appController.renderItems );
router.post( "/api/update", appController.updateDatabase );
router.get( "/api/generate-userid", appController.generateCardId );
router.post( "/api/add-new-card", appController.addNewCard );
// router.post( "/api/data" );

module.exports = router;
