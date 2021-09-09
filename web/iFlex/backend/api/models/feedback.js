const mongoose = require('mongoose');
/*
	
*/
const feedbackSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
	feedbackType: { type:String },
	created: { type: Date, default: Date.now },
	feedback: { type:Number },
	feedbackText: { type:String }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
