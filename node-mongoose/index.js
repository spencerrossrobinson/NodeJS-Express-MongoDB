const mongoose = require("mongoose");
const Campsite = require("./models/campsite");
//importing mongoose and the campsite schema we created in campsite.js

const url = "mongodb://localhost:27017/nucampsite";
//set up base url and some objects that are all set to true
const connect = mongoose.connect(url, {
  useCreateIndex: true,
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
      return Campsite.find();
      //returns saved campsite if succeeded and returns Campsite.find to look for all docs based on that campsite model
    })
    .then((campsites) => {
      console.log(campsites);
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
