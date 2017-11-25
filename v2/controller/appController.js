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

exports.login = ( req, res ) => {
    res.render( "login", { title: "Login" } );
};

exports.register = ( req, res ) => {
    res.render( "register", { title: "Register" } );
};
