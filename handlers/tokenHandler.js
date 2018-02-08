const header = require( "../controllers/headerController.js" );
const encryption = require( "../controllers/encryptionController" );
const { throwUserError } = require( "../handlers/errorHandlers" );

exports.verifyToken = async ( req, res, next ) => {
  try {
    header.parseToken( req, res, () => {} );
    await encryption.decryptToken( req, res, () => {} );
    await encryption.verifyToken( req, res, next );
  } catch ( e ) { // no cookie available
    req.body.username = undefined;
    return next();
  }
};

exports.verifyTokenAPI = async ( req, res, next ) => {
  try {
    header.parseToken( req, res, () => {} );
    await encryption.decryptToken( req, res, () => {} );
    await encryption.verifyToken( req, res, next );
  } catch ( e ) {
    return throwUserError( "Error verifiying the token", req, res );
  }
};

exports.verifyTokenThrow = async ( req, res, next ) => {
  try {
    header.parseToken( req, res, () => {} );
    await encryption.decryptToken( req, res, () => {} );
    await encryption.verifyToken( req, res, next );
  } catch ( e ) { // not logged int
    req.flash( "error", "Authentication is required to visit that url." );
    return res.redirect( "login" );
  }
};

exports.setupToken = async ( req, res, next ) => {
  await encryption.generateToken( req, res, () => {} );
  await encryption.encryptToken( req, res, () => {} );
  return header.createCookie( req, res, next );
};
