const expect = require( "expect" );
const sinon = require( "sinon" );
const mockery = require( "mockery" );
const { createMongo, createRsa, createBcrypt, createJwt, createFs, passwords } = require( "./dependencyMocks" );
process.env.SECRET = "test-cookie-secret";
mockery.enable( { warnOnUnregistered: false } );

/* global describe it xit */
/* eslint-disable global-require */

function createArgs() {
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
}

async function runUnit( req, res, { ...mocks } ) {
  if ( mocks.mongo ) { mockery.registerMock( "mongodb", mocks.mongo ); }
  if ( mocks.rsa ) { mockery.registerMock( "node-rsa", mocks.rsa ); }
  if ( mocks.bcrypt ) { mockery.registerMock( "bcrypt", mocks.bcrypt ); }
  if ( mocks.jwt ) { mockery.registerMock( "jsonwebtoken", mocks.jwt ); }
  if ( mocks.fs ) { mockery.registerMock( "mz/fs", mocks.fs ); }

  mockery.registerMock( "dotenv", { config: () => {} } );

  const { login } = require( "../../controllers/accountController" );
  const { connectDatabase } = require( "../../controllers/databaseController" );
  const { decryptPasswords } = require( "../../controllers/encryptionController" );
  const { setupToken } = require( "../../handlers/tokenHandler" );

  await decryptPasswords( req, res, () => {} );
  await connectDatabase( req, res, () => {} );
  await login( req, res, () => {} );
  await setupToken( req, res, () => {} );
}

const data = {
  username     : "jneidel",
  encryptedPass: passwords.encryptedPass,
  hashedPass   : passwords.hashedPass,
};

describe( "/api/login", () => {
  it( "should not throw on valid login", async () => {
    const username = data.username;
    const password = data.encryptedPass;
    const hashedPass = data.hashedPass;

    const { req, res } = createArgs();
    req.body.username = username;
    req.body.password = password;

    const mongo = createMongo();
    mongo.toArray.returns( [ { username, password: hashedPass } ] );

    const bcrypt = createBcrypt();
    bcrypt.compareSync.returns( true );

    const mocks = {
      mongo, bcrypt, rsa: createRsa(), jwt: createJwt(), fs : createFs(),
    };

    await runUnit( req, res, mocks );

    expect( req.body.username ).toBe( username );
    expect( req.token ).toBeTruthy( "expect token" );
    expect( res.cookie.callCount ).toBe( 1, "expect cookie" );
    expect( res.json.calledWith( { success: true } ) ).toBeTruthy( "expect success res.json" );
  } );
} );
