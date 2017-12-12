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
    key              : process.env.KEY,
    resave           : false,
    saveUninitialized: true,
} ) );
app.use( require( "connect-flash" )() );

app.use( ( req, res, next ) => {
    res.locals.h = require( "./helpers/helpers" );
	res.locals.flashes = req.flash();
    next();
} );

app.use( ( req, res, next ) => {
	req.verifyJwt = require( "./handlers/tokenHandler" );
	return next();
} );

app.use( "/", require( "./routes/index" ) );

app.use( errorHandlers.notFound );
app.use( errorHandlers.flashValidationErrors );
app.use( errorHandlers.developmentErrors );

app.listen( port, () => {
    /* eslint-disable no-console */
    console.log( `Server running on port ${port}.` );
} );
