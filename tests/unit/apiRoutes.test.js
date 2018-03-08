const expect = require( "expect" );
const sinon = require( "sinon" );
const mockery = require( "mockery" );
mockery.enable( { warnOnUnregistered: false, warnOnReplace: false } );

const { passwords } = require( "./data" );
const { createMongo, createBcrypt } = require( "./dependencyFactories" );
const { generateArgs, expectResJson, generateStubs, registerMocks } = require( "./utils" );

process.env.SECRET = "test-cookie-secret";

const next = () => {};

/* global describe it xit */
/* eslint-disable global-require */

const api = {
  login() {
    const data = {
      username     : "jneidel",
      encryptedPass: passwords.encryptedPass,
      hashedPass   : passwords.hashedPass,
    };

    async function runLogin( req, res, { ...mocks }, ) {
      registerMocks( mockery, mocks );

      const { login } = require( "../../controllers/accountController" );
      const { connectDatabase } = require( "../../controllers/databaseController" );
      const { decryptPasswords } = require( "../../controllers/encryptionController" );
      const { setupToken } = require( "../../handlers/tokenHandler" );

      await decryptPasswords( req, res, next );
      await connectDatabase( req, res, next );
      await login( req, res, next );
      await setupToken( req, res, next );
    }

    describe( "/api/login", () => {
      it( "should not throw on login", async () => {
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

        await runLogin( req, res, stubs );

        /* state assert */
        expect( req.token ).toBeTruthy( "expect token" );
        expect( res.cookie.callCount ).toBe( 1, "expect cookie" );
        /* value assert */
        expectResJson.success( res );
      } );
    } );
  },
  register() {
    const data = {
      username     : "jneidel",
      encryptedPass: passwords.encryptedPass,
    };

    async function runRegister( req, res, { ...mocks }, ) {
      registerMocks( mockery, mocks );

      const { validateRegister, registerUser } = require( "../../controllers/accountController" );
      const { connectDatabase, generateCardId, addExampleCards } = require( "../../controllers/databaseController" );
      const { decryptPasswords, hashPassword } = require( "../../controllers/encryptionController" );
      const { setupToken } = require( "../../handlers/tokenHandler" );

      await decryptPasswords( req, res, next );
      hashPassword( req, res, next );
      await connectDatabase( req, res, next );
      await validateRegister( req, res, next );
      await registerUser( req, res, next );
      await generateCardId( req, res, next );
      await addExampleCards( req, res, next );
      await setupToken( req, res, next );
    }

    describe( "/api/register", () => {
      it( "should not throw on register", async () => {
        const username = data.username;
        const password = data.encryptedPass;
        const { req, res } = generateArgs();
        req.body.password = password;
        req.body.passwordConfirm = password;

        const mongo = createMongo();
        mongo.findOne.returns( {} );
        mongo.insertOne.returns( { result: { ok: 1 } } );
        mongo.toArray.returns( [ { _id: 1 } ] );

        const stubs = generateStubs( { mongo }, [ "bcrypt", "rsa", "jwt", "fs" ] );

        await runRegister( req, res, stubs );

        /* state assert */
        expect( req.token ).toBeTruthy( "expect token" );
        expect( res.cookie.callCount ).toBe( 1, "expect cookie" );
        /* value assert */
        expectResJson.success( res );
      } );
    } );
  },
};

api.login();
api.register();
