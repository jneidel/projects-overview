const expect = require( "expect" );
const sinon = require( "sinon" );
const mockery = require( "mockery" );
const mockeryData = require( "./mockeryTestData" );
const mongo = mockeryData.mongo;

/* global describe it */

mockery.enable( {
  warnOnUnregistered: false,
} );

mockery.registerMock( "mongodb", mongo );
const controller = require( "../controllers/databaseController" );

describe( "databaseController", () => {
  describe( "connectDatabase", () => {
   it( "should connect to database", ( done ) => {
      controller.connectDatabase( { body: {} }, {}, () => {} );

      expect( mongo.connect.called ).toBeTruthy();

      done();
    } );
  } );
} );
