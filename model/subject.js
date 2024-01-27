var mongoose = require('mongoose');

var SubjectSchema = new mongoose.Schema({
    name: String,
    imageUrl: String,
    professorIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Professor' }]
});
module.exports = mongoose.model('Subject', SubjectSchema);