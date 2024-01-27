var mongoose = require('mongoose');
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");

var StudentSchema = new mongoose.Schema({
    lastName: String,
    firstName: String,
    pictureUrl: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

StudentSchema.plugin(aggregatePaginate);
module.exports = mongoose.model('Student', StudentSchema);