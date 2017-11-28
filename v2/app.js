require( "dotenv" ).config( { path: "var.env" } );

const express = require( "express" ),
    bodyParser = require( "body-parser" ),
    mongoose = require( "mongoose" ),
    passport = require( "passport" ),
    errorHandlers = require( "./handlers/errorHandlers" ),
    app = express(),
    port = process.env.PORT;
    
app.set( "view engine", "pug" );
app.set( "views", `${__dirname}/views` );

app.use( express.static( `${__dirname}/public` ) );

app.use( require( "morgan" )( "dev" ) );

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( require( "cookie-parser" )() );

app.use( require( "express-validator" )() );

app.use( require( "express-session" )( { 
    secret           : "test",
    resave           : false,
    saveUninitialized: false
} ) );

require( "./models/passport" );
app.use( passport.initialize() );
app.use( passport.session() );

app.use( require( "connect-flash" )() );

app.use( ( req, res, next ) => {
    res.locals.h = require( "./helpers/helpers" );
    res.locals.flashes = req.flash();
    next();
} );

app.use( "/", require( "./routes/index" ) );

app.use( errorHandlers.notFound );
app.use( errorHandlers.flashValidationErrors );
app.use( errorHandlers.developmentErrors );

app.set( "port", port );
app.listen( port, () => {
    console.log( `Server running on port ${port}.` );
} );
