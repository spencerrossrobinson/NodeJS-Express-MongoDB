const mongoose = require("mongoose");
const Campsite = require("./models/campsite");
//importing mongoose and the campsite schema we created in campsite.js

const url = "mongodb://localhost:27017/nucampsite";
//set up base url and some objects that are all set to true
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindandModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//connect method returns promise, chain then method
connect.then(() => {
  console.log("Connected correctly to server");

  //passing in a object that will fill Campsite model
  //const newCampsite = new Campsite

  //different way to get same result
  Campsite.create({
    name: "React Lake Campground",
    description: "test",
  })

    //mongoose method that saves doc to database
    // .save()
    .then((campsite) => {
      console.log(campsite);
      //finds campsite by id and updates description with test
      return Campsite.findByIdAndUpdate(
        campsite._id,
        {
          $set: { description: "Updated Test Document" },
        },
        {
          //this will cause method to return updated doc, defualt is to return original
          new: true,
        }
      );
      //   return Campsite.find();
      //returns saved campsite if succeeded and returns Campsite.find to look for all docs based on that campsite model
    })
    .then((campsite) => {
      console.log(campsite);
      // pushing a new comment object into the comment area fulfilling the schema properties
      campsite.comments.push({
        rating: 5,
        text: "What a magnificent fucking view!",
        author: "Tinus lOrvaldesw FUck",
      });
      //returning the new campsite and saving it
      return campsite.save();
    })
    .then((campsite) => {
      console.log(campsite);
      //returns found object inside array
      return Campsite.deleteMany();
      //delete campsite doc
    })
    .then(() => {
      return mongoose.connection.close();
      //close connection
    })
    .catch((err) => {
      console.log(err);
      mongoose.connection.close();
      //sets up error message and closes connection if there is an error
    });
});
//all async built on promises
