exports.insertDocument = (db, document, collection) => {
  //expecting collection argument to be a string, use that string as a argument
  const coll = db.collection(collection);
  return coll.insertOne(document);
  // callback is defined somewhere else in code, if error is not found it moves to the callback defined and returns the result
};

exports.findDocuments = (db, collection) => {
  const coll = db.collection(collection);
  // gives us access to all document in db
  return coll.find().toArray();
  //checking to see if any error in the found docs, return it
};

exports.removeDocument = (db, document, collection) => {
  const coll = db.collection(collection);
  return coll.deleteOne(document);
  //result will be an object with info on what was deleted
};

exports.updateDocument = (db, document, update, collection) => {
  const coll = db.collection(collection);
  //set is known to mongodb as update operator
  return coll.updateOne(document, { $set: update }, null);
};
