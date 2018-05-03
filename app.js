const express = require( "express" );
const bodyParser = require( "body-parser" );
const morgan = require( "morgan" );
const sessions = require( "express-session" );
const flash = require( "connect-flash" );
const errorHandlers = require( "./handlers/error" );

const app = express();

require( "dotenv" ).config( { path: "variables.env" } );

const port = process.env.PORT;
const nodeEnv = process.env.NODE_ENV;

if ( nodeEnv === "dev" ) {
  app.use( morgan( "dev" ) );
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

if ( nodeEnv === "dev" ) {
  app.use( errorHandlers.developmentErrors );
} else {
  app.use( errorHandlers.productionErrors );
}

app.listen( port, () => {
  console.log( `Server running on port ${port}.` ); // eslint-disable-line no-console
} );
