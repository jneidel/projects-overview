const express = require( "express" );
const router = express.Router();
const appController = require( "../controllers/appController" );
const accountController = require( "../controllers/accountController" );
const databaseController = require( "../controllers/databaseController" );
const { catchErrors } = require( "../handlers/errorHandlers" );

router.get( "/app", appController.renderItems );
router.get( "/", appController.welcome );

router.get( "/login", appController.login );
router.get( "/register", appController.register );
router.get( "/logout", appController.logout );
router.get( "/account", appController.account );

module.exports = router;
