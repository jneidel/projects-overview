const sinon = require( "sinon" );
const expect = require( "expect" );

const factories = require( "./dependencyFactories" );

exports.generateArgs = () => {
  /* Creates unique, fully isolated, instance of args 
   * Out: setup req, res
   */
  const sb = sinon.createSandbox(); // Unique instance

  const req = {
    flash  : sb.spy(),
    body   : {},
    headers: { "user-agent": "Chrome" },
  };
  const res = {
    json       : sb.spy(),
    cookie     : sb.spy(),
    clearCookie: sb.spy(),
  };

  return { req, res };
};

exports.generateStubs = ( edited, generate ) => {
  /* Creates new stubs based on input
   * Out: object of stubs ready to be registered with registerMocks
   */
  const result = {};

  if ( edited !== null ) {
    Object.keys( edited ).forEach( ( el ) => {
      result[el] = edited[el];
    } );
  }

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

exports.registerMocks = ( mockeryInstance, mockObjects ) => {
  /* Register mocks for given mockery instance
   * Out: mocks registered 
   */
  if ( mockObjects.mongo ) { mockeryInstance.registerMock( "mongodb", mockObjects.mongo ); }
  if ( mockObjects.rsa ) { mockeryInstance.registerMock( "node-rsa", mockObjects.rsa ); }
  if ( mockObjects.bcrypt ) { mockeryInstance.registerMock( "bcrypt", mockObjects.bcrypt ); }
  if ( mockObjects.jwt ) { mockeryInstance.registerMock( "jsonwebtoken", mockObjects.jwt ); }
  if ( mockObjects.fs ) { mockeryInstance.registerMock( "mz/fs", mockObjects.fs ); }

  mockeryInstance.registerMock( "dotenv", { config: () => {} } );
};

exports.expectResJson = {
  success( res ) {
    expect( res.json.calledWith( { success: true } ) ).toBeTruthy( "expect success res.json" );
  },
  error( res ) {
    expect( res.json.calledWith( { error: true } ) ).toBeTruthy( "expect error res.json" );
  },
};
