const expect = require( "expect" );
const sinon = require( "sinon" );
const { mongo } = require( "./mockeryTestData" );

/* global describe it */

const controller = require( "../controllers/accountController" );

const sandbox = sinon.sandbox.create();
const req = { flash: sandbox.spy() };
const res = { json: sandbox.spy() };
const next = sandbox.spy();

describe( "accountController", () => {
  describe( "validateRegister", () => {
    const reservedUsernames = require( "../data/reserved-usernames" ); // eslint-disable-line global-require 

    function setupSandbox() {
      sandbox.reset();
      req.body = {
        username: "123",
        password: "123",
      };
    }

    function setupData( doc, opt = {} ) {
      if ( opt.username ) {
        req.body.username = doc.username;
      }
      if ( opt.password ) {
        req.body.password = doc.password;
      }
    }

    it( "should not throw an error with valid data", () => {
      const testData = [
        { username: "jneidel", password: "123" },
        { username: "Roy Osherove", password: "$%~91äüsj" },
        { username: "pG7pAagEmDe3", password: "pG7pAagEmDe3" },
      ];

      testData.forEach( ( doc ) => {
        setupSandbox();
        setupData( doc, { username: 1, password: 1 } );

        controller.validateRegister( req, res, next );

        expect( req.flash.callCount ).toBe( 0, "expect no flash" );
        expect( res.json.callCount ).toBe( 0, "expect no res.json" );
        expect( next.callCount ).toBe( 1, "expect next" );
      } );
    } );

    it( "should throw an error on empty fields", () => {
      const empty = "$2a$04$47WVMwgypHPsaD6YyhUdxeZAhilvwIrFlrxawuRnVgddS9.2c3ZHK";
      const testData = [
        { username: "jneidel", password: empty },
        { username: "", password: "////jk" },
        { username: "", password: empty },
      ];

      testData.forEach( ( doc ) => {
        setupSandbox();
        setupData( doc, { username: 1, password: 1 } );

        controller.validateRegister( req, res, next );

        expect( req.flash.callCount ).toBe( 1, "expect flash" );
        expect( res.json.callCount ).toBe( 1, "expect res.json" );
        expect( next.callCount ).toBe( 0, "expect no next" );
      } );
    } );

    it( "should throw an error if username is reserved", () => {
      const reservedUsernames = [ "test", "help", "github", "access", "admin", "bot", "calendar", "img", "issue", "javascript", "mail", "manual", "notify", "server", "shop", "source", "sysadmin", "weather", "you" ]; // eslint-disable-line no-irregular-whitespace

      reservedUsernames.forEach( ( username ) => {
        setupSandbox();
        setupData( { username }, { username: 1 } );

        controller.validateRegister( req, res, next );

        expect( req.flash.callCount ).toBe( 1, "expected flash" );
        expect( res.json.callCount ).toBe( 1, "expected res.json" );
        expect( next.callCount ).toBe( 0, "expected no next" );
      } );
    } );

    it( "should not throw an error if username is not reserved", () => {
      const notReservedUsernames = [ "123", "jneidel", "nodejs", "mongodb", "express", "pug", "git", "webpack", "jwt", "sinon", "mocha", "vue", "eslint", "babel" ];

      notReservedUsernames.forEach( ( username ) => {
        setupSandbox();
        setupData( { username }, { username: 1 } );

        controller.validateRegister( req, res, next );

        expect( req.flash.callCount ).toBe( 0, "expected no flash" );
        expect( res.json.callCount ).toBe( 0, "expected no res.json" );
        expect( next.callCount ).toBe( 1, "expect next" );
      } );
    } );
  } );

  describe( "checkDublicateUsername", () => {
    it( "should call findOne with req.body.username", async () => {
      sandbox.reset();
      mongo.resetSpies();
      req.body = {
        db      : mongo,
        username: "456",
      };

      await controller.checkDublicateUsername( req, res, next );

      expect( mongo.findOne.callCount ).toBe( 1, "expect findOne" );
      expect( mongo.findOne.calledWith( { username: req.body.username } ) ).toBeTruthy( "expect findOne called with username" );
    } );
  } );

  describe( "createCookie", () => {
    const res = {
      clearCookie: sinon.spy(),
      cookie     : sinon.spy(),
      json       : () => {},
    };

    it( "should remove old cookie and create new one", () => {
      controller.createCookie( { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpuZWlkZWwiLCJpYXQiOjE1MTUwOTgxMTJ9.DrhM7_qMnhWaeKtRwg37oy-git4OAJ7-b1FMBTAmUdc" }, res, () => {} );

      expect( res.clearCookie.calledWith( "token" ) ).toBeTruthy( "expected to remove token" );
      expect( res.cookie.calledWith(
        "token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpuZWlkZWwiLCJpYXQiOjE1MTUwOTgxMTJ9.DrhM7_qMnhWaeKtRwg37oy-git4OAJ7-b1FMBTAmUdc", {
          maxAge  : 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          Secure  : true,
        } ) ).toBeTruthy( "expected cookie to be created with right args" );
    } );
  } );
} );
