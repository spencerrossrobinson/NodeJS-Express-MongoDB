const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//setting up a new schema for users with three properties username, password, admin
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
});
// creating model and exporting it all in one line
module.exports = mongoose.model("User", userSchema);
