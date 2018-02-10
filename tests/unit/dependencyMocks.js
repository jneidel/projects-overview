const sinon = require( "sinon" );

/* eslint-disable no-use-before-define */

// 'createDependency' factories return a unique, isolated obj of stubs/spies to be easily asserted against and edited in the test they are being used in

exports.createMongo = () => {
  const sb = sinon.createSandbox();

  const mongo = {
    sandbox    : sb,
    connect    : sb.stub(),
    collection : sb.stub(),
    find       : sb.stub(),
    findOne    : sb.stub(),
    toArray    : sb.stub(),
    close      : sb.spy(),
    catch      : sb.spy(),
    updateOne  : sb.stub(),
    MongoClient: {},
  };

  mongo.MongoClient.connect = mongo.connect;
  mongo.connect.resolves( mongo );
  mongo.collection.returns( mongo );
  mongo.find.returns( { toArray: mongo.toArray } );

  return mongo;
};

exports.createRsa = () => {
  const sb = sinon.createSandbox();

  const rsaMock = {
    sandbox  : sb,
    importKey: sb.spy(),
    encrypt  : sb.stub(),
    decrypt  : sb.stub(),
  };

  rsaMock.encrypt.returns( tokens.encryptedToken );
  rsaMock.decrypt.returns( passwords.cleartext );

  class rsa {
    constructor() {
      return rsaMock;
    }
  }

  return rsa;
};

exports.createBcrypt = () => {
  const sb = sinon.createSandbox();

  const bcrypt = {
    sandbox    : sb,
    compareSync: sb.stub(),
  };

  bcrypt.compareSync.returns( ( clear, hashed ) => !!( clear === passwords.encryptedPass && hashed === passwords.hashedPass ) );

  return bcrypt;
};

exports.createJwt = () => {
  const sb = sinon.createSandbox();

  const jwt = {
    sandbox: sb,
    sign   : sb.stub(),
  };

  jwt.sign.resolves( tokens.token );

  return jwt;
};

exports.createFs = () => {
  const sb = sinon.createSandbox();

  const fs = {
    sandbox : sb,
    readFile: sb.stub(),
  };

  fs.readFile.resolves( null );

  return fs;
};

const tokens = {
  token         : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpuZWlkZWwiLCJpYXQiOjE1MTUxNDIyNTJ9._chGR5i3ToikSc76ZpkkRs5UyXbP2Etl8Hdp1Jr_Yr8",
  encryptedToken: "GeWMX+TuKuKnNjKwXb6Cvhmvc2EaxByOWjC/8aTs1J+lAak/C8LAs6y99fRb4+0P1xUjMPUbZ/gguaqomG7t+GEjx2jZrEjcG/jtR+XwZx1iZyi4JyARwTRyT3OkCWSqsUFzzehggcxG8B2F9hvvzPm39lxNVMmXWrcEF+aQoJYRgTRh/T7x9pOnOJFcoMVzQPMgRtwZML9WxVVIiPjXt8+SBNg06buBSLdZptsMMKXFMico4/nHhlTxLrFBLt0bkY7uEdaeS9l1lazM71LVmnH8dw5eBtALZIdzXGnvOvD5BJyNS5Fy9AtfFM+YooQjXJ74xDSOOR1hjc+m62jVrA==",
  parsedToken   : "R2VXTVgrVHVLdUtuTmpLd1hiNkN2aG12YzJFYXhCeU9XakMvOGFUczFKK2xBYWsvQzhMQXM2eTk5ZlJiNCswUDF4VWpNUFViWi9nZ3VhcW9tRzd0K0dFangyalpyRWpjRy9qdFIrWHdaeDFpWnlpNEp5QVJ3VFJ5VDNPa0NXU3FzVUZ6emVoZ2djeEc4QjJGOWh2dnpQbTM5bHhOVk1tWFdyY0VGK2FRb0pZUmdUUmgvVDd4OXBPbk9KRmNvTVZ6UVBNZ1J0d1pNTDlXeFZWSWlQalh0OCtTQk5nMDZidUJTTGRacHRzTU1LWEZNaWNvNC9uSGhsVHhMckZCTHQwYmtZN3VFZGFlUzlsMWxhek03MUxWbW5IOGR3NWVCdEFMWklkelhHbnZPdkQ1Qkp5TlM1Rnk5QXRmRk0rWW9vUWpYSjc0eERTT09SMWhqYyttNjJqVnJBPT0=",
};

const passwords = {
  cleartext    : "123",
  encryptedPass: "WjlWVmRnaXM4dE1pOG4yZ0x6RjBNcXdWcEZhRU0xN0dQN3VSS3NMUGtNQlI3SE9jbEpKdmVaVncxamNOeFRSQ0FYYk5BS0xTSGFYYXBiSlVaYm5MV241Sk4vc3BPbFpXcStmbUlqR0kwbEtneHorakh0aEpHd3NKRVhaVEFDZWFnQmFXcE05NmlKQStmdE5vUDBBUzR3YUVmVFhHV2lYQjJaTi9iTklEdnpJaEZSditMcjBEd0RIQnMrMHF3TytjUG5vZy9iSGdTQTBIcFpMaWppN091RDVsaWRUcStxdkpHY1M4UW10MXE1UkdDTHBUSiswWmxHUXQreHVOd3JzRmNOZXZjQWxJNktoK1NYMXlCMUdaR05DNTZvMjVmcG5ZaW1lSmdTbzh1NHMrUnA1V2Z5b01NN1JFeC9ETlVCaDBiV1RxekdSVk5VaElIVEhtbjdxemh3PT0=",
  hashedPass   : "$2a$10$aofxmYLhabyVqsvyvpUYduwJk1UCZIlTYUtW1Mc9x9luhiaNEc2hu",
};

// No direct export as factories need closure over these objects
exports.tokens = tokens;
exports.passwords = passwords;

