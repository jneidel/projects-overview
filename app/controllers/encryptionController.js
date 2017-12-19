const jwt = require( "jsonwebtoken" );
const fs = require( "mz/fs" );
const rsa = require( "node-rsa" );
const atob = require( "atob" );
const md5 = require( "md5" );

require( "dotenv" ).config( { path: "../variables.env" } );

exports.decryptBody = async ( req, res, next ) => {
  const privateKeyFile = await fs.readFile( "./private-key.pem" );
  const privateKey = new rsa();
  privateKey.importKey( privateKeyFile, "pkcs1-private-pem" );

  function decrypt( pass ) {
    pass = atob( pass );
    	pass = privateKey.decrypt( pass, "utf8" );
    pass = md5( pass );
    return pass;
  }

  req.body.password = decrypt( req.body.password );
  if ( req.body.password_confirm ) {
    req.body.password_confirm = decrypt( req.body.password_confirm );
  }

  return next();
};

exports.generateToken = async ( req, res, next ) => {
  const token = await jwt.sign( { username: req.body.username }, process.env.SECRET );
  res.json( { token } );
};

exports.verifyToken = async ( req, res, next ) => {
  const verified = await req.verifyJwt( req.body.token );
  if ( !verified ) { return res.json( { error: true } ); }
  req.body.username = verified.username;

  return next();
};
