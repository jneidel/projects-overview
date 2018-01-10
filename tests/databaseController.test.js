const expect = require( "expect" );
const sinon = require( "sinon" );
const mockery = require( "mockery" );
const { mockReset, mongo } = require( "./mockeryTestData" );

/* global describe it */

mockery.enable( {
  warnOnUnregistered: false,
} );

mongo.setup();
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
