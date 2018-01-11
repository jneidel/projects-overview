const expect = require( "expect" );
const sinon = require( "sinon" );
const mockery = require( "mockery" );
const { mongo, mongod, rsaMock, tokenStates } = require( "./mockeryTestData" );

/* global describe it */

mockery.enable( {
  warnOnUnregistered: false,
} );

rsaMock.setup( tokenStates );
class rsa {
  constructor() {
    return rsaMock;
  }
}
// mongo.setup();

// mockery.registerMock( "node-rsa", rsa );
mockery.registerMock( "mongodb", mongo );

const account = require( "../controllers/accountController" );
const database = require( "../controllers/databaseController" );
const encryption = require( "../controllers/encryptionController" );

const sandbox = sinon.sandbox.create();
let req;
let res;
let next;
process.env.SECRET = "123";

function setupSandbox( doc ) {
  /*
   * In: testData document, req, res, next, mongo
   * Out: reset and configured globals req, res, next
   */
  sandbox.reset();
  mongo.setup( doc.mongo, doc.mongod );
  req = doc.req;
  res = doc.res;
  req.flash = sandbox.spy();
  res.json = sandbox.spy();
  res.cookie = sandbox.spy();
  res.clearCookie = sandbox.spy();
  next = sandbox.spy();
}

describe( "login", () => {
  it( "should not throw on valid login", async () => {
    const testData = [
      { req: {
        body: { username: "jneidel", password: "WjlWVmRnaXM4dE1pOG4yZ0x6RjBNcXdWcEZhRU0xN0dQN3VSS3NMUGtNQlI3SE9jbEpKdmVaVncxamNOeFRSQ0FYYk5BS0xTSGFYYXBiSlVaYm5MV241Sk4vc3BPbFpXcStmbUlqR0kwbEtneHorakh0aEpHd3NKRVhaVEFDZWFnQmFXcE05NmlKQStmdE5vUDBBUzR3YUVmVFhHV2lYQjJaTi9iTklEdnpJaEZSditMcjBEd0RIQnMrMHF3TytjUG5vZy9iSGdTQTBIcFpMaWppN091RDVsaWRUcStxdkpHY1M4UW10MXE1UkdDTHBUSiswWmxHUXQreHVOd3JzRmNOZXZjQWxJNktoK1NYMXlCMUdaR05DNTZvMjVmcG5ZaW1lSmdTbzh1NHMrUnA1V2Z5b01NN1JFeC9ETlVCaDBiV1RxekdSVk5VaElIVEhtbjdxemh3PT0=" } },
      res       : {},
      mongo     : { findOne: { result: { ok: 1 } } },
      mongod    : { users: {} },
      hashedPass: "$2a$10$aofxmYLhabyVqsvyvpUYduwJk1UCZIlTYUtW1Mc9x9luhiaNEc2hu",
      },
    ];
    ( function setupTestData() { // to remove dublicate code
      /*
       * In: testData
       * Out: testData with mongo(d) properties
       */
      for ( let i = 0; i < testData.length; i++ ) {
        const username = testData[i].req.body.username;
        const hashedPass = testData[i].hashedPass;

        testData[i].mongo.find = [ { _id: 1, username, password: hashedPass } ];
        testData[i].mongod.users = [ { username, password: hashedPass, logins: [] } ];
      }
    } )();

    testData.forEach( async ( doc ) => {
      setupSandbox( { req: doc.req, res: doc.res, mongo: doc.mongo, mongod: doc.mongod } );

      await encryption.decryptBody( req, res, () => {} );
      await database.connectDatabase( req, res, () => {} );
      encryption.handlePasswords( req, res, () => {} );
      await account.login( req, res, () => {} );
      await encryption.generateToken( req, res, () => {} );
      await encryption.encryptToken( req, res, () => {} );
      account.createCookie( req, res, () => {} );

      expect( req.body.username ).toBe( doc.req.body.username );
      expect( req.token ).toBeTruthy( "expect token" );
      expect( res.cookie.callCount ).toBe( 1, "expect cookie" );
      expect( res.json.calledWith( { success: true } ) ).toBeTruthy( "expect success res.json" );
    } );
  } );
} );
