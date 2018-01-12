const express = require( "express" );
const router = express.Router();
const app = require( "../controllers/appController" );
const header = require( "../controllers/headerController.js" );
const encryption = require( "../controllers/encryptionController" );
const database = require( "../controllers/databaseController" );
const { catchErrors } = require( "../handlers/errorHandlers" );

router.get( "/app", 
  header.parseCookie,
  encryption.decryptToken,
  encryption.verifyToken,
  database.connectDatabase,
  database.getCards,
  app.renderItems
);
router.get( "/", app.welcome );

router.get( "/login", app.login );
router.get( "/register", app.register );
router.get( "/logout", app.logout );
router.get( "/account", app.account );

module.exports = router;
