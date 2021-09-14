const mongoose = require('mongoose');
const proxeSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	hash: String,
	url: String,
	response: String,
	expiration: Number, // expiration time in seconds
	updated: Date
});

module.exports = mongoose.model('Proxe', proxeSchema);
