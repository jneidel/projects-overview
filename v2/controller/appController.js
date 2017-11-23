const mongo = require( "mongodb" ).MongoClient,
    assert = require( "assert" );

require( "dotenv" ).config( { path: "../var.env" } );

exports.renderItems = async( req, res ) => {
    res.render( "main", {
        cards: [
            { title: "Programming", frontItems: [ "foo", "baz", "bar" ], backItems: [ "awe", "abc", "efd" ] },
            { title: "Reading", frontItems: [ "foo", "baz", "bar" ], backItems: [ "awe", "abc", "efd" ] },
            { title: "Courses", frontItems: [ "foo", "baz", "bar" ], backItems: [ "awe", "abc", "efd" ] },
            { title: "eBooks", frontItems: [ "foo", "baz", "bar" ], backItems: [ "awe", "abc", "efd" ] },
            { title: "Audiobooks", frontItems: [ "foo", "baz", "bar" ], backItems: [ "awe", "abc", "efd" ] },
        ],
        title: "Project Manager" } );
};

exports.updateDatabase = async( req, res ) => {
    console.log( req.query );

    mongo.connect( process.env.DATABASE, ( err, db ) => {
        assert.equal( err, null );

        const query = {},
            projection = {},
            cursor = db.collection( "test" ).find( query, projection );

        cursor.forEach( ( doc ) => {
            console.log( doc );
        }, ( err ) => {
            assert.equal( err, null );
            return db.close();
        } );
    } );

    res.sendStatus( 200 );
};
