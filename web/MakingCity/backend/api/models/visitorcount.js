const mongoose = require('mongoose');

const visitorcountSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	count: {type:Number}
});

module.exports = mongoose.model('Visitorcount', visitorcountSchema);
