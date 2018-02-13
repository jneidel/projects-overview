const sinon = require( "sinon" );
const expect = require( "expect" );

const factories = require( "./dependencyFactories" );

exports.generateArgs = () => {
  /* Creates unique, fully isolated, instance of args 
   * Out: setup req, res
   */
  const sb = sinon.createSandbox(); // Unique instance

  const req = {
    sandbox: sb,
    flash  : sb.spy(),
    body   : {},
  };
  const res = {
    sandbox    : sb,
    json       : sb.spy(),
    cookie     : sb.spy(),
    clearCookie: sb.spy(),
  };

  return { req, res };
};

exports.expectResJson = {
  success( res ) {
    expect( res.json.calledWith( { success: true } ) ).toBeTruthy( "expect success res.json" );
  },
  error( res ) {
    expect( res.json.calledWith( { error: true } ) ).toBeTruthy( "expect error res.json" );
  },
};

exports.generateStubs = ( edited, generate ) => {
  const result = {};

  Object.keys( edited ).forEach( ( el ) => {
    result[el] = edited[el];
  } );

  generate.forEach( ( el ) => {
    switch ( el ) {
      case "rsa" :
        result.rsa = factories.createRsa();
        break;
      case "jwt":
        result.jwt = factories.createJwt();
        break;
      case "mongo":
        result.mongo = factories.createMongo();
        break;
      case "bcrypt":
        result.bcrypt = factories.createBcrypt();
        break;
      case "fs":
        result.fs = factories.createFs();
        break;
    }
  } );

  return result;
};
