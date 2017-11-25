const express = require( "express" ),
    app = express(),
    bodyParser = require( "body-parser" ),
    helpers = require( "./helpers/helpers" ),
    validator = require( "express-validator" ),
    flash = require( "connect-flash" ),
    errorHandlers = require( "./handlers/errorHandlers" );

app.set( "view engine", "pug" );
app.set( "views", `${__dirname}/views` );

app.use( express.static( `${__dirname}/public` ) );

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: true } ) );

app.use( validator() );

app.use( flash() );

app.use( ( req, res, next ) => {
    res.locals.h = helpers;
    res.locals.flashes = req.flash();
    next();
} );

app.use( "/", require( "./routes/index" ) );

app.use( errorHandlers.notFound );
app.use( errorHandlers.flashValidationErrors );
app.use( errorHandlers.developmentErrors );

module.exports = app;
