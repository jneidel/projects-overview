const mongo = require( "mongodb" ).MongoClient;
const assert = require( "assert" );

require( "dotenv" ).config( { path: "../variables.env" } );

exports.updateDatabase = async ( req, res, next ) => {
    const query = {};
    const update = {};

    if ( req.query.updatedItem === undefined ) {
        query.userid = req.query.userId;
        query.title = req.query.title;

        update.$set = { title: req.query.updatedTitle };
    } else {
        query.userid = req.query.userId;
        query.title = req.query.title;
        query[req.query.cardSide] = req.query.oldItem;

        const setObj = {};
        setObj[`${req.query.cardSide}.$`] = req.query.updatedItem;
        update.$set = setObj;
    }

    const db = await mongo.connect( process.env.DATABASE );

    const response = await db.collection( "cards" ).updateOne( query, update );
    if ( response.result.ok != 1 ) {
        next( new Error( "Insertion Error" ) );
    }
};

exports.generateCardId = async ( req, res, next ) => {
    const db = await mongo.connect( process.env.DATABASE );

    const query = {};
    const projection = { _id: 1 };

    const cursor = db.collection( "cards" ).find( query, projection );
    cursor.sort( { _id: -1 } );
    cursor.limit( 1 );

    cursor.forEach( ( doc ) => {
        res.status( 200 );
        res.json( { _id: doc._id + 1 } );
    }, ( err ) => {
        assert.equal( err, null );
        return db.close();
    } );
};

exports.getUserId = async ( req, res, next ) => {
    const db = await mongo.connect( process.env.DATABASE );

    const query = { _id: req.query._id };
    const projection = { userid: 1 };

    const cursor = db.collection( "cards" ).find( query, projection );

    cursor.forEach( ( doc ) => {
        res.json( { userid: doc.userid } );
    }, ( err ) => {
        assert.equal( err, null );
        return db.close();
    } );
};

exports.addNewCard = async ( req, res, next ) => {
    const db = await mongo.connect( process.env.DATABASE );

    const insertion = {
        _id   : Number( req.query._id ),
        title : "",
        front : [ "" ],
        back  : [ "" ],
        userid: "1",
    };

    const response = await db.collection( "cards" ).insertOne( insertion );
    if ( response.result.ok != 1 ) {
        return next( new Error( "Insertion Error" ) );
    }

    res.sendStatus( 200 );
};
