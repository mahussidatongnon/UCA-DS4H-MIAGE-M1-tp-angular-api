var mongoose = require('mongoose');
var ProfessorSchema = new mongoose.Schema({
  lastName: String,
  firstName: String,
  pictureUrl: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
module.exports = mongoose.model('Professor', ProfessorSchema);