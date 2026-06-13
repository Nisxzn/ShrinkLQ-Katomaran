const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: true
  },
  visitedAt: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String
  },
  browser: {
    type: String,
    enum: ['Chrome', 'Firefox', 'Edge', 'Safari', 'Other']
  },
  device: {
    type: String,
    enum: ['Desktop', 'Mobile', 'Tablet', 'Other']
  }
});

module.exports = mongoose.model('Visit', visitSchema);
