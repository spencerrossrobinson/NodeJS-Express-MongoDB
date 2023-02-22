const MongoClient = require("mongodb").MongoClient;
const assert = require("assert").strict;
//short for db operator
const dboper = require("./operations");

const url = "mongodb://localhost:27017/";
const dbname = "nucampsite";

//Fixing the callback hell that was required by using the promise system
MongoClient.connect(url, { useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected correctly to server");

    const db = client.db(dbname);

    db.dropCollection("campsites")
      .then((result) => {
        console.log("Dropped Collection:", result);
      })
      //Will drop the collection if it does no exist
      .catch((err) => console.log("No collectsion to drop."));
    //Will respond with error if no colletion to drop

    //now each previous callback is waiting on a promise to be fulfilled before running so we dont ahve async callbacks running out of place. each one hits a blocker and waits for the one before it to run
    dboper
      .insertDocument(
        db,
        { name: "Breadcrumb Trail Campground", description: "Test" },
        "campsites"
      )
      //using then to asign promises to each previous callback
      .then((result) => {
        console.log("Insert Document:", result.ops);

        return dboper.findDocuments(db, "campsites");
      })
      .then((docs) => {
        console.log("Found Documents:", docs);

        return dboper.updateDocument(
          db,
          { name: "Breadcrumb Trail Campground" },
          { description: "Updated Test Description" },
          "campsites"
        );
      })
      .then((result) => {
        console.log("Updated Document Count:", result.result.nModified);

        return dboper.findDocuments(db, "campsites");
      })
      .then((docs) => {
        console.log("Found Documents:", docs);

        return dboper.removeDocument(
          db,
          { name: "Breadcrumb Trail Campground" },
          "campsites"
        );
      })
      .then((result) => {
        console.log("Deleted Document Count:", result.deletedCount);

        return client.close();
      })
      .catch((err) => {
        console.log(err);
        client.close();
      });
  })
  .catch((err) => console.log(err));
//error catch at the end outside of scope of function
