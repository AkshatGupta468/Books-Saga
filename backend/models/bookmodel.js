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
      ref: 'User',
    },
    tags: {
      type: [String],
      enum: [
        'IIT-JEE',
        'NEET',
        'LAW',
        'CBSE',
        'SCIENCE',
        'COMMERCE',
        'TEXT-BOOK',
      ],
      default: ['TEXT-BOOK'],
    },
    price: {
      type: Number,
    
      min: [0, 'Price can be positive only'],
      required: [true, 'Please add Price'],
    },

    about: {
      type: String,
      max: 300,
    },
    location: {
      type: String,
      required: [true, 'Please Enter you location'],
    },
    contact: {
      type: String,
      required: [true, 'Plase Enter you Contact NO.'],
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      default: new mongoose.Types.ObjectId('62d330992807e471b7032b30'),
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
// Contact
