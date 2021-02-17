
export default class CalculatedAlarms {
	constructor() {
		this.alarms = {};
	}
	
	
	/*
		resetAlarms(timerange) function
		The timescale always starts from midnight (00:00 hours) and ends at previous FULL hour.
		
		timerange = how many days.
		Default is  1 => we focus on this current day starting from midnight (00:00).
					2 => We start from yesterday 00:00 up until now.
	*/
	resetAlarms(timerange) {
		
		const now = moment();
		let start = moment();
		
		if (timerange > 1) {
			const diffe = timerange-1;
			start = moment().subtract(diffe, 'days');
		}
		start.hours(0);
		start.minutes(0);
		start.seconds(0);
		
		// Make sure that Hour is entered into energy object AFTER it is fully done!
		//now.minutes(0);
		//now.seconds(0);
		
		this.alarms = {};
		
		while(now.isAfter(start)) {
			const YYYYMMDD = start.format('YYYYMMDD');
			const startTimeDate = start.format();
			this.alarms[YYYYMMDD] = {};
			this.alarms[YYYYMMDD]['time'] = new Date(startTimeDate);
			this.alarms[YYYYMMDD]['count'] = 0;
			
			//console.log(['Created alarms entry for: ',YYYYMMDD]);
			
			start.add(1, 'days');
		};
	}
	
	addAlarm(a) {
		const YYYYMMDD = moment(a.alarmTimestamp).format('YYYYMMDD');
		if (this.alarms.hasOwnProperty(YYYYMMDD)) {
			this.alarms[YYYYMMDD]['count']++;
		}
	}
	
	copyTo(v) {
		Object.keys(this.alarms).forEach(key => {
			const e = {'time':this.alarms[key]['time'],'count':this.alarms[key]['count']};
			v.push(e);
		});
	}
}
