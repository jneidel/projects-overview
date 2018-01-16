const header = require( "../controllers/headerController.js" );
const encryption = require( "../controllers/encryptionController" );

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
