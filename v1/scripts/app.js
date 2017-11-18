const mongo = require( "mongodb" ).MongoClient,
    assert = require( "assert" );

require( "dotenv" ).config( { path: "../database.env" } );

mongo.connect( process.env.DATABASE, ( db ) => {

} );
