var mongoose = require('mongoose');  
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");

var UserSchema = new mongoose.Schema({  
  login: String,
  email: String,
  password: String,
  role: String,
  active: Boolean
});

UserSchema.plugin(aggregatePaginate);
module.exports = mongoose.model('User', UserSchema);
