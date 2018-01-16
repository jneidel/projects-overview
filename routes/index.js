const express = require( "express" );
const router = express.Router();
const app = require( "../controllers/appController" );
const header = require( "../controllers/headerController" );
const database = require( "../controllers/databaseController" );
const { verifyToken } = require( "../handlers/tokenHandler" );

router.get( "/app",
  verifyToken,
  database.connectDatabase,
  database.getCards,
  app.renderApp
);
router.get( "/login", 
  verifyToken,
  app.login
);
router.get( "/register",
  verifyToken,
  app.register
);
router.get( "/account",
  verifyToken,
  app.account
);
router.get( "/",
  app.welcome
);
router.get( "/logout",
  header.removeCookie,
  app.logout
);

module.exports = router;
