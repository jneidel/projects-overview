const express = require( "express" );
const bodyParser = require( "body-parser" );
const errorHandlers = require( "./handlers/errorHandlers" );

const app = express();

require( "dotenv" ).config( { path: "variables.env" } );

const port = process.env.PORT;

app.use( require( "morgan" )( "dev" ) );

app.set( "view engine", "pug" );
app.set( "views", `${__dirname}/views` );
app.use( express.static( `${__dirname}/public` ) );

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: true } ) );

app.use( require( "express-validator" )() );

app.use( require( "express-session" )( {
  secret           : process.env.SECRET,
  key              : "project-manager",
  resave           : false,
  saveUninitialized: true,
} ) );
app.use( require( "connect-flash" )() );

app.use( ( req, res, next ) => {
  res.locals.h = require( "./helpers/helpers" ); // eslint-disable-line global-require
  res.locals.flashes = req.flash();
  next();
} );

app.use( ( req, res, next ) => {
  req.verifyJwt = require( "./handlers/tokenHandler" ); // eslint-disable-line global-require
  return next();
} );

app.use( "/", require( "./routes/index" ) );
app.use( "/api", require( "./routes/api" ) );

app.use( errorHandlers.notFound );
app.use( errorHandlers.flashValidationErrors );
app.use( errorHandlers.displayErrorMsg );
app.use( errorHandlers.developmentErrors );

app.listen( port, () => {
  console.log( `Server running on port ${port}.` ); // eslint-disable-line no-console
} );
