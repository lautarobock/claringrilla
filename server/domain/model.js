var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var util = require('../../client/js/util/util.js');


exports.User = mongoose.model("User",new Schema({
    google_id: String,
    name: String,
    email: String,
    creationDate: Date,
    lastLoginDate: Date,
    isAdmin: Boolean
}));

exports.Grill = mongoose.model("Grill", new Schema({
	_id: String,
	matrix: [String],
	definitions: [String],
	syllables: [String],
	phraseCol1: Number,
	phraseCol2: Number,
	phrase: String,
	author: String
}));

exports.Word = mongoose.model("Word", new Schema({
	_id: Number,
	text: String,
	frecuency: Number
}));