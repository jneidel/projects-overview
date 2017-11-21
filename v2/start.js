require( "dotenv" ).config( { path: "var.env" } );

const express = require( "express" );
    app = require( "./app" ),
    port = process.env.PORT;

app.set( "port", port );
app.listen( app.get( "port" ), () => {
    console.log( `Server running on port ${port}.` );
} );
