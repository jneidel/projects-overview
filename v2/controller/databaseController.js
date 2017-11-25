const mongo = require( "mongodb" ).MongoClient,
assert = require( "assert" );

require( "dotenv" ).config( { path: "../var.env" } );

exports.updateDatabase = ( req, res ) => {
    console.log( req.query );

    res.sendStatus( 200 );
};

exports.generateCardId = ( req, res ) => {
    mongo.connect( process.env.DATABASE, ( err, db ) => {
        assert.equal( err, null );

        const query = {},
            projection = { _id: 1 },
            cursor = db.collection( "cards" ).find( query, projection );

        cursor.sort( { _id: -1 } );
        cursor.limit( 1 );

        cursor.forEach( ( doc ) => {
            res.status( 200 );
            res.json( { _id: doc._id + 1 } );
        }, ( err ) => {
            assert.equal( err, null );

            return db.close();
        } );
    } );
};

exports.getUserId = ( req, res ) => {
    mongo.connect( process.env.DATABASE, ( err, db ) => {
        assert.equal( err, null );

        const query = { _id: req.query._id },
            projection = { userid: 1 },
            cursor = db.collection( "cards" ).find( query, projection );

        cursor.forEach( ( doc ) => {
            res.json( { userid: doc.userid } );
        }, ( err ) => {
            assert.equal( err, null );
            return db.close();
        } );
    } );
};

exports.addNewCard = ( req, res ) => {
    mongo.connect( process.env.DATABASE, ( err, db ) => {
        assert.equal( err, null );

        const insertion = { 
                _id: Number(req.query._id),
                title: "",
                front: [],
                back: []
            };
        db.collection( "cards" ).insertOne( insertion );
    } );

    res.sendStatus( 200 );
};
