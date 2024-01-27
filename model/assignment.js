let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let AssignmentSchema = Schema({
    dateDeRendu: Date,
    nom: String,
    rendu: Boolean,
    studentId: { type: Schema.Types.ObjectId, ref: 'Student' },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' },
    
});

AssignmentSchema.plugin(aggregatePaginate);
// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('assignments', AssignmentSchema);
