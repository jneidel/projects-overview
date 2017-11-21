const express = require( "express" ),
    app = express();

app.set( "view engine", "pug" );
app.set( "views", `${__dirname}/views` );

app.use( "/", require( "./routes/index" ) );

module.exports = app;
