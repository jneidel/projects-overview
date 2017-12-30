const sinon = require( "sinon" );

const mongo = {
  connect   : sinon.stub(),
  connect_re: {},
  collection: sinon.stub(),
  findOne   : sinon.stub(),
  close     : sinon.spy(),
  catch     : sinon.spy(),
  setup     : () => {
    mongo.MongoClient = { connect: mongo.connect };

    mongo.connect.returns( Promise.resolve( mongo.connect_re ) );
    mongo.connect_re.collection = mongo.collection;

    mongo.collection.returns( { findOne: mongo.findOne } );

    mongo.findOne.returns( Promise.resolve( { result: { ok: 1 } } ) );
  },
  resetSpies: () => {
    mongo.connect.reset();
    mongo.collection.reset();
    mongo.findOne.reset();
    mongo.close.reset();
    mongo.catch.reset();

    mongo.setup();
  },
};

mongo.setup();

exports.mongo = mongo;
