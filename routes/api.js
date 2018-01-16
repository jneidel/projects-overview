const express = require( "express" );
const router = express.Router();
const account = require( "../controllers/accountController" );
const database = require( "../controllers/databaseController" );
const encryption = require( "../controllers/encryptionController" );
const header = require( "../controllers/headerController.js" );
const { catchErrors } = require( "../handlers/errorHandlers" );
const { verifyToken } = require( "../handlers/tokenHandler" );

router.post( "/login",
  encryption.decryptBody,
  database.connectDatabase,
  encryption.handlePasswords,
  catchErrors( account.login ),
  encryption.generateToken,
  encryption.encryptToken,
  header.createCookie
);
router.post( "/register",
  encryption.decryptBody,
  database.connectDatabase,
  account.validateRegister,
  // account.checkDublicateUsername,
  catchErrors( account.registerUser ),
  encryption.generateToken,
  encryption.encryptToken,
  header.createCookie
);
router.post( "/update",
  encryption.verifyToken,
  database.updateDatabase
);
router.post( "/generate-cardId",
  encryption.verifyToken,
  database.generateCardId
);
router.post( "/add-new-card",
  encryption.verifyToken,
  database.addNewCard
);
router.post( "/getitems",
  encryption.verifyToken,
  database.getItems
);
router.post( "/add-new-item",
  encryption.verifyToken,
  database.addNewItem
);
router.post( "/account-data",
  encryption.verifyToken,
  database.getAccountData
);
router.post( "/update-username",
  encryption.verifyToken,
  account.updateUsername,
  encryption.generateToken
);

router.get( "/", ( req, res ) => {
  req.flash( "error", "Access to the API denied." );
  res.redirect( "/login" );
} );
router.get( "/:anything", ( req, res ) => {
  req.flash( "error", "Access to the API denied." );
  res.redirect( "/login" );
} );

module.exports = router;
