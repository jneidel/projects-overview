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
  const dbUsers = req.db.collection( "users" );
  const dbCards = req.db.collection( "cards" );

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

  const usernameExits = await dbUsers.find( { newUsername } ).toArray();

  if ( !usernameExits || usernameExits.length !== 0 ) {
    return throwUserErrorWithState( "Username is already in use", ...errState );
  }

  const docs = await dbUsers.find( { username } ).toArray();
  const passwordHash = docs[0].password;

  if ( !bcrypt.compareSync( password, passwordHash ) ) {
    return throwUserErrorWithState( "Invalid confirm password", ...errState );
  }

  dbUsers.updateOne(
    { username },
    { $set: { username: newUsername } }
  );

  dbCards.updateMany(
    { username },
    { $set: { username: newUsername } }
  );

  req.body.username = req.body.newUsername;

  req.flash( "success", "Username has been changed" );
  return next();
};

exports.updatePassword = async ( req, res, next ) => {
  /*
   * Out: update password in db
   * Throw:
   *  - empty password
   *  - empty passwordRepeat
   *  - empty passwordConfirm
   *  - passwords dont match
   *  - invalid passwordConfirm
   */
  let password = req.body.password;
  const passwordRepeat = req.body.passwordRepeat;
  const passwordConfirm = req.body.passwordConfirm;
  const username = req.body.username;
  const db = req.db.collection( "users" );

  if ( password === "" || passwordRepeat === "" || passwordConfirm === "" ) {
    return throwUserError( "Password can't be empty", req, res );
  }

  if ( password !== passwordRepeat ) {
    return throwUserError( "Passwords must match", req, res );
  }

  const docs = await db.find( { username } ).toArray();
  const passwordHash = docs[0].password;

  if ( !bcrypt.compareSync( passwordConfirm, passwordHash ) ) {
    return throwUserError( "Invalid confirm password", req, res );
  }

  password = bcrypt.hashSync( password, 8 );
  db.updateOne(
    { username },
    { $set: { password } }
  );

  req.flash( "Password has been changed" );
  return res.json( { success: true } );
};

exports.removeAccount = async ( req, res, next ) => {
  /*
   * Out: remove account from db
   * Throw: invalid password
   */
  const passwordConfirm = req.body.passwordConfirm;
  const username = req.body.username;
  const dbUsers = req.db.collection( "users" );
  const dbCards = req.db.collection( "cards" );

  const docs = await dbUsers.find( { username } ).toArray();
  const passwordHash = docs[0].password;

  if ( !bcrypt.compareSync( passwordConfirm, passwordHash ) ) {
    return throwUserError( "Invalid confirm password", req, res );
  }

  dbUsers.remove( { username }, true ); // 2nd parameter is justOne
  dbCards.remove( { username } );

  res.clearCookie( "token" );

  req.flash( "info", "Account has been deleted, thanks for checking out the app" );
  return res.json( { success: true } );
};
