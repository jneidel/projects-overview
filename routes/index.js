const express = require( "express" );
const router = express.Router();
const app = require( "../controllers/app" );
const header = require( "../controllers/header" );
const database = require( "../controllers/database" );
const { verifyToken, verifyTokenThrow } = require( "../handlers/token" );
const checkForApiKey = require( "../handlers/api-key" );

router.get( "/app",
  verifyTokenThrow,
  database.connectDatabase,
  database.getCards,
  app.app
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
  verifyTokenThrow,
  database.connectDatabase,
  checkForApiKey,
  app.account
);
router.get( "/",
  verifyToken,
  app.welcome
);
router.get( "/logout",
  header.removeCookie,
  app.logout
);
router.get( "/help",
  verifyToken,
  app.help
);

module.exports = router;
