
export default class CalculatedEnergy {
	constructor() {
		this.energy = {};
	}
	
	
	/*
		timerange = how many days.
		Default is 1 => we focus on this current day.
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
		
		// Make sure that Hour is entered into energy object AFTER
		// it is fully done!
		now.minutes(0);
		now.seconds(0);
		
		//let startDD = start.format('DD');
		while(now.isAfter(start)) {
			
			//const HH = start.format('HH');
			const YYYYMMDDHH = start.format('YYYYMMDDHH');
			//console.log(['HH=',HH]);
			console.log(['YYYYMMDDHH=',YYYYMMDDHH]);
			
			const startTimeDate = start.format();//'YYYY-MM-DDTHH:mm:ss');
			//console.log(['startTimeDate=',startTimeDate]); // "2020-02-11T08:00:00+02:00"
			/*
			this.energy[HH] = {};
			this.energy[HH]['time'] = new Date(startTimeDate);
			this.energy[HH]['sum'] = 0;
			this.energy[HH]['count'] = 0;
			this.energy[HH]['average'] = 0;
			*/
			this.energy[YYYYMMDDHH] = {};
			this.energy[YYYYMMDDHH]['time'] = new Date(startTimeDate);
			this.energy[YYYYMMDDHH]['sum'] = 0;
			this.energy[YYYYMMDDHH]['count'] = 0;
			this.energy[YYYYMMDDHH]['average'] = 0;
			
			start.add(1, 'hours');
			//startDD = start.format('DD');
		};
	}
	
	
	resetEnergyHours(numOfHours) {
		
		const now = moment();
		let start = moment().subtract(numOfHours, 'hours');
		
		start.minutes(0);
		start.seconds(0);
		
		// Make sure that Hour is entered into energy object AFTER
		// it is fully done!
		now.minutes(0);
		now.seconds(0);
		
		//let startDD = start.format('DD');
		while(now.isAfter(start)) {
			
			//const HH = start.format('HH');
			const YYYYMMDDHH = start.format('YYYYMMDDHH');
			//console.log(['HH=',HH]);
			console.log(['YYYYMMDDHH=',YYYYMMDDHH]);
			
			const startTimeDate = start.format();//'YYYY-MM-DDTHH:mm:ss');
			//console.log(['startTimeDate=',startTimeDate]); // "2020-02-11T08:00:00+02:00"
			/*
			this.energy[HH] = {};
			this.energy[HH]['time'] = new Date(startTimeDate);
			this.energy[HH]['sum'] = 0;
			this.energy[HH]['count'] = 0;
			this.energy[HH]['average'] = 0;
			*/
			this.energy[YYYYMMDDHH] = {};
			this.energy[YYYYMMDDHH]['time'] = new Date(startTimeDate);
			this.energy[YYYYMMDDHH]['sum'] = 0;
			this.energy[YYYYMMDDHH]['count'] = 0;
			this.energy[YYYYMMDDHH]['average'] = 0;
			
			start.add(1, 'hours');
			//startDD = start.format('DD');
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
}
