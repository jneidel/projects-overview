const cookieParser = require( "cookie" );

exports.createCookie = ( req, res, next ) => {
  /*
   * Out: token as cookie 
   */
  const token = req.token;

  res.clearCookie( "token" );
  res.cookie( "token", token, {
    maxAge  : 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    Secure  : true,
  } );

  return res.json( { success: true } );
};

exports.parseToken = ( req, res, next ) => {
  /*
   * Out: token from cookie
   */
  const cookies = cookieParser.parse( req.headers.cookie );
  req.token = cookies.token;

  return next();
};

exports.removeCookie = ( req, res, next ) => {
  res.clearCookie( "token" );

  return next();
};
