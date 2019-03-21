const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// Schema Setup
const userSchema = new mongoose.Schema({
  text: String,
  author: String,
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', userSchema);
