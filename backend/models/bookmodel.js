const mongoose = require('mongoose');

const BookSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is Required'],
    },
    author: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    tags: {
      type: [String],
      enum: ['IIT-JEE', 'NEET', 'LAW', 'CBSE', 'SCIENCE', 'COMMERCE'],
    },
    price: {
      type: Number,
      min: [0, 'Price can be positive only'],
      requried: [true, 'Please add Price'],
    },
    about: {
      type: String,
      max: 300,
    },
    location: {
      type: String,
      required: [true, 'Please Enter you location'],
    },
  },
  {
    timestamps: true,
  }
);

const BookModel = mongoose.model('Book', BookSchema);
module.exports = BookModel;

// Books need Information of
// name
// Author
// PostedON
// owner
// Tags
// Price
// Photo
// About
// Location
//
