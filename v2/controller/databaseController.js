const mongo = require( "mongodb" ).MongoClient,
    assert = require( "assert" );

require( "dotenv" ).config( { path: "../var.env" } );

exports.updateDatabase = ( req, res ) => {
    const query = {},
        update = {};

    if ( req.query.updatedItem === undefined ) {
        query.userid = req.query.userId;
        query.title = req.query.title;
        update.$set = { title: req.query.updatedTitle };
    } else {
        query.userid = req.query.userId;
        query.title = req.query.title;
        query[ req.query.cardSide ] = req.query.oldItem;
        const setObj = {};
        setObj[ req.query.cardSide + ".$" ] = req.query.updatedItem;
        update.$set = setObj;
    }

    mongo.connect( process.env.DATABASE, ( err, db ) => {
        assert.equal( err, null );

        console.log( query, update )

        db.collection( "cards" ).updateOne( query, update, ( err, res ) => {
            if ( err ) {
                console.log(err)
                return err;
            }
            console.log( res.result )
        } );
    } );
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
                _id  : Number( req.query._id ),
                title: "",
                front: [],
                back : [],
            };
        db.collection( "cards" ).insertOne( insertion );
    } );

    res.sendStatus( 200 );
};
