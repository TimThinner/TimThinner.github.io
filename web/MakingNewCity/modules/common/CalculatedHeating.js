
export default class CalculatedHeating {
	
	
	constructor() {
		this.heating = {};
	}
	
	/*
		We don't start from midnight (00:00), but select predefined number of hours from this moment.
		We have temperature and humidity for every minute => we convert that to hourly averages.
		
		How to use:
		
		mych.resetHours(this.timerange*24);
		$.each(newson, function(i,v){
			mych.addMeasurement(v); // set cumulative energy for each hour.
		});
		mych.calculateAverage();
		mych.copyTo(self.values);
		
		
	*/
	resetHours(numOfHours) {
		const now = moment();
		let start = moment().subtract(numOfHours, 'hours');
		
		//start.hours(0);
		start.minutes(0);
		start.seconds(0);
		
		// Make sure that Hour is entered into heating object AFTER it is fully done!
		now.minutes(0);
		now.seconds(0);
		
		this.heating = {};
		
		while(now.isAfter(start)) {
			const YYYYMMDDHH = start.format('YYYYMMDDHH');
			const startTimeDate = start.format();//'YYYY-MM-DDTHH:mm:ss');
			this.heating[YYYYMMDDHH] = {};
			this.heating[YYYYMMDDHH]['time'] = new Date(startTimeDate);
			this.heating[YYYYMMDDHH]['count'] = 0;
			this.heating[YYYYMMDDHH]['temperature_sum'] = 0;
			this.heating[YYYYMMDDHH]['humidity_sum'] = 0;
			this.heating[YYYYMMDDHH]['temperature_average'] = 0;
			this.heating[YYYYMMDDHH]['humidity_average'] = 0;
			start.add(1, 'hours');
		};
	}
	
	addMeasurement(e) {
		const YYYYMMDDHH = moment(e.created_at).format('YYYYMMDDHH');
		if (this.heating.hasOwnProperty(YYYYMMDDHH)) {
			this.heating[YYYYMMDDHH]['count']++;
			this.heating[YYYYMMDDHH]['temperature_sum'] += e.temperature;
			this.heating[YYYYMMDDHH]['humidity_sum'] += e.humidity;
		}
	}
	
	calculateAverage() { 
		Object.keys(this.heating).forEach(key => {
			if (this.heating[key]['count'] > 0) {
				this.heating[key]['temperature_average'] = this.heating[key]['temperature_sum']/this.heating[key]['count'];
				this.heating[key]['humidity_average'] = this.heating[key]['humidity_sum']/this.heating[key]['count'];
			}
		});
	}
	
	copyTo(v) {
		Object.keys(this.heating).forEach(key => {
			const e = {
				'time':this.heating[key]['time'],
				'temperature':this.heating[key]['temperature_average'],
				'humidity':this.heating[key]['humidity_average']
			};
			v.push(e);
		});
	}
}
