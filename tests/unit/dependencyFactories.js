const sinon = require( "sinon" );
const { passwords, tokens } = require( "./data" ); // Factories need closure over these objects

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

