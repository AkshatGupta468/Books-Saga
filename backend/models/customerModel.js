const mongoose = require('mongoose');
const MessageSchema = require('./messageModel');
exports.customerSchema = mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.Id,
      require: [true, 'customer Id is required'],
    },
    messages: {
      type: [MessageSchema],
    },
  },
  { timestamp: true }
);
