const assert = require("assert").strict;

exports.insertDocument = (db, document, collection, callback) => {
  //expecting collection argument to be a string, use that string as a argument
  const coll = db.collection(collection);
  coll.insertOne(document, (err, result) => {
    assert.strictEqual(err, null);
    // callback is defined somewhere else in code, if error is not found it moves to the callback defined and returns the result
    callback(result);
  });
};

exports.findDocuments = (db, collection, callback) => {
  const coll = db.collection(collection);
  // gives us access to all document in db
  coll.find().toArray((err, docs) => {
    assert.strictEqual(err, null);
    //checking to see if any error in the found docs, return it
    callback(docs);
  });
};

exports.removeDocument = (db, document, collection, callback) => {
  const coll = db.collection(collection);
  coll.deleteOne(document, (err, result) => {
    assert.strictEqual(err, null);
    //result will be an object with info on what was deleted
    callback(result);
  });
};

exports.updateDocument = (db, document, update, collection, callback) => {
  const coll = db.collection(collection);
  //set is known to mongodb as update operator
  coll.updateOne(document, { $set: update }, null, (err, result) => {
    assert.strictEqual(err, null);
    callback(result);
  });
};
