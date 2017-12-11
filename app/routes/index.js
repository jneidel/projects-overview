const express = require( "express" );
const router = express.Router();
const appController = require( "../controllers/appController" );
const accountController = require( "../controllers/accountController" );
const databaseController = require( "../controllers/databaseController" );
const { catchErrors } = require( "../handlers/errorHandlers" );

router.get( "/", appController.renderItems );

// Account
router.get( "/login", appController.login );
router.get( "/register", appController.register );
router.post( "/register",
    accountController.validateRegister,
    accountController.register
);
router.get( "/logout", appController.logout );
router.get( "/account", appController.account );

// API
router.post( "/api/login", catchErrors( accountController.login ) );
router.post( "/api/update", databaseController.updateDatabase );
router.get( "/api/generate-cardId", databaseController.generateCardId );
router.post( "/api/add-new-card", databaseController.addNewCard );
router.get( "/api/get-userid", databaseController.getUserId );
router.get( "/api/userdata", databaseController.getUserdata );

module.exports = router;
