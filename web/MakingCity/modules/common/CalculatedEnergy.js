
export default class CalculatedEnergy {
	constructor() {
		this.energy = {};
	}
	
	
	/*
		timerange = how many days.
		Default is  1 => we focus on this current day starting from midnight (00:00).
					2 => We start from yesterday 00:00 up until now.
	*/
	resetEnergy(timerange) {
		
		const now = moment();
		let start = moment();
		
		if (timerange > 1) {
			const diffe = timerange-1;
			start = moment().subtract(diffe, 'days');//.format('YYYY-MM-DD');
		}
		start.hours(0);
		start.minutes(0);
		start.seconds(0);
		
		// Make sure that Hour is entered into energy object AFTER it is fully done!
		now.minutes(0);
		now.seconds(0);
		
		this.energy = {};
		
		while(now.isAfter(start)) {
			const YYYYMMDDHH = start.format('YYYYMMDDHH');
			const startTimeDate = start.format();//'YYYY-MM-DDTHH:mm:ss');
			this.energy[YYYYMMDDHH] = {};
			this.energy[YYYYMMDDHH]['time'] = new Date(startTimeDate);
			this.energy[YYYYMMDDHH]['sum'] = 0;
			this.energy[YYYYMMDDHH]['count'] = 0;
			this.energy[YYYYMMDDHH]['average'] = 0;
			start.add(1, 'hours');
		};
	}
	/*
		We don't start from midnight (00:00), but select predefined number of hours from this moment.
	*/
	resetEnergyHours(numOfHours) {
		
		const now = moment();
		let start = moment().subtract(numOfHours, 'hours');
		
		//start.hours(0);
		start.minutes(0);
		start.seconds(0);
		
		// Make sure that Hour is entered into energy object AFTER it is fully done!
		now.minutes(0);
		now.seconds(0);
		
		while(now.isAfter(start)) {
			const YYYYMMDDHH = start.format('YYYYMMDDHH');
			const startTimeDate = start.format();//'YYYY-MM-DDTHH:mm:ss');
			this.energy[YYYYMMDDHH] = {};
			this.energy[YYYYMMDDHH]['time'] = new Date(startTimeDate);
			this.energy[YYYYMMDDHH]['sum'] = 0;
			this.energy[YYYYMMDDHH]['count'] = 0;
			this.energy[YYYYMMDDHH]['average'] = 0;
			start.add(1, 'hours');
		};
	}
	
	addEnergy(e) {
		const YYYYMMDDHH = moment(e.created_at).format('YYYYMMDDHH');
		if (this.energy.hasOwnProperty(YYYYMMDDHH)) {
			this.energy[YYYYMMDDHH]['count']++;
			this.energy[YYYYMMDDHH]['sum'] += e.averagePower;
		}
	}
	
	calculateAverage() { 
		Object.keys(this.energy).forEach(key => {
			if (this.energy[key]['count'] > 0) {
				this.energy[key]['average'] = this.energy[key]['sum']/this.energy[key]['count'];
			}
		});
	}
	
	copyTo(v) {
		Object.keys(this.energy).forEach(key => {
			const e = {'time':this.energy[key]['time'],'energy':this.energy[key]['average']};
			v.push(e);
		});
	}
	
	getTotal() {
		let total = 0;
		Object.keys(this.energy).forEach(key => {
			//console.log(['key=',key]);
			total += this.energy[key]['average']/1000;
		});
		return total;
	}
}
