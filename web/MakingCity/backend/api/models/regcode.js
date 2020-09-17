const mongoose = require('mongoose');

const regcodeSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	email: {
		type:String,
		required:true,
		unique:true,
		// => DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
		match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
	},
	apartmentId: { type:String, required:true },
	code:        { type:String, required:true },
	startdate:   { type:Date, default: Date.now },
	enddate:     { type:Date, default: Date.now }
});

module.exports = mongoose.model('Regcode', regcodeSchema);
