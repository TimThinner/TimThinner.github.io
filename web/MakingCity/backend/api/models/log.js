const mongoose = require('mongoose');
/*
	eventType:
		- 'Login'
		- 'Logout'
	userId can be undefined, if user is not logged in.
*/
const logSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
	eventType: { type:String },
	created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', logSchema);
