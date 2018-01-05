const expect = require( "expect" );
const sinon = require( "sinon" );
const mockery = require( "mockery" );
const { mongo } = require( "./mockeryTestData" );

/* global describe it */

const controller = require( "../controllers/accountController" );

describe( "accountController", () => {
  describe( "validateRegister", () => {
    const reservedUsernames = require( "../data/reserved-usernames" ); // eslint-disable-line global-require 
    const req = {
      flash       : sinon.spy(),
      checkBody   : sinon.stub(),
      checkBody_re: {
        notEmpty: sinon.spy(),
        equals  : sinon.spy(),
      },
      sanitizeBody    : sinon.spy(),
      validationErrors: () => false,
      body            : {
        username: "123",
        db      : mongo,
      },
    };
    const res = { json: sinon.spy() };

    req.checkBody.returns( req.checkBody_re );

    function setupForEach() {
      req.flash.reset();
      res.json.reset();
    }

    it( "should call all validation functions", () => {
      controller.validateRegister( req, res, () => {} );

      expect( req.checkBody_re.notEmpty.callCount ).toBe( 3, "checkBody.notEmpty wasnt called three times" );
      expect( req.checkBody_re.equals.callCount ).toBe( 1, "checkBody.equals wasnt called" );
      expect( req.sanitizeBody.callCount ).toBe( 1, "sanitizeBody wasnt called" );

      expect( req.checkBody.calledWith( "username", "Please supply a username." ) ).toBeTruthy( "checkBody wasnt called with username" );
      expect( req.checkBody.calledWith( "password", "Please supply a password." ) ).toBeTruthy( "checkBody wasnt called with password" );
      expect( req.checkBody.calledWith( "password_confirm", "Please supply a confirm password." ) ).toBeTruthy( "checkBody wasnt called with password_confirm" );
      expect( req.checkBody.calledWith( "password_confirm", "Your passwords do not match." ) ).toBeTruthy( "checkBody.equals wasnt called with password_confirm" );
      expect( req.sanitizeBody.calledWith( "username" ) ).toBeTruthy( "sanitizeBody wasnt called" );
    } );

    it( "should throw if username is reserved", () => {
      const reservedUsernames = [ "test", "help", "github", "access", "admin", "bot", "calendar", "img", "issue", "javascript", "mail", "manual", "notify", "server", "shop", "source", "sysadmin", "weather", "you" ]; // eslint-disable-line no-irregular-whitespace

      reservedUsernames.forEach( ( username ) => {
        setupForEach();
        req.body.username = username;

        controller.validateRegister( req, res, () => {} );

        expect( req.flash.callCount ).toBe( 1 );
        expect( res.json.callCount ).toBe( 1 );

        expect( req.flash.calledWith( "error", "Username is reserved" ) ).toBeTruthy( "incorrect flash on reserved username" );
        expect( res.json.calledWith( { error: true } ) ).toBeTruthy( "incorrect json res on reserved username" );
      } );

      const notReservedUsernames = [ "123", "jneidel", "nodejs", "mongodb", "express", "pug", "git", "webpack", "jwt", "sinon", "mocha", "vue", "eslint", "babel" ];

      notReservedUsernames.forEach( ( username ) => {
        setupForEach();
        req.body.username = username;

        controller.validateRegister( req, res, () => {} );

        expect( req.flash.callCount ).toBe( 0, "incorrect flash on not reserved username" );
        expect( res.json.callCount ).toBe( 0, "incorrect json res on not reserved username" );
      } );
    } );

    it( "should throw if validationErrors are passed", () => {
      const errors = [ "Please supply a username.", "Please supply a password.", "Please supply a confirm password.", "Your passwords do not match." ];

      errors.forEach( ( err ) => {
        setupForEach();
        req.validationErrors = () => [ err ];

        controller.validateRegister( req, res, () => {} );

        expect( req.flash.callCount ).toBe( 1, "incorrect flash on passed validation error" );
        expect( res.json.callCount ).toBe( 1, "incorrect json res on passed validation error" );
        expect( res.json.calledWith( { error: true } ) ).toBeTruthy( "incorrect json res on passed validation error" );
        // maybe: check error msg
      } );

      req.validationErrors = () => false;
    } );

    it( "should call findOne with req.body.username", () => {
      mongo.resetSpies();

      controller.validateRegister( req, res, () => {} );

      expect( mongo.findOne.callCount ).toBeTruthy();
      expect( mongo.findOne.calledWith( { username: req.body.username } ) ).toBeTruthy();
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
