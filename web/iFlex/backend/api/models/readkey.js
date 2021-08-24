const mongoose = require('mongoose');

const readkeySchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	startdate: { type:Date, default: Date.now },
	enddate:   { type:Date, default: Date.now }
});

module.exports = mongoose.model('Readkey', readkeySchema);
