require( "dotenv" ).config( { path: "var.env" } );

const express = require( "express" ),
    bodyParser = require( "body-parser" ),
    passport = require( "passport" ),
    // MongoStore = require( "connect-mongo" )( session ),
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
    secret           : process.env.SECRET,
    key              : process.env.KEY,
    resave           : false,
    saveUninitialized: true,
    cookie           : { secure: false }, // checks for https
    // store: new MongoStore( { mongooseConnection: mongoose.connection } ) -- Implement without mongoose
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
