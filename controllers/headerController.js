const cookieParser = require( "cookie" );

exports.createCookie = ( req, res, next ) => {
  /*
   * In: -
   * Out: response: token as cookie 
   */
  res.clearCookie( "token" );
  res.cookie( "token", req.token, {
    maxAge  : 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    Secure  : true,
  } );

  res.json( { success: true } );
};

exports.parseToken = ( req, res, next ) => {
  const cookies = cookieParser.parse( req.headers.cookie );
  req.token = cookies.token;

  return next();
};

exports.removeCookie = ( req, res, next ) => {
  res.clearCookie( "token" );

  next();
};
