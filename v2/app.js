const express = require( "express" ),
    app = express(),
    bodyParser = require( "body-parser" );

app.set( "view engine", "pug" );
app.set( "views", `${__dirname}/views` );

app.use( express.static( `${__dirname}/public` ) );

app.use( bodyParser.json() );

app.use( "/", require( "./routes/index" ) );

module.exports = app;
