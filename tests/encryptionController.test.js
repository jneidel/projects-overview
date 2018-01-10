const expect = require( "expect" );
const sinon = require( "sinon" );
const mockery = require( "mockery" );
const { mockReset, mongo, rsaMock, tokenStates } = require( "./mockeryTestData.js" );

/* global describe it */

mockery.enable( {
  warnOnUnregistered: false,
} );

rsaMock.setup();
class rsa {
  constructor() {
    return rsaMock;
  }
}

mockery.registerMock( "node-rsa", rsa );

const controller = require( "../controllers/encryptionController" );

const sandbox = sinon.sandbox.create();
let req = { flash: sandbox.spy() };
const res = { json: sandbox.spy() };
const next = sandbox.spy();

function setupSandbox( data ) {
  sandbox.reset();
  rsaMock.setup();
  req = data;
  req.flash = sandbox.spy();
}

describe( "encryptionController", () => {
  describe( "encryptToken", () => {
    it( "should encrypt and parse token", async () => {
      setupSandbox( {
        token: tokenStates.token,
        run  : sandbox.spy(),
      } );

      await controller.encryptToken( req, {}, () => {} );

      expect( rsaMock.importKey.callCount ).toBe( 1, "expected to import public key" );
      expect( rsaMock.encrypt.calledWith( tokenStates.token, "base64" ) ).toBeTruthy( "expected to encrypt token with public key" );
      expect( req.token ).toBe( tokenStates.parsedToken, "expected parsed token as output" );
    } );
  } );
  describe( "handlePasswords", () => {
    describe( "register", () => {
      it( "should throw on different passwords", () => {
        const testData = [
          { body: { password: "123", password_confirm: "abc" } },
          { body: { password: "root", password_confirm: "toor" } },
        ];

        testData.forEach( ( doc ) => {
          setupSandbox( doc );

          controller.handlePasswords( req, res, next );

          expect( req.flash.callCount ).toBe( 1, "expect flash" );
          expect( res.json.callCount ).toBe( 1, "expect res.json" );
          expect( next.callCount ).toBe( 0, "expect no next" );
        } );
      } );

      it( "should not throw on valid passwords", () => {
        const testData = [
          { body: { password: "123", password_confirm: "123" } },
          { body: { password: "root", password_confirm: "root" } },
        ];

        testData.forEach( ( doc ) => {
          setupSandbox( doc );

          controller.handlePasswords( req, res, next );

          expect( req.body.password ).toBeTruthy( "expect password" );
          expect( req.body.password_confirm ).toBe( null, "expect no password confirm" );

          expect( req.flash.callCount ).toBe( 0, "expect no flash" );
          expect( res.json.callCount ).toBe( 0, "expect no res.json" );
          expect( next.callCount ).toBe( 1, "expect next" );
        } );
      } );
    } );

    describe( "login", () => {
      it( "should remove password", () => {
        const testData = [
          { body: { password: "123" } },
          { body: { password: "root" } },
        ];

        testData.forEach( ( doc ) => {
          setupSandbox( doc );

          controller.handlePasswords( req, res, next );

          expect( req.body.password ).toBe( null, "expect no password" );

          expect( req.flash.callCount ).toBe( 0, "expect no flash" );
          expect( res.json.callCount ).toBe( 0, "expect no res.json" );
          expect( next.callCount ).toBe( 1, "expect next" );
        } );
      } );
    } );
  } );
} );
