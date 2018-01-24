const express = require( "express" );
const router = express.Router();
const account = require( "../controllers/accountController" );
const database = require( "../controllers/databaseController" );
const encryption = require( "../controllers/encryptionController" );
const header = require( "../controllers/headerController.js" );
const { catchErrors } = require( "../handlers/errorHandlers" );
const { verifyTokenAPI, setupToken } = require( "../handlers/tokenHandler" );

router.post( "/login",
  encryption.decryptPasswords,
  database.connectDatabase,
  catchErrors( account.login ),
  setupToken
);
router.post( "/register",
  encryption.decryptPasswords,
  encryption.handlePasswords,
  database.connectDatabase,
  account.validateRegister,
  account.checkDublicateUsername,
  catchErrors( account.registerUser ),
  setupToken
);
router.post( "/update",
  verifyTokenAPI,
  database.updateDatabase
);
router.post( "/generate-cardId",
  verifyTokenAPI,
  database.generateCardId
);
router.post( "/add-new-card",
  verifyTokenAPI,
  database.addNewCard
);
router.post( "/getitems",
  verifyTokenAPI,
  database.getItems
);
router.post( "/add-new-item",
  verifyTokenAPI,
  database.addNewItem
);
router.post( "/account-data",
  verifyTokenAPI,
  database.getAccountData
);
router.post( "/update-username",
  verifyTokenAPI,
  database.connectDatabase,
  encryption.decryptPasswords,
  account.updateUsername,
  setupToken
);

router.post( "/remove-item",
  verifyTokenAPI,
  database.connectDatabase,
  database.removeItem
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
