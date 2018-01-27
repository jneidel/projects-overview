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
  account.login,
  setupToken
);
router.post( "/register",
  encryption.decryptPasswords,
  encryption.hashPassword,
  database.connectDatabase,
  account.validateRegister,
  account.registerUser,
  setupToken
);
router.post( "/update",
  verifyTokenAPI,
  database.connectDatabase,
  database.updateDatabase
);
router.post( "/generate-card-id",
  verifyTokenAPI,
  database.connectDatabase,
  database.generateCardId
);
router.post( "/add-new-card",
  verifyTokenAPI,
  database.connectDatabase,
  database.addNewCard
);
router.post( "/add-new-item",
  verifyTokenAPI,
  database.connectDatabase,
  database.addNewItem
);
router.post( "/update-username",
  verifyTokenAPI,
  database.connectDatabase,
  encryption.decryptPasswords,
  account.updateUsername,
  setupToken
);
/* router.post( "/update-password",
  verifyTokenAPI,
  database.connectDatabase,
  encryption.decryptPasswords,
  account.updateUsername
); */
router.post( "/remove-item",
  verifyTokenAPI,
  database.connectDatabase,
  database.removeItem
);
router.post( "/switch-item",
  verifyTokenAPI,
  database.connectDatabase,
  database.removeItem,
  database.appendItemToOtherSide
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
