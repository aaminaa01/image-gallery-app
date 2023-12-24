const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/UasageMonitoringDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a mongoose model for your image
const BandwidthUsage = mongoose.model('BandwidthUsage', { userId: String, requestSize: Number, date: Date });

module.exports = { BandwidthUsage };