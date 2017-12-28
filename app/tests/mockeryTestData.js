const sinon = require( "sinon" );

const mongo = {
  connect   : sinon.stub(),
  connect_re: {
    close: sinon.spy(),
    catch: sinon.spy(),
  },
  collection: sinon.stub(),
  findOne   : sinon.stub(),
  setup     : () => {
    mongo.MongoClient = { connect: mongo.connect };

    mongo.connect.returns( mongo.connect_re );
    mongo.connect_re.collection = mongo.collection;

    mongo.collection.returns( { findOne: mongo.findOne } );

    mongo.findOne.returns( { result: { ok: 1 } } );
  },
  resetSpies: () => {
    mongo.connect.reset();
    mongo.collection.reset();
    mongo.findOne.reset();
    mongo.connect_re.close.reset();
    mongo.connect_re.catch.reset();

    mongo.setup();
  },
};

mongo.setup();

exports.mongo = mongo;
