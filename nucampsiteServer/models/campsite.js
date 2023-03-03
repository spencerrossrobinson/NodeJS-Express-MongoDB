const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//this loads new currency type into mongoose so its ready for schemas to use
require("mongoose-currency").loadType(mongoose);
//sets up short hand for currency
const Currency = mongoose.Types.Currency;

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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
    image: {
      type: String,
      required: true,
    },
    elevation: {
      type: Number,
      required: true,
    },
    cost: {
      // uses the currency short hand we set up
      type: Currency,
      required: true,
      min: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    //this will cause every campsite doc to contain multiple comment docs stored within an array,
    //nested schema for comment field
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

const Campsite = mongoose.model("Campsite", campsiteSchema);

module.exports = Campsite;
