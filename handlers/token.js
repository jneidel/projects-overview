const header = require( "../controllers/header" );
const encryption = require( "../controllers/encryption" );
const { throwUserError } = require( "../handlers/error" );

exports.verifyToken = async ( req, res, next ) => {
  try {
    header.parseToken( req, res, () => {} );
    await encryption.decryptToken( req, res, () => {} );
    await encryption.verifyToken( req, res, next );
  } catch ( err ) { // no cookie available
    req.body.username = undefined;
    return next();
  }
};

exports.verifyTokenAPI = async ( req, res, next ) => {
  try {
    header.parseToken( req, res, () => {} );
    await encryption.decryptToken( req, res, () => {} );
    await encryption.verifyToken( req, res, next );
  } catch ( err ) {
    return throwUserError( "Error verifiying the token", req, res );
  }
};

exports.verifyTokenThrow = async ( req, res, next ) => {
  try {
    header.parseToken( req, res, () => {} );
    await encryption.decryptToken( req, res, () => {} );
    await encryption.verifyToken( req, res, next );
  } catch ( err ) { // not logged int
    req.flash( "error", "Authentication is required to visit that url." );
    return res.redirect( "login" );
  }
};

exports.setupToken = async ( req, res, next ) => {
  await encryption.generateToken( req, res, () => {} );
  await encryption.encryptToken( req, res, () => {} );
  return header.createCookie( req, res, next );
};
