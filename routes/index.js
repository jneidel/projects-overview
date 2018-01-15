const express = require( "express" );
const router = express.Router();
const app = require( "../controllers/appController" );
const header = require( "../controllers/headerController.js" );
const encryption = require( "../controllers/encryptionController" );
const database = require( "../controllers/databaseController" );
const { catchErrors } = require( "../handlers/errorHandlers" );

async function parseDecryptVerifyToken( req, res, next ) {
  try {
    header.parseCookie( req, res, () => {} );
    await encryption.decryptToken( req, res, () => {} );
    await encryption.verifyToken( req, res, next );
  } catch ( e ) { // no cookie available
    req.body.username = undefined;
    next();
  }
}

router.get( "/app",
  parseDecryptVerifyToken,
  database.connectDatabase,
  database.getCards,
  app.renderApp
);
router.get( "/login", 
  parseDecryptVerifyToken,
  app.login
);
router.get( "/register",
  parseDecryptVerifyToken,
  app.register
);
router.get( "/account",
  parseDecryptVerifyToken,
  app.account
);
router.get( "/",
  app.welcome
);
router.get( "/logout", app.logout );

module.exports = router;
