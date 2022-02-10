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
	price_energy_monthly: {type:Number},
	price_energy_basic: {type:Number},
	price_energy_transfer: {type:Number},
	
	// 3 new properties (point_id_x):
	point_id_a: {type:String, default:''},
	point_id_b: {type:String, default:''},
	point_id_c: {type:String, default:''},
	
	heating_temperature_upper: {type:Number},
	heating_target_temperature: {type:Number},
	heating_temperature_lower: {type:Number},
	heating_humidity_upper: {type:Number},
	heating_target_humidity: {type:Number},
	heating_humidity_lower: {type:Number},
	water_hot_upper: {type:Number},
	water_hot_target: {type:Number},
	water_hot_lower: {type:Number},
	water_cold_upper: {type:Number},
	water_cold_target: {type:Number},
	water_cold_lower: {type:Number},
	energy_upper: {type:Number},
	energy_target: {type:Number},
	energy_lower: {type:Number},
	is_superuser: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);
