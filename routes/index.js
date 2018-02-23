const express = require( "express" );
const router = express.Router();
const app = require( "../controllers/appController" );
const header = require( "../controllers/headerController" );
const database = require( "../controllers/databaseController" );
const { verifyToken, verifyTokenThrow } = require( "../handlers/tokenHandler" );

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
