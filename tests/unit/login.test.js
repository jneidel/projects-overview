const expect = require( "expect" );
const sinon = require( "sinon" );
const mockery = require( "mockery" );

const { passwords } = require( "./data" );
const { createMongo, createBcrypt } = require( "./dependencyFactories" );
const { generateArgs, expectResJson, generateStubs } = require( "./utils" );

process.env.SECRET = "test-cookie-secret";
mockery.enable( { warnOnUnregistered: false } );

/* global describe it xit */
/* eslint-disable global-require */

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

    const { req, res } = generateArgs();
    req.body.username = username;
    req.body.password = password;

    const mongo = createMongo();
    mongo.toArray.returns( [ { username, password: hashedPass } ] );

    const bcrypt = createBcrypt();
    bcrypt.compareSync.returns( true );

    const stubs = generateStubs( { mongo, bcrypt }, [ "rsa", "jwt", "fs" ] );

    await runUnit( req, res, stubs );

    /* state assert */
    expect( req.token ).toBeTruthy( "expect token" );
    expect( res.cookie.callCount ).toBe( 1, "expect cookie" );
    /* value assert */
    expectResJson.success( res );
  } );
} );
