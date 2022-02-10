const mongoose = require('mongoose');
/*
	Each stored Alarm can be identified with (userId,alarmType,alarmTimestamp) -triplet.
	If it already exist => No need to create identical twin.
	
	Possible values for alarmType are:
		
		"Heating Temperature Upper Limit"
		"Heating Temperature Lower Limit"
		"Heating Humidity Upper Limit"
		"Heating Humidity Lower Limit"
		
		"Energy Upper Limit"
		"Energy Lower Limit"
		
		"Water Hot Upper Limit"
		"Water Hot Lower Limit"
		"Water Cold Upper Limit"
		"Water Cold Lower Limit"
		
		
	Severity (0=least severe,1,2=most severe) is calculated using simple percentage values:
		if limit exceeds 0 to 5%? it is considered as 0 (green alarm)
		if limit exceeds 5% to 10% it is considered as 1 (yellow alarm) 
		if limit exceeds more than 10% it is considered as 2 (red alarm)
	
	Percentages should be adjustable from the user profile page.
	
*/
const alarmSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
	alarmType: { type:String },
	alarmTimestamp: { type: Date },
	created: { type: Date, default: Date.now },
	severity: { type:Number },
	acknowledged: { type: Boolean, default: false }
});

module.exports = mongoose.model('Alarm', alarmSchema);
