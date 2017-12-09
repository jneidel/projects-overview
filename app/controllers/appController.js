const mongo = require( "mongodb" ).MongoClient;
const assert = require( "assert" );
const jws = require( "jsonwebtoken" );

require( "dotenv" ).config( { path: "../variables.env" } );

exports.renderItems = async ( req, res ) => {
    const userid = "1";
    const cards = [];

    const db = await mongo.connect( process.env.DATABASE );

    const query = { userid };
    const projection = { _id: 1, title: 1, front: 1, back: 1, position: 1 };

    const cursor = db.collection( "cards" ).find( query, projection );
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
};

exports.login = ( req, res ) => {
    res.render( "login", { title: "Login" } );
};

exports.register = ( req, res ) => {
    res.render( "register", { title: "Register" } );
};
