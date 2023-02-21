const MongoClient = require("mongodb").MongoClient;
const assert = require("assert").strict;
//short for db operator
const dboper = require("./operations");

const url = "mongodb://localhost:27017/";
const dbname = "nucampsite";

MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
  assert.strictEqual(err, null);

  console.log("Connected correctly to server");

  const db = client.db(dbname);

  db.dropCollection("campsites", (err, result) => {
    assert.strictEqual(err, null);
    console.log("Dropped Collection", result);
    // calling the function from operation.js and taking the four parameters defined in operations.js and adding them into the argument list.
    dboper.insertDocument(
      db,
      { name: "Breadcrumb Trail Campground", description: "Test" },
      "campsites",
      (result) => {
        console.log("Insert Document:", result.ops);
        // nesting callback functions
        dboper.findDocuments(db, "campsites", (docs) => {
          console.log("Found Documents:", docs);
          //Look for the doc with name Breadcrumb and update it with Description
          dboper.updateDocument(
            db,
            { name: "Breadcrumb Trail Campground" },
            { description: "Updated Test Description" },
            "campsites",
            (result) => {
              console.log("Updated Document Count:", result.result.nModified);
              // Looks for the updated docs
              dboper.findDocuments(db, "campsites", (docs) => {
                console.log("Found Documents:", docs);
                //removes doc with name Breadcrumb Trail and returns that info
                dboper.removeDocument(
                  db,
                  { name: "Breadcrumb Trail Campground" },
                  "campsites",
                  (result) => {
                    console.log("Deleted Document Count:", result.deletedCount);
                    // close out the callback functions
                    client.close();
                  }
                );
              });
            }
          );
        });
      }
    );
  });
});
