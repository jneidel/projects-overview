const express = require( "express" );
const bodyParser = require( "body-parser" );
const sessions = require( "express-session" );
const flash = require( "connect-flash" );
const errorHandlers = require( "./handlers/error" );
const logger = require( "./logs/logger" );

const app = express();

require( "dotenv" ).config( { path: "variables.env" } );

const port = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;

if ( NODE_ENV === "dev" ) {
  app.use( logger.dev );
} if ( NODE_ENV === "prod" ) {
  app.use( logger.writeErrors );
  app.use( logger.writeRequests );
}

app.set( "view engine", "pug" );
app.set( "views", `${__dirname}/src/pug` );
app.use( express.static( `${__dirname}/dist` ) );

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: true } ) );

app.use( sessions( { // For flashes
  secret           : process.env.SECRET,
  key              : "projects-overview",
  resave           : false,
  saveUninitialized: true,
} ) );
app.use( flash() );

app.use( ( req, res, next ) => {
  res.locals.h = require( "./helpers" ); // eslint-disable-line global-require
  res.locals.flashes = req.flash();
  return next();
} );

app.use( "/", require( "./routes" ) );
app.use( "/api", require( "./routes/api" ) );
app.use( "/api/public", require( "./routes/api-public" ) );

process.on( "unhandledRejection", ( err ) => { throw err; } );

app.use( errorHandlers.notFound );
app.use( errorHandlers.flashValidationErrors );

if ( NODE_ENV === "dev" ) {
  app.use( errorHandlers.developmentErrors );
} else {
  app.use( errorHandlers.productionErrors );
}

app.listen( port, () => {
  console.log( `Server running on port ${port}.` ); // eslint-disable-line no-console
} );
