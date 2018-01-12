const sinon = require( "sinon" );

const mockerySandbox = sinon.createSandbox();

exports.mockReset = () => {
  mockerySandbox.reset();
};

const mongod = { // simulated database
  users: [],
  cards: [],
  setup: ( data ) => {
    mongod.users = data.users;
    mongod.cards = data.cards;
  },
};

const mongo = { // mock obj for mongodb functions
  connect   : mockerySandbox.stub(),
  collection: mockerySandbox.stub(),
  find      : mockerySandbox.stub(),
  findOne   : mockerySandbox.stub(),
  toArray   : mockerySandbox.stub(),
  close     : mockerySandbox.spy(),
  catch     : mockerySandbox.spy(),
  updateOne : ( ...args ) => {
    /*
     * In: query, update
     * Out:
     *  - update login time
     */
    const username = args[0].username;
    const update = args[1];

    if ( update && update.$push && update.$push.logins ) { // checks if insert login time login
      mongod.users[0].logins.push( update.$push.logins.time );
    }
  },
  setup: ( data = {}, mongodData = {} ) => {
    /*
     * In: mongo, mongod setup data
     * Out: mongo obj ready for insertion as a mock
     */
    mongo.MongoClient = { connect: mongo.connect };

    mongo.connect.resolves( mongo );
    mongo.collection.returns( mongo );

    mongo.findOne.resolves( data.findOne );

    mongo.find.returns( { toArray: mongo.toArray } );
    mongo.toArray.resolves( data.find );

    mongod.setup( mongodData );
  },
};

const tokenStates = {
  token         : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpuZWlkZWwiLCJpYXQiOjE1MTUxNDIyNTJ9._chGR5i3ToikSc76ZpkkRs5UyXbP2Etl8Hdp1Jr_Yr8",
  encryptedToken: "GeWMX+TuKuKnNjKwXb6Cvhmvc2EaxByOWjC/8aTs1J+lAak/C8LAs6y99fRb4+0P1xUjMPUbZ/gguaqomG7t+GEjx2jZrEjcG/jtR+XwZx1iZyi4JyARwTRyT3OkCWSqsUFzzehggcxG8B2F9hvvzPm39lxNVMmXWrcEF+aQoJYRgTRh/T7x9pOnOJFcoMVzQPMgRtwZML9WxVVIiPjXt8+SBNg06buBSLdZptsMMKXFMico4/nHhlTxLrFBLt0bkY7uEdaeS9l1lazM71LVmnH8dw5eBtALZIdzXGnvOvD5BJyNS5Fy9AtfFM+YooQjXJ74xDSOOR1hjc+m62jVrA==",
  parsedToken   : "R2VXTVgrVHVLdUtuTmpLd1hiNkN2aG12YzJFYXhCeU9XakMvOGFUczFKK2xBYWsvQzhMQXM2eTk5ZlJiNCswUDF4VWpNUFViWi9nZ3VhcW9tRzd0K0dFangyalpyRWpjRy9qdFIrWHdaeDFpWnlpNEp5QVJ3VFJ5VDNPa0NXU3FzVUZ6emVoZ2djeEc4QjJGOWh2dnpQbTM5bHhOVk1tWFdyY0VGK2FRb0pZUmdUUmgvVDd4OXBPbk9KRmNvTVZ6UVBNZ1J0d1pNTDlXeFZWSWlQalh0OCtTQk5nMDZidUJTTGRacHRzTU1LWEZNaWNvNC9uSGhsVHhMckZCTHQwYmtZN3VFZGFlUzlsMWxhek03MUxWbW5IOGR3NWVCdEFMWklkelhHbnZPdkQ1Qkp5TlM1Rnk5QXRmRk0rWW9vUWpYSjc0eERTT09SMWhqYyttNjJqVnJBPT0=",
  encryptedPass : "WjlWVmRnaXM4dE1pOG4yZ0x6RjBNcXdWcEZhRU0xN0dQN3VSS3NMUGtNQlI3SE9jbEpKdmVaVncxamNOeFRSQ0FYYk5BS0xTSGFYYXBiSlVaYm5MV241Sk4vc3BPbFpXcStmbUlqR0kwbEtneHorakh0aEpHd3NKRVhaVEFDZWFnQmFXcE05NmlKQStmdE5vUDBBUzR3YUVmVFhHV2lYQjJaTi9iTklEdnpJaEZSditMcjBEd0RIQnMrMHF3TytjUG5vZy9iSGdTQTBIcFpMaWppN091RDVsaWRUcStxdkpHY1M4UW10MXE1UkdDTHBUSiswWmxHUXQreHVOd3JzRmNOZXZjQWxJNktoK1NYMXlCMUdaR05DNTZvMjVmcG5ZaW1lSmdTbzh1NHMrUnA1V2Z5b01NN1JFeC9ETlVCaDBiV1RxekdSVk5VaElIVEhtbjdxemh3PT0=",
  decryptedPass : "123",
};

const rsaMock = {
  importKey: mockerySandbox.spy(),
  encrypt  : mockerySandbox.stub(),
  decrypt  : mockerySandbox.stub(),
  setup    : ( tokens ) => {
    rsaMock.encrypt.returns( tokens.encryptedToken );

    rsaMock.decrypt.onFirstCall( tokens.encryptedPass );
  },
};
/*
Needs this class to initialize:
  class rsa {
    constructor() {
      return rsaMock;
    }
  }
*/

exports.mongo = mongo;
exports.mongod = mongod;
exports.rsaMock = rsaMock;
exports.tokenStates = tokenStates;
