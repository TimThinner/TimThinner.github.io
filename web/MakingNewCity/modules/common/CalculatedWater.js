
// Number.MAX_SAFE_INTEGER);
//                  9007199254740991


export default class CalculatedWater {
	
	
	constructor() {
		this.MAX_WATER_TOTAL = 999999999999;
		this.water = {};
		this.minmax = {
			hotmin: this.MAX_WATER_TOTAL,
			hotmax: 0,
			coldmin: this.MAX_WATER_TOTAL,
			coldmax: 0
		};
	}
	
	resetMinMax() {
		this.minmax.hotmin = this.MAX_WATER_TOTAL;
		this.minmax.hotmax = 0;
		this.minmax.coldmin = this.MAX_WATER_TOTAL;
		this.minmax.coldmax = 0;
	}
	/*
		We don't start from midnight (00:00), but select predefined number of hours from this moment.
		We have coldTotal and hotTotal for every minute. Find out the hourly min and max values to find 
		hourly consumed water.
		Also store min and max from the whole data set.
	*/
	resetWaterHours(numOfHours) {
		const now = moment();
		let start = moment().subtract(numOfHours, 'hours');
		
		//start.hours(0);
		start.minutes(0);
		start.seconds(0);
		
		// Make sure that Hour is entered into water object AFTER it is fully done!
		now.minutes(0);
		now.seconds(0);
		
		this.water = {};
		this.resetMinMax();
		
		while(now.isAfter(start)) {
			const YYYYMMDDHH = start.format('YYYYMMDDHH');
			const startTimeDate = start.format();//'YYYY-MM-DDTHH:mm:ss');
			this.water[YYYYMMDDHH] = {};
			this.water[YYYYMMDDHH]['time'] = new Date(startTimeDate);
			this.water[YYYYMMDDHH]['hot_min'] = this.MAX_WATER_TOTAL;
			this.water[YYYYMMDDHH]['hot_max'] = 0;
			this.water[YYYYMMDDHH]['cold_min'] = this.MAX_WATER_TOTAL;
			this.water[YYYYMMDDHH]['cold_max'] = 0;
			start.add(1, 'hours');
		};
	}
	
	addWater(e) {
		const YYYYMMDDHH = moment(e.created_at).format('YYYYMMDDHH');
		if (this.water.hasOwnProperty(YYYYMMDDHH)) {
			
			const hot_min = this.water[YYYYMMDDHH]['hot_min'];
			const hot_max = this.water[YYYYMMDDHH]['hot_max'];
			const cold_min = this.water[YYYYMMDDHH]['cold_min'];
			const cold_max = this.water[YYYYMMDDHH]['cold_max'];
			
			if (e.hotTotal < hot_min) {
				this.water[YYYYMMDDHH]['hot_min'] = e.hotTotal;
			}
			if (e.hotTotal > hot_max) {
				this.water[YYYYMMDDHH]['hot_max'] = e.hotTotal;
			}
			
			if (e.coldTotal < cold_min) {
				this.water[YYYYMMDDHH]['cold_min'] = e.coldTotal;
			}
			if (e.coldTotal > cold_max) {
				this.water[YYYYMMDDHH]['cold_max'] = e.coldTotal;
			}
			
			// Set also the whole selection minimum and maximum.
			if (e.hotTotal < this.minmax.hotmin) {
				this.minmax.hotmin = e.hotTotal;
			}
			if (e.hotTotal > this.minmax.hotmax) {
				this.minmax.hotmax = e.hotTotal;
			}
			if (e.coldTotal < this.minmax.coldmin) {
				this.minmax.coldmin = e.coldTotal;
			}
			if (e.coldTotal > this.minmax.coldmax) {
				this.minmax.coldmax = e.coldTotal;
			}
		}
	}
	
	printWater() {
		Object.keys(this.water).forEach(key => {
			const time = this.water[key]['time'];
			const hot_max = this.water[key]['hot_max']
			const hot_min = this.water[key]['hot_min'];
			const cold_min = this.water[key]['cold_min'];
			const cold_max = this.water[key]['cold_max'];
			console.log(['key=',key,' time=',time,' Hot min=',hot_min,' Hot max=',hot_max,' Cold min=',cold_min,' Cold max=',cold_max]);
		});
	}
	
	copyTo(v) {
		Object.keys(this.water).forEach(key => {
			const hot = this.water[key]['hot_max'] - this.water[key]['hot_min'];
			const cold = this.water[key]['cold_max'] - this.water[key]['cold_min'];
			const e = {'time':this.water[key]['time'],'hot':hot,'cold':cold};
			v.push(e);
		});
	}
}
