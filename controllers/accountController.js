const validator = require( "validator" );
const bcrypt = require( "bcrypt" );
const reservedUsernames = require( "../data/reserved-usernames" );
const { throwUserError, throwUserErrorWithState } = require( "../handlers/errorHandlers" );

require( "dotenv" ).config( { path: "../variables.env" } );


exports.validateRegister = async ( req, res, next ) => {
  /*
   * Throw:
   *  - username empty
   *  - password empty
   *  - username not ascii
   *  - username reserved
   *  - dublicate username
   */
  const username = req.body.username;
  const password = req.body.password;
  const db = req.db.collection( "users" );

  try {
    if ( validator.isEmpty( username ) || bcrypt.compareSync( "", password ) ) {
      return throwUserError( "Empty form field", req, res );
    }
  } catch ( error ) {
    return throwUserError( "Register error", req, res );
  }

  if ( !validator.isAscii( username ) ) {
    return throwUserError( "Username must be ascii", req, res );
  }

  if ( ~reservedUsernames.indexOf( username ) ) {
    return throwUserError( "Username is reserved", req, res );
  }

  const data = await db.findOne( { username } );
  if ( data !== null ) {
    return throwUserError( "Username is already registered.", req, res );
  }

  return next();
};

exports.registerUser = async ( req, res, next ) => {
  /*
   * Out: user data added to db
   */
  const username = req.body.username;
  const password = req.body.password;
  const db = req.db.collection( "users" );

  const user = {
    username,
    password,
    settings: {},
  };

  const response = await db.insertOne( user );
  if ( response.result.ok != 1 ) {
    return throwUserError( "Error registering the account", req, res );
  }

  req.flash( "success", "Registration successful" );
  return next();
};

exports.login = async ( req, res, next ) => {
  /*
   * Throw:
   *  - invalid username
   *  - invalid password
   */
  const username = req.body.username;
  const password = req.body.password;
  const db = req.db.collection( "users" );

  const data = await db.find( { username } ).toArray();

  if ( !data || data.length === 0 ) {
    return throwUserError( "Invalid username", req, res );
  }

  const passwordHash = data[0].password;

  if ( !bcrypt.compareSync( password, passwordHash ) ) {
    return throwUserError( "Invalid password", req, res );
  }

  req.flash( "success", "Login successful" );
  return next();
};

exports.updateUsername = async ( req, res, next ) => {
  /*
   * Out: update username in db
   * Throw:
   *  - empty username
   *  - empty password
   *  - unchanged username
   *  - dublicate username
   *  - reserved username
   *  - invalid password
   */
  const username = req.body.username;
  const newUsername = req.body.newUsername;
  const password = req.body.password;
  const db = req.db.collection( "users" );

  const errState = [ { username: newUsername }, "/account", req, res ];

  if ( newUsername === "" ) {
    return throwUserErrorWithState( "Username can't be empty", ...errState );
  }
  if ( password === "" ) {
    return throwUserErrorWithState( "Password can't be empty", ...errState );
  }
  if ( username === newUsername ) {
    req.flash( "info", "Username are indentical" );
    return res.json( { info: true } );
  }
  if ( ~reservedUsernames.indexOf( newUsername ) ) {
    return throwUserErrorWithState( "Username is reserved", ...errState );
  }

  const usernameExits = await db.find( { newUsername } ).toArray();

  if ( !usernameExits || usernameExits.length !== 0 ) {
    return throwUserErrorWithState( "Username is already in use", ...errState );
  }

  const docs = await db.find( { username } ).toArray();
  const passwordHash = docs[0].password;

  if ( !bcrypt.compareSync( password, passwordHash ) ) {
    return throwUserErrorWithState( "Invalid password", ...errState );
  }

  db.updateOne(
    { username },
    { $set: { username: newUsername } }
  );

  db.updateMany(
    { username },
    { $set: { username: newUsername } }
  );

  req.body.username = req.body.newUsername;

  req.flash( "success", "Username has been changed" );
  return next();
};

exports.updatePassword = async ( req, res, next ) => res.json( { success: true } );
