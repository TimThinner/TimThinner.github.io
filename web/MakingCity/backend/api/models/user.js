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
	/*address_street: {type:String},
	address_postal_code: {type:String},
	address_city: {type:String},*/
	//regcode:  { type: mongoose.Schema.Types.ObjectId, ref:'Regcode', required:true},
	//readkey:  { type: mongoose.Schema.Types.ObjectId, ref:'Readkey', required:true},
	is_superuser: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);
