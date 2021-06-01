const mongoose = require('mongoose');
const proxSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	url: String,
	response: String,
	expiration: Number, // expiration time in seconds
	updated: Date
});

module.exports = mongoose.model('Prox', proxSchema);
