const mongoose = require('mongoose');

const visitorcountSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Visitorcount', visitorcountSchema);
