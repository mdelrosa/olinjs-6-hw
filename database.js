// database.js

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/test');

// set Schema
Schema = mongoose.Schema;

//  schema for user with name and list of tweets
var UserSchema = new Schema({
  id: String,
  name: String,
  picture: String,
  prof_color: String,
  prof_font: String
});

// pack schema as model
var User = mongoose.model('User', UserSchema)

// exports
exports.user = User;
