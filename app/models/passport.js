const passport = require( "passport" ),
    Strategy = require( "passport-local" ),
    mongo = require( "mongodb" ).MongoClient,
    assert = require( "assert" ),
    md5 = require( "md5" );

require( "dotenv" ).config( { path: "../var.env" } );

/*
Strategy( {
    usernameField: "email"
}, ( username, password, done ) => )
*/

passport.use( new Strategy( ( username, password, done ) => {
    mongo.connect( process.env.DATABASE, ( err, db ) => {
        assert.equal( err, null );
        console.log( "Connected to mongodb for local strat" );

        console.log( username );

        db.collection( "users" ).find( { username } ).toArray( ( err, docs ) => {
            if ( err ) return done( err );
            if ( !docs || docs.length === 0 ) return done( null, false, { message: "Incorrect username." } );
            if ( docs[0].password !== md5( password ) ) return done( null, false, { message: "Incorrect password." } );
            console.log( `Found user: ${username}` );
            done( null, docs[0] );
            return db.close();
        } );
    } );
} ) );

passport.serializeUser( ( user, done ) => {
    done( null, user._id );
} );
passport.deserializeUser( ( _id, done ) => {
    mongo.connect( process.env.DATABASE, ( err, db ) => {
        assert.equal( err, null );
        console.log( "Connected to mongodb to deserialize" );

        db.collection( "users" ).find( { _id } ).toArray( ( err, docs ) => {
            if ( err ) return done( err );
            if ( docs.length === 0 ) return done( null, false );
            console.log( `Found user: ${username}` );
            done( null, docs[0] );
            return db.close();
        } );
    } );
} );

module.exports = passport;
