const expect = require( "expect" );
const sinon = require( "sinon" );
const mockery = require( "mockery" );
const { mongo, mongod, rsaMock, tokenStates } = require( "./mockeryTestData" );
process.env.SECRET = "123";

/* global describe it */

mockery.enable( {
  warnOnUnregistered: false,
} );
mockery.registerMock( "mongodb", mongo );

const account = require( "../controllers/accountController" );
const database = require( "../controllers/databaseController" );
const encryption = require( "../controllers/encryptionController" );
const header = require( "../controllers/headerController.js" );
const { setupToken } = require( "../handlers/tokenHandler" );

const sandbox = sinon.sandbox.create();

function setupSandbox( doc ) {
  /*
   * In: testData document, req, res, mongo
   * Out: reset and configured globals req, res
   */
  sandbox.restore();
  const req = doc.req;
  const res = doc.res;
  req.flash = sandbox.spy();
  res.json = sandbox.spy();
  res.cookie = sandbox.spy();
  res.clearCookie = sandbox.spy();
  mongo.setup( doc.mongo, doc.mongod );

  return { req, res };
}

function setupTestData() {
  /*
   * In: -
   * Out: valid testData to be corrupted as suited
   */
  const data = [
    { req: {
      body: { username: "jneidel", password: "WjlWVmRnaXM4dE1pOG4yZ0x6RjBNcXdWcEZhRU0xN0dQN3VSS3NMUGtNQlI3SE9jbEpKdmVaVncxamNOeFRSQ0FYYk5BS0xTSGFYYXBiSlVaYm5MV241Sk4vc3BPbFpXcStmbUlqR0kwbEtneHorakh0aEpHd3NKRVhaVEFDZWFnQmFXcE05NmlKQStmdE5vUDBBUzR3YUVmVFhHV2lYQjJaTi9iTklEdnpJaEZSditMcjBEd0RIQnMrMHF3TytjUG5vZy9iSGdTQTBIcFpMaWppN091RDVsaWRUcStxdkpHY1M4UW10MXE1UkdDTHBUSiswWmxHUXQreHVOd3JzRmNOZXZjQWxJNktoK1NYMXlCMUdaR05DNTZvMjVmcG5ZaW1lSmdTbzh1NHMrUnA1V2Z5b01NN1JFeC9ETlVCaDBiV1RxekdSVk5VaElIVEhtbjdxemh3PT0=" /* 123 */ } },
    res       : {},
    mongo     : { findOne: { result: { ok: 1 } } },
    mongod    : { users: {} },
    hashedPass: "$2a$10$aofxmYLhabyVqsvyvpUYduwJk1UCZIlTYUtW1Mc9x9luhiaNEc2hu", /* 123 */
    },
  ];

  // setting up mongo(d) properties to remove dublicate code
  for ( let i = 0; i < data.length; i++ ) {
    const username = data[i].req.body.username;
    const hashedPass = data[i].hashedPass;

    data[i].mongo.find = [ { _id: 1, username, password: hashedPass } ];
    data[i].mongod.users = [ { username, password: hashedPass, logins: [] } ];
  }

  return data;
}

async function runLoginProcess( req, res ) {
  await encryption.decryptBody( req, res, () => {} );
  await database.connectDatabase( req, res, () => {} );
  await account.login( req, res, () => {} );
  await setupToken( req, res, () => {} );
}

describe( "/api/login", () => {
  it( "should not throw on valid login", () => {
    const testData = setupTestData();

    testData.forEach( async ( doc ) => {
      const temp = setupSandbox( doc );
      const req = temp.req;
      const res = temp.res;

      await runLoginProcess( req, res );

      expect( req.body.username ).toBe( doc.req.body.username );
      expect( req.token ).toBeTruthy( "expect token" );
      expect( res.cookie.callCount ).toBe( 1, "expect cookie" );
      expect( res.json.calledWith( { success: true } ) ).toBeTruthy( "expect success res.json" );
    } );
  } );

  it( "should throw on invalid password", () => {
    const testData = setupTestData();
    testData[0].req.body.password = "VHo5TUtNdXpHQmdWNkZVTU95SFJ4eUp0YkJjdjdBdVBZVVoyNWwvalpWQnltM0hPL3pKQXh3QXpuaTBkdDV5VjRac0p5SDZHcTVXK01TNmptd0RqNGRja3RrSFZPMlJXTWxEa01aSzVuV0dlZWNaRW4yckV4NGtYdHg1eGltSzE1K1FkbFJ3R3dvMXNMRFhob3FCNnRvbEV6K1YwaXl5aGY1S2lFZnpKNHp2S0RxaXh2RVcwVkVheHM1ME5ibWtiNWllNHIxVS82TnZscWJzTTdKMFVDYnBDaThBeXQxbGRnNE1BRjFwODZBL1JYYWM4aHN0ZllTbDJYYmR6by9DN1BaYzFRSDg3RDJ4OWdCNXhDOVFuNXFWdzlxWktDWHVoVnBhMzBkMnM3SE80OWsvRmNQeTVzbFFNbEo4SkxhSEx5RDJ4NDVuYWtrdEF1YmJJdVdZVjZ3PT0="; // 321

    testData.forEach( async ( doc ) => {
      const temp = setupSandbox( doc );
      const req = temp.req;
      const res = temp.res;

      await runLoginProcess( req, res );

      expect( req.flash.calledWith( "error", "Invalid password" ) ).toBeTruthy( "expect correct error message flash" );
      expect( res.json.calledWith( { error: true } ) ).toBeTruthy( "expect error res.json" );
    } );
  } );
} );
