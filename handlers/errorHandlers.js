exports.catchErrors = fn => ( req, res, next ) => {
  try {
    fn( req, res, next );
  } catch ( err ) {
    return next( err );
  }
};

exports.notFound = ( req, res, next ) => {
  const err = new Error( "Not Found" );
  err.status = 404;
  next( err );
};

exports.flashValidationErrors = ( err, req, res, next ) => {
  if ( !err.errors ) return next( err );
  const errorKeys = Object.keys( err.errors );
  errorKeys.forEach( key => req.flash( "error", err.errors[key].message ) );
  res.redirect( "back" );
};

exports.developmentErrors = ( err, req, res, next ) => {
  err.stack = err.stack || "";
  const errorDetails = {
    message         : err.message,
    status          : err.status,
    stackHighlighted: err.stack.replace( /[a-z_-\d]+.js:\d+:\d+/gi, "<mark>$&</mark>" ),
    title           : "Error",
  };
  res.status( err.status || 500 );
  res.format( {
    "text/html": () => {
      res.render( "error", errorDetails );
    },
    "application/json": () => res.json( errorDetails ),
  } );
};

exports.productionErrors = ( err, req, res, next ) => {
  res.status( err.status || 500 );
  res.render( "error", {
    title  : "Error",
    message: err.message,
    error  : {},
  } );
};

exports.throwUserError = ( msg, req, res ) => {
  req.flash( "error", msg );
  res.json( { error: true } );
};

exports.throwUserErrorWithState = ( msg, state, redirectUrl, req, res ) => {
  req.flash( "error", msg );

  function serialize( obj ) {
    const str = [];
    for ( const p in obj ) {
      if ( obj.hasOwnProperty( p ) ) {
        str.push( `${encodeURIComponent( p )}=${encodeURIComponent( obj[p] )}` );
      }
    }
    return str.join( "&" );
  }

  res.json( { state: `${redirectUrl}?${serialize( state )}` } );
};
