const { default: mongoose } = require('mongoose');

exports.MessageSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Message cannot be empty'],
    },
  },
  {
    timestamp: true,
  }
);
