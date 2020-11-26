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
	regcode: { type: mongoose.Schema.Types.ObjectId, ref:'Regcode'},
	readkey: { type: mongoose.Schema.Types.ObjectId, ref:'Readkey'},
	price_energy_monthly: {type:Number, default:10},
	price_energy_basic: {type:Number, default:4.5},
	price_energy_transfer: {type:Number, default:4.5},
	heating_temperature_upper: {type:Number, default:24.0},
	heating_target_temperature: {type:Number, default:22.0},
	heating_temperature_lower: {type:Number, default:20.0},
	heating_humidity_upper: {type:Number, default:45.0},
	heating_target_humidity: {type:Number, default:40.0},
	heating_humidity_lower: {type:Number, default:35.0},
	is_superuser: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);
