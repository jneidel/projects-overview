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
    next();
  }
};

exports.verifyTokenAPI = async ( req, res, next ) => {
  try {
    header.parseToken( req, res, () => {} );
    await encryption.decryptToken( req, res, () => {} );
    await encryption.verifyToken( req, res, next );
  } catch ( e ) {
    throwUserError( "Error verifiying the token", req, res );
  }
}
