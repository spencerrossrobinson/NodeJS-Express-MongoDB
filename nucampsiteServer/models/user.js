const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

//setting up a new schema for users with three properties username, password, admin
const userSchema = new Schema({
  //changing to just admin with use of passport
  //adding first and lastname values
  firstname: {
    type: String,
    default: "",
  },
  lastname: {
    type: String,
    default: "",
  },
  admin: {
    type: Boolean,
    default: false,
  },
});
//plugging in the plugin
userSchema.plugin(passportLocalMongoose);
// creating model and exporting it all in one line
module.exports = mongoose.model("User", userSchema);
