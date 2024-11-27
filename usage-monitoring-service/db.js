const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/gdrive_lite', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a mongoose model for your image
const BandwidthUsage = mongoose.model('bandwidth_usage', { userId: String, requestSize: Number, date: Date });

module.exports = { BandwidthUsage };