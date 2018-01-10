const sinon = require( "sinon" );

const mockerySandbox = sinon.createSandbox();

const mongo = {
  connect   : mockerySandbox.stub(),
  connect_re: {},
  collection: mockerySandbox.stub(),
  findOne   : mockerySandbox.stub(),
  close     : mockerySandbox.spy(),
  catch     : mockerySandbox.spy(),
  setup     : () => {
    mongo.MongoClient = { connect: mongo.connect };

    mongo.connect.returns( Promise.resolve( mongo.connect_re ) );
    mongo.connect_re.collection = mongo.collection;

    mongo.collection.returns( { findOne: mongo.findOne } );

    mongo.findOne.returns( Promise.resolve( { result: { ok: 1 } } ) );
  },
};

mongo.reset = () => {
  mockerySandbox.reset();
  mongo.setup();
}

exports.mockerySandbox = mockerySandbox;
exports.mongo = mongo;
