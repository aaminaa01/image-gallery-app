// db.js
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a mongoose model for your image
const Image = mongoose.model('Image', { data: Buffer, userId: String, size: Number });

module.exports = { Image };