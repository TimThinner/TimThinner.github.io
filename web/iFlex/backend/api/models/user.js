const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	email: {
		type:String,
		required:true,
		unique:true,
		// => DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
		match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
	},
	password: {type:String, required:true},
	//isVerified: {type:Boolean, default:false},
	created: { type: Date, default: Date.now },
	regcode: { type: mongoose.Schema.Types.ObjectId, ref:'Regcode'},
	readkey: { type: mongoose.Schema.Types.ObjectId, ref:'Readkey'},
	obix_code: { type:String, default:'' },
	request_for_sensors: { type: Boolean, default: false },
	consent_a: { type: Boolean, default: false },
	consent_b: { type: Boolean, default: false },
	is_superuser: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);
