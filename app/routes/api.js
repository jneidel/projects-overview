const express = require( "express" );
const router = express.Router();
const accountController = require( "../controllers/accountController" );
const databaseController = require( "../controllers/databaseController" );
const encryptionController = require( "../controllers/encryptionController" );
const { catchErrors } = require( "../handlers/errorHandlers" );

router.post( "/login",
  encryptionController.decryptBody,
  catchErrors( accountController.login ),
  encryptionController.generateToken
);
router.post( "/register",
  encryptionController.decryptBody,
  accountController.validateRegister,
  catchErrors( accountController.register ),
  encryptionController.generateToken
);
router.post( "/update",
  encryptionController.verifyToken,
  databaseController.updateDatabase
);
router.post( "/generate-cardId",
  encryptionController.verifyToken,
  databaseController.generateCardId
);
router.post( "/add-new-card",
  encryptionController.verifyToken,
  databaseController.addNewCard
);
router.post( "/getitems",
  encryptionController.verifyToken,
  databaseController.getItems
);
router.post( "/add-new-item",
  encryptionController.verifyToken,
  databaseController.addNewItem
);
router.post( "/account-data",
  encryptionController.verifyToken,
  databaseController.getAccountData
);
router.post( "/update-username",
  encryptionController.verifyToken,
  accountController.updateUsername,
  encryptionController.generateToken
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
