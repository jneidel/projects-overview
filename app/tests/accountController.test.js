const expect = require( "expect" );
const sinon = require( "sinon" );
const mockery = require( "mockery" );

/* global describe it */

mockery.enable( {
  warnOnUnregistered: false,
} );

const mongo = {
  connect   : sinon.stub(),
  collection: sinon.stub(),
  findOne   : sinon.stub(),
};
mongo.MongoClient = { connect: mongo.connect };
mongo.connect.returns( {
  collection: mongo.collection,
  close     : () => {},
} );
mongo.collection.returns( { findOne: mongo.findOne } );
mongo.findOne.returns( { result: { ok: 1 } } );

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
    ];

    it( "should connect to database", ( done ) => {
      const doc = docs[0];
      controller.checkUniqueUsername( doc.req, doc.res, doc.next );

      expect( mongo.connect.called ).toBeTruthy();

      done();
    } );

    it( "should findOne with req username", ( done ) => {
      docs.forEach( ( doc ) => {
        controller.checkUniqueUsername( doc.req, doc.res, doc.next );

        expect( mongo.findOne.calledWith( { username: doc.req.body.username } ) ).toBeTruthy();
      } );

      done();
    } );
  } );

  mockery.deregisterAll();
  mockery.disable();
} );
