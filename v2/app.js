require( "dotenv" ).config( { path: "var.env" } );

const express = require( "express" ),
    validator = require( "express-validator" ),
    sessions = require( "express-session" ),
    bodyParser = require( "body-parser" ),
    cookieParser = require( "cookie-parser" ),
    morgan = require( "morgan" ),
    passport = require( "passport" ),
    mongoose = require( "mongoose" ),
    flash = require( "connect-flash" ),
    helpers = require( "./helpers/helpers" ),
    errorHandlers = require( "./handlers/errorHandlers" ),
    app = express(),
    port = process.env.PORT;
    
app.set( "view engine", "pug" );
app.set( "views", `${__dirname}/views` );

app.use( express.static( `${__dirname}/public` ) );

app.use( morgan( "dev" ) );

require( "./models/User" );
/* require( "./models/passport" ); */

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( cookieParser() );

app.use( validator() );

app.use( sessions( { 
    secret           : "test",
    resave           : false,
    saveUninitialized: false
} ) );

app.use( passport.initialize() );
app.use( passport.session() );

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

mongoose.connect( process.env.DATABASE, { useMongoClient: true } );
mongoose.Promise = global.Promise;
mongoose.connection.on( "error", ( err ) => {
    console.error( `There was a error connection to mongodb - ${err.message}` );
} );

app.set( "port", port );
app.listen( port, () => {
    console.log( `Server running on port ${port}.` );
} );
