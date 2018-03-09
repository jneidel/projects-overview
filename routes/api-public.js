const express = require( "express" );
const router = express.Router();
const database = require( "../controllers/databaseController" );
const { verifyTokenAPI, setupToken } = require( "../handlers/tokenHandler" );

router.post( "/",
  database.connectDatabase,
  async ( req, res ) => {
    const users = req.db.users;
    const cards = req.db.cards;
    const apiKey = req.query.key;

    if ( !apiKey ) {
      return res.json( { error: "You must provide an api key." } );
    }

    const docs = await users.find( { api: apiKey } ).toArray()
      .catch( ( err ) => { throw new Error( err ); } );

    if ( docs.length === 0 ) {
      return res.json( { error: "You must provide a legitimate api key." } );
    }

    const user = docs[0];

    let data = await cards.aggregate( [
      { $match: { username: user.username } },
      { $project: { _id: 0, title: 1, front: 1 } },
      { $unwind: "$front" },
      { $group: { _id: "$title", docs: { $push: "$front" } } },
      { $group: { _id: null, cards: { $push: { title: "$_id", items: "$docs" } } } },
    ] ).toArray();

    data = data[0].cards;

    const response = [];

    data.forEach( ( card ) => {
      const items = card.items.filter( x => x !== "" );

      response.push( { title: card.title, items } );
    } );

    res.json( { cards: response } );
  }
);

router.get( "/", ( req, res ) => {
  req.flash( "error", "Access to the API denied." );
  res.redirect( "/login" );
} );
router.get( "/:anything", ( req, res ) => {
  req.flash( "error", "Access to the API denied." );
  res.redirect( "/login" );
} );

module.exports = router;
