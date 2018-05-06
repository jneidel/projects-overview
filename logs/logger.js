const logger = require( "morgan" );
const fs = require( "fs" );
const path = require( "path" );

const logUtils = require( "./utils.js" );

exports.dev = logger( logUtils.patternShort, { // Log requests to console
  skip: logUtils.filterResources,
} );

exports.writeErrors = logger( logUtils.pattern, { // Write errors to error.log
  skip  : logUtils.filterErrors,
  stream: fs.createWriteStream( path.join( __dirname, "error.log" ), { flags: "a" } ),
} );

exports.writeRequests = logger( logUtils.pattern, { // Write all requests to access.log
  skip  : logUtils.filterResources,
  stream: fs.createWriteStream( path.join( __dirname, "access.log" ), { flags: "a" } ),
} );
