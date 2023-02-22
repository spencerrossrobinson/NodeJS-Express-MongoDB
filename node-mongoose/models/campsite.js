const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//commentSchema setup
const commentSchema = new Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
  },
  //starts a new object for timestamps
  {
    timestamps: true,
  }
);
//campstie schema set up
const campsiteSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    //this will cause every campsite doc to contain multiple comment docs stored within an array
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

const Campsite = mongoose.model("Campsite", campsiteSchema);

module.exports = Campsite;
