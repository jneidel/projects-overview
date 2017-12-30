const expect = require( "expect" );
const sinon = require( "sinon" );
const mockery = require( "mockery" );
const { mongo } = require( "./mockeryTestData" );

/* global describe it */

const controller = require( "../controllers/accountController" );

describe( "accountController", () => {
  describe( "validateRegister", () => {
    const reservedUsernames = require( "../data/reserved-usernames" ); // eslint-disable-line global-require 
    const args = {
      req: {
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
      },
      res: { json: sinon.spy() },
    };
    args.req.checkBody.returns( args.req.checkBody_re );

    function setupForEach() {
      args.req.flash.reset();
      args.res.json.reset();
    }

    it( "should call all validation functions", () => {
      controller.validateRegister( args.req, args.res, () => {} );

      expect( args.req.checkBody_re.notEmpty.callCount ).toBe( 3, "checkBody.notEmpty wasnt called three times" );
      expect( args.req.checkBody_re.equals.callCount ).toBe( 1, "checkBody.equals wasnt called" );
      expect( args.req.sanitizeBody.callCount ).toBe( 1, "sanitizeBody wasnt called" );

      expect( args.req.checkBody.calledWith( "username", "Please supply a username." ) ).toBeTruthy( "checkBody wasnt called with username" );
      expect( args.req.checkBody.calledWith( "password", "Please supply a password." ) ).toBeTruthy( "checkBody wasnt called with password" );
      expect( args.req.checkBody.calledWith( "password_confirm", "Please supply a confirm password." ) ).toBeTruthy( "checkBody wasnt called with password_confirm" );
      expect( args.req.checkBody.calledWith( "password_confirm", "Your passwords do not match." ) ).toBeTruthy( "checkBody.equals wasnt called with password_confirm" );
      expect( args.req.sanitizeBody.calledWith( "username" ) ).toBeTruthy( "sanitizeBody wasnt called" );
    } );

    it( "should throw if username is reserved", () => {
      const reservedUsernames = [ "test", "help", "github", "access", "admin", "bot", "calendar", "img", "issue", "javascript", "mail", "manual", "notify", "server", "shop", "source", "sysadmin", "weather", "you" ]; // eslint-disable-line no-irregular-whitespace

      reservedUsernames.forEach( ( username ) => {
        setupForEach();
        args.req.body.username = username;

        controller.validateRegister( args.req, args.res, () => {} );

        expect( args.req.flash.callCount ).toBe( 1 );
        expect( args.res.json.callCount ).toBe( 1 );

        expect( args.req.flash.calledWith( "error", "Username is reserved" ) ).toBeTruthy( "incorrect flash on reserved username" );
        expect( args.res.json.calledWith( { error: true } ) ).toBeTruthy( "incorrect json res on reserved username" );
      } );

      const notReservedUsernames = [ "123", "jneidel", "nodejs", "mongodb", "express", "pug", "git", "webpack", "jwt", "sinon", "mocha", "vue", "eslint", "babel" ];

      notReservedUsernames.forEach( ( username ) => {
        setupForEach();
        args.req.body.username = username;

        controller.validateRegister( args.req, args.res, () => {} );

        expect( args.req.flash.callCount ).toBe( 0, "incorrect flash on not reserved username" );
        expect( args.res.json.callCount ).toBe( 0, "incorrect json res on not reserved username" );
      } );
    } );

    it( "should throw if validationErrors are passed", () => {
      const errors = [ "Please supply a username.", "Please supply a password.", "Please supply a confirm password.", "Your passwords do not match." ];

      errors.forEach( ( err ) => {
        setupForEach();
        args.req.validationErrors = () => [ err ];

        controller.validateRegister( args.req, args.res, () => {} );

        expect( args.req.flash.callCount ).toBe( 1, "incorrect flash on passed validation error" );
        expect( args.res.json.callCount ).toBe( 1, "incorrect json res on passed validation error" );
        expect( args.res.json.calledWith( { error: true } ) ).toBeTruthy( "incorrect json res on passed validation error" );
        // maybe: check error msg
      } );

      args.req.validationErrors = () => false;
    } );

    it( "should call findOne with req.body.username", () => {
      mongo.resetSpies();

      controller.validateRegister( args.req, args.res, () => {} );

      expect( mongo.findOne.callCount ).toBeTruthy();
      expect( mongo.findOne.calledWith( { username: args.req.body.username } ) ).toBeTruthy();
    } );
  } );
} );
