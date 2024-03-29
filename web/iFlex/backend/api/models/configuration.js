const mongoose = require('mongoose');
/*
	Store app configuration data here.
*/
const configurationSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	signup: { type: Boolean, default: false },
	show_fetching_info: { type: Boolean, default: false },
	number_of_residents: { type: Number },
	version: { type: String }
});

module.exports = mongoose.model('Configuration', configurationSchema);
