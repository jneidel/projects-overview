const mongo = require( "mongodb" ).MongoClient;
const assert = require( "assert" );
const { throwUserError } = require( "../handlers/errorHandlers" );

require( "dotenv" ).config( { path: "../variables.env" } );

exports.updateDatabase = async ( req, res, next ) => {
  const query = {};
  const update = {};

  if ( req.body.updatedItem === undefined ) {
    query.username = req.body.username;
    query.title = req.body.title;

    update.$set = { title: req.body.updatedTitle };
  } else {
    query.username = req.body.username;
    query.title = req.body.title;
    query[req.body.cardSide] = req.body.oldItem;

    const setObj = {};
    setObj[`${req.body.cardSide}.$`] = req.body.updatedItem;
    update.$set = setObj;
  }

  const db = await mongo.connect( process.env.DATABASE );

  const response = await db.collection( "cards" ).updateOne( query, update );
  if ( response.result.ok != 1 ) {
    next( new Error( "Insertion Error" ) );
  }
  res.sendStatus( 200 );
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

exports.addNewCard = async ( req, res, next ) => {
  const db = await mongo.connect( process.env.DATABASE );

  const lastPosition = await db.collection( "cards" ).aggregate( [
    { $match: { username: req.body.username } },
    { $group: { position: { $max: "$position" }, _id: null } },
  ] ).toArray();

  let newPosition = 1; // Fallback if first card
  try {
    newPosition = lastPosition[0].position + 1;
  } catch ( e ) {} // eslint-disable-line no-empty

  const insertion = {
    _id     : Number( req.body._id ),
    username: req.body.username,
    title   : "",
    front   : [ "" ],
    back    : [ "" ],
    position: newPosition,
  };

  const response = await db.collection( "cards" ).insertOne( insertion );
  if ( response.result.ok != 1 ) {
    return next( new Error( "Insertion Error" ) );
  }
  res.sendStatus( 200 );
};

exports.getItems = async ( req, res, next ) => {
  const db = await mongo.connect( process.env.DATABASE );

  const query = { username: req.body.username };
  const projection = { _id: 1, title: 1, front: 1, back: 1, position: 1 };

  const cards = await db.collection( "cards" )
    .find( query, projection )
    .sort( { position: 1 } )
    .toArray();

  db.close();
  res.json( cards );
};

exports.addNewItem = async ( req, res, next ) => {
  const db = await mongo.connect( process.env.DATABASE );

  const query = { title: req.body.title, username: req.body.username };
  const insertionObj = {};
  insertionObj[req.body.cardSide] = "";
  const insertion = { $push: insertionObj };

  const response = await db.collection( "cards" ).updateOne( query, insertion );
  if ( response.result.ok != 1 ) {
    next( new Error( "Insertion Error" ) );
  }

  res.sendStatus( 200 );
};

exports.getAccountData = async ( req, res, next ) => {
  res.json( {
    username: req.body.username,
  } );
};

exports.connectDatabase = async ( req, res, next ) => {
  /*
   * In: -
   * Out: db 
   * Throw: connection error
   */
  req.body.db = await mongo.connect( process.env.DATABASE )
    .catch( () => { throwUserError( "Database connection error", req, res ); } );

  return next();
};

exports.getCards = async ( req, res, next ) => {
  /*
   * In: db, username
   * Out: card data for username
   */
  const query = { username: req.body.username };
  const projection = { _id: 1, title: 1, front: 1, back: 1, position: 1 };

  req.cards = await req.body.db.collection( "cards" )
    .find( query, projection )
    .sort( { position: 1 } )
    .toArray();

  return next();
};
