const expect = require( "expect" );
const sinon = require( "sinon" );
const mockery = require( "mockery" );
const { mongo } = require( "./mockeryTestData" );

/* global describe it */

mockery.enable( {
  warnOnUnregistered: false,
} );

mockery.registerMock( "mongodb", mongo );
const controller = require( "../controllers/accountController" );

describe( "accountController", () => {
  describe( "checkUniqueUsername", () => {
    const docs = [
      {
        req: { flash: sinon.spy(),
          body : {
            username: "jneidel",
            password: "123",
          } },
        res : { json: sinon.spy() },
        next: sinon.spy(),
      },
    ]

    it( "should call findOne with req.body.username", async () => {
      docs.forEach( async ( doc ) => {
        mongo.resetSpies();
        
        await controller.checkUniqueUsername( doc.req, doc.res, doc.next );

        expect( mongo.findOne.callCount ).toBeTruthy();
        expect( mongo.findOne.calledWith( { username: doc.req.body.username } ) ).toBeTruthy();
      } );
    } );
  } );

  mockery.deregisterAll();
  mockery.disable();
} );
