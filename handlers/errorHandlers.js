exports.catchErrors = fn => function( req, res, next ) {
  try {
    fn( req, res, next );
  } catch ( err ) {
    console.log( err );
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

exports.displayErrorMsg = ( err, req, res, next ) => {
  req.flash( "error", err );
  res.json( { error: true } );
}

exports.developmentErrors = ( err, req, res, next ) => {
  err.stack = err.stack || "";
  const errorDetails = {
    message         : err.message,
    status          : err.status,
    stackHighlighted: err.stack.replace( /[a-z_-\d]+.js:\d+:\d+/gi, "<mark>$&</mark>" ),
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
    message: err.message,
    error  : {},
  } );
};