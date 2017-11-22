const express = require( "express" ),
    app = express(),
    bodyParser = require( "body-parser" ),
    helpers = require( "./helpers/helpers" );

app.set( "view engine", "pug" );
app.set( "views", `${__dirname}/views` );

app.use( express.static( `${__dirname}/public` ) );

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: true } ) );

app.use( ( req, res, next ) => {
    res.locals.h = helpers;
    next();
} );

app.use( "/", require( "./routes/index" ) );

module.exports = app;
