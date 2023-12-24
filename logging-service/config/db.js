const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://tammy:pass1234@cluster0.cd9uv7i.mongodb.net/gdrive_lite?retryWrites=true&w=majority').catch(error => console.log(error));

const Logs = mongoose.model('logs', new mongoose.Schema({time: Date, service: String, message: String}));

module.exports = Logs;