const jwt = require( "jsonwebtoken" );
const fs = require( "mz/fs" );
const rsa = require( "node-rsa" );
const atob = require( "atob" );
const btoa = require( "btoa" );
const bcrypt = require( "bcrypt" );
const { throwUserError } = require( "../handlers/errorHandlers" );

require( "dotenv" ).config( { path: "../variables.env" } );

exports.decryptBody = async ( req, res, next ) => {
  /*
   * In: encrypted passwords
   * Out: decrypted passwords
   */
  const privateKeyFile = await fs.readFile( "./private-key.pem" );
  const privateKey = new rsa();
  privateKey.importKey( privateKeyFile, "pkcs1-private-pem" );

  function decrypt( pass ) {
    pass = atob( pass );
    pass = privateKey.decrypt( pass, "utf8" );
    return pass;
  }

  req.body.password = decrypt( req.body.password );

  if ( req.body.password_confirm ) {
    req.body.password_confirm = decrypt( req.body.password_confirm );
  }

  return next();
};

exports.handlePasswords = ( req, res, next ) => { // eslint-disable-line no-irregular-whitespace
  /*
   * In: decrypted passwords
   * Out:
   *  register: hashed password
   *  login: null password
   * Throw:
   *  register: not matching passwords 
   *  login: -
   */
  if ( req.body.password_confirm ) {
    if ( req.body.password_confirm !== req.body.password ) {
      return throwUserError( "Passwords do not match", req, res );
    }

    req.body.password = bcrypt.hashSync( req.body.password, 8 );
    req.body.password_confirm = null;
  } else { // setting passwords to null as they wont be needed anymore
    req.body.password = null;
  }

  return next();
};

exports.generateToken = async ( req, res, next ) => {
  /*
   * In: username
   * Out:
   *  register: response: token
   *  login: token
   */
  const token = await jwt.sign( { username: req.body.username }, process.env.SECRET );

  if ( req.isRegister ) {
    return res.json( { token } );
  }

  req.token = token;

  return next();
};

async function verifyJwt( token ) {
  function trim( str, regex ) {
    return str.replace( new RegExp( regex, "g" ), "" );
  }
  token = trim( token, "\"" );

  try {
    const res = await jwt.verify( token, process.env.SECRET );
    return { username: res.username };
  } catch ( error ) {
    return false;
  }
}

exports.verifyToken = async ( req, res, next ) => {
  /*
   * In: token
   * Out: username, homepage
   * Throw: token not verified
   */
  const verifiedToken = await verifyJwt( req.token );
  if ( !verifiedToken ) { return res.json( { error: true } ); }
  req.body.username = verifiedToken.username;
  req.homepage = "/app";

  return next();
};

exports.encryptToken = async ( req, res, next ) => {
  /*
   * In: token
   * Out: encrypted token
   */
  const publicKeyFile = await fs.readFile( "./public/public-key.pem" );
  const publicKey = new rsa();
  publicKey.importKey( publicKeyFile, "pkcs8-public-pem" );

  let token = publicKey.encrypt( req.token, "base64" );
  token = btoa( token );
  req.token = token;

  return next();
};

exports.decryptToken = async ( req, res, next ) => {
  /* 
   * reversing encryptToken
   *
   * In: token
   * Out: decrypted token
   */
  const privateKeyFile = await fs.readFile( "./private-key.pem" );
  const privateKey = new rsa();
  privateKey.importKey( privateKeyFile, "pkcs1-private-pem" );

  let token = atob( req.token );
  token = privateKey.decrypt( token, "utf8" );
  req.token = token;

  return next();
};
