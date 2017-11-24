const mongo = require( "mongodb" ).MongoClient,
    assert = require( "assert" );

require( "dotenv" ).config( { path: "../var.env" } );

exports.renderItems = ( req, res ) => {
    const userid = 1;

    mongo.connect( process.env.DATABASE, ( err, db ) => {
        assert.equal( err, null );

        const cards = [],
            query = { userid },
            projection = { _id: 1, title: 1, front: 1, back: 1, position: 1 },
            cursor = db.collection( "cards" ).find( query, projection );

        cursor.sort( { position: 1 } );

        cursor.forEach( ( doc ) => {
            cards.push( doc );
        }, ( err ) => {
            assert.equal( err, null );

            res.render( "main", {
                cards,
                title: "Project Manager",
            } );

            return db.close();
        } );
    } );
};

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
