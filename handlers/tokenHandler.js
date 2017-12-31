module.exports = async function verify( token ) {
  const jwt = require( "jsonwebtoken" );

  require( "dotenv" ).config( { path: "../variables.env" } );

  function trim( str, regex ) {
    return str.replace( new RegExp( regex, "g" ), "" );
  }
  token = trim( token, "\"" );

  try {
    const res = await jwt.verify( token, process.env.SECRET );
    return { username: res.username };
  } catch ( error ) {
    return false;
  }
};
