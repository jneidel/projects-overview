const mongo = require( "mongodb" ).MongoClient;
const fs = require( "mz/fs" );
const validator = require( "validator" );
const bcrypt = require( "bcrypt" );
const reservedUsernames = require( "../data/reserved-usernames" );
const { throwUserError } = require( "../handlers/errorHandlers" );

require( "dotenv" ).config( { path: "../variables.env" } );


exports.validateRegister = ( req, res, next ) => {
  /*
   * In: username, password
   * Out: -
   * Throw:
   *  - username empty
   *  - password empty
   *  - username reserved
   */
  try {
    if ( validator.isEmpty( req.body.username ) ||
         bcrypt.compareSync( "", req.body.password ) ) {
      return throwUserError( "Empty form field", req, res );
    }
  } catch ( error ) {
    return throwUserError( "Register error", req, res );
  }

  // req.sanitizeBody( "username" );
  // req.checkBody( "password_confirm", 
  // "Your passwords do not match." ).equals( req.body.password );

  if ( ~reservedUsernames.indexOf( req.body.username ) ) {
    return throwUserError( "Username is reserved", req, res );
  }

  return next();
};

exports.checkDublicateUsername = async ( req, res, next ) => {
  /*
   * In: db
   * Out: -
   * Throw: dublicate username
   */
  const db = req.body.db;
  const username = await db.collection( "users" ).findOne( { username: req.body.username } );

  if ( username !== null ) {
    db.close();
    return throwUserError( "Username is already registered.", req, res );
  }

  return next();
};

exports.registerUser = async ( req, res, next ) => {
  const db = req.body.db;

  const userDocument = {
    username: req.body.username.trim(),
    // email: req.body.email.trim().toLowerCase(), validator.isEmail(), unique
    password: req.body.password,
    settings: {},
    logins 	: [],
  };

  const response = await db.collection( "users" ).insertOne( userDocument );
  if ( response.result.ok != 1 ) {
    db.close();
    req.flash( "error", "Account could not be registered." );
    return res.json( { error: true } );
  }

  req.flash( "success", "Registration successful" );
  return next();
};

exports.login = async ( req, res, next ) => {
  const username = req.body.username;
  const password = req.body.password;
  const db = req.body.db;

  const docs = await db.collection( "users" ).find( { username } ).toArray();

  if ( !docs || docs.length === 0 ) {
    throwUserError( "Invalid username", req, res );
  }
  const passwordHash = docs[0].password;

  if ( !bcrypt.compareSync( password, passwordHash ) ) {
    throwUserError( "Invalid password", req, res );
  }
  
  const loginDetails = {
    time: Date.now(),
  };
  db.collection( "users" ).updateOne( { username }, { $push: { logins: loginDetails } } );

  db.close();

  req.flash( "success", "Successful login" );
  return next();
};

/* exports.isLoggedIn = (req, res, next) => {
    if ( req.isAuthenticated() ) return next();
    
    req.flash( "error", "You must be logged in to visit this page." );
    res.redirect( "back" );
}; */

exports.updateUsername = async ( req, res, next ) => {
  const username = req.body.username;
  const newUsername = req.body.newUsername;
  const password = req.body.password;

  const db = await mongo.connect( process.env.DATABASE );

  if ( req.body.username === req.body.newUsername ) {
    // handle no changes
  }
  // check password

  // check dublicate name

  // check password / name empty

  db.collection( "users" ).updateOne(
    { username },
    { $set: { username: newUsername } }
  );

  db.collection( "cards" ).updateMany(
    { username },
    { $set: { username: newUsername } }
  );

  req.body.username = req.body.newUsername;
  req.flash( "success", "Changed username" );
  return next();
};
