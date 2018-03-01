const sinon = require( "sinon" );
const { passwords, tokens } = require( "./data" ); // Factories need closure over these objects

/* eslint-disable no-use-before-define */

// 'createDependency' factories return a unique, isolated obj of stubs/spies to be easily asserted against and edited in the test they are being used in

exports.createMongo = () => {
  const sb = sinon.createSandbox();

  const mongo = {
    aggregate  : sb.stub(),
    catch      : sb.spy(),
    close      : sb.spy(),
    collection : sb.stub(),
    connect    : sb.stub(),
    find       : sb.stub(),
    findOne    : sb.stub(),
    insertOne  : sb.stub(),
    insertMany : sb.stub(),
    toArray    : sb.stub(),
    updateOne  : sb.stub(),
    MongoClient: {},
  };

  mongo.MongoClient.connect = mongo.connect;
  mongo.connect.resolves( mongo );
  mongo.collection.returns( mongo );
  mongo.find.returns( { toArray: mongo.toArray } );
  mongo.aggregate.returns( { toArray: mongo.toArray } );

  return mongo;
};

exports.createRsa = () => {
  const sb = sinon.createSandbox();

  const rsaMock = {
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
    compareSync: sb.stub(),
    hashSync   : sb.stub(),
  };

  bcrypt.compareSync.returns( ( clear, hashed ) => !!( clear === passwords.encryptedPass && hashed === passwords.hashedPass ) );
  bcrypt.hashSync.returns( passwords.hashedPass );

  return bcrypt;
};

exports.createJwt = () => {
  const sb = sinon.createSandbox();

  const jwt = {
    sign: sb.stub(),
  };

  jwt.sign.resolves( tokens.token );

  return jwt;
};

exports.createFs = () => {
  const sb = sinon.createSandbox();

  const fs = {
    readFile: sb.stub(),
  };

  fs.readFile.resolves( null );

  return fs;
};

