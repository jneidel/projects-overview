const fs = require( "mz/fs" );
const jwt = require( "jsonwebtoken" );
const rsa = require( "node-rsa" );
const atob = require( "atob" );
const btoa = require( "btoa" );
const bcrypt = require( "bcrypt" );
const { throwUserError } = require( "../handlers/errorHandlers" );

require( "dotenv" ).config( { path: "../variables.env" } );

exports.decryptPasswords = async ( req, res, next ) => {
  /*
   * Out: decrypted password(s)
   */
  const password = req.body.password;
  const passwordConfirm = req.body.password_confirm;

  const privateKeyFile = await fs.readFile( "./private-key.pem" );
  const privateKey = new rsa();
  privateKey.importKey( privateKeyFile, "pkcs1-private-pem" );

  function decrypt( pass ) {
    pass = atob( pass );
    pass = privateKey.decrypt( pass, "utf8" );
    return pass;
  }

  req.body.password = decrypt( password );

  if ( passwordConfirm ) {
    req.body.password_confirm = decrypt( passwordConfirm );
  }

  return next();
};

exports.hashPassword = ( req, res, next ) => {
  /*
   * Out: hashed password
   * Throw: passwords not matching
   */
  const password = req.body.password;
  const passwordConfirm = req.body.password_confirm;

  if ( passwordConfirm !== password ) {
    return throwUserError( "Passwords do not match", req, res );
  }

  req.body.password = bcrypt.hashSync( password, 8 );
  req.body.password_confirm = null;

  return next();
};

exports.generateToken = async ( req, res, next ) => {
  /*
   * Out: token with username
   */
  const username = req.body.username;

  const token = await jwt.sign( { username }, process.env.SECRET );
  req.token = token;

  return next();
};


exports.verifyToken = async ( req, res, next ) => {
  /*
   * Out: username, homepage
   * Throw: token invalid
   */
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

  const data = await verifyJwt( req.token );
  if ( !data ) {
    throwUserError( "Invalid token", req, res );
  }

  req.body.username = data.username;
  req.homepage = "/app";

  return next();
};

exports.encryptToken = async ( req, res, next ) => {
  /*
   * Out: encrypted token
   */
  let token = req.token;

  const publicKeyFile = await fs.readFile( "./public/public-key.pem" );
  const publicKey = new rsa();
  publicKey.importKey( publicKeyFile, "pkcs8-public-pem" );

  token = publicKey.encrypt( token, "base64" );
  token = btoa( token );
  req.token = token;

  return next();
};

exports.decryptToken = async ( req, res, next ) => {
  /* 
   * Out: decrypted token
   */
  let token = req.token;

  const privateKeyFile = await fs.readFile( "./private-key.pem" );
  const privateKey = new rsa();
  privateKey.importKey( privateKeyFile, "pkcs1-private-pem" );

  token = atob( token );
  token = privateKey.decrypt( token, "utf8" );
  req.token = token;

  return next();
};
