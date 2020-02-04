import Model from '../common/Model.js';

/*
Once in every minute of this current day, give values for power (kW) and energy (kWh)
*/

export class SolarPowerModel {
	constructor(obj) {
		this.time = new Date(obj.time); // "2019-10-25T11:13:39.833Z"
		this.power = obj.power;   // float
	}
}

export class SolarEnergyModel {
	constructor(obj) {
		this.time = new Date(obj.time); // "2019-10-25T11:13:39.833Z"
		this.energy = obj.energy;    // float
	}
}

export default class SolarModel extends Model {
	
	constructor() {
		super();
		this.powerValues = [];
		this.energyValues = [];
	}
	
	simulate() {
		const now = moment();
		let start = moment();
		start.hours(0);
		start.minutes(0);
		start.seconds(0);
		// Solar power 	 0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23
		const coeff = [  0, 0, 0, 0, 0, 0, 1, 3, 5, 8,10,14,20,20,20,15,12, 8, 7, 6, 4, 2, 0, 0];
		const myJson = [];
		
		while(now.isAfter(start)) {
			start.add(10, 'minutes');
			const h = start.hours(); // Number 0 to 23
			const p = coeff[h] * (Math.round(Math.random()*50) + 100); // W!
			myJson.push({time:start.format(),power:p});
		}
		return myJson;
	}
	
	fetch() {
		//const self = this;
		if (this.fetching) {
			console.log('FETCHING ALREADY IN PROCESS!');
			return;
		}
		
		const debug_time_start = moment().valueOf();
		this.fetching = true;
		this.src = 'solar-model';
		const url = this.backend + '/' + this.src;
		console.log (['fetch url=',url]);
		
		// Fetch happens at time t, we generate random data for every minute starting from t-2h and ending to t.
		// Number of seconds in one hour is 60 x 60 = 3600 
		// so there is 360 10 second intervals in one hour.
		
		// power is more or less random value between 100-1100 (W) for example.
		// energy will cumulate so that if values are in 1 minute interval e = e + p/60, for example.
		
		const myJson = this.simulate();
		setTimeout(() => {
			this.powerValues = [];
			this.energyValues = [];
			
			myJson.forEach(item => {
				
				const p = new SolarPowerModel(item);
				this.powerValues.push(p);
				
				const e = new SolarEnergyModel({time:item.time,energy:item.power/6000});
				this.energyValues.push(e);
			});
			
			const debug_time_elapse = moment().valueOf()-debug_time_start;
			console.log(['SOLAR debug_time_elapse=',debug_time_elapse]);
			
			this.fetching = false;
			this.ready = true;
			this.notifyAll({model:'SolarModel',method:'fetched',status:200,message:'OK'});
		}, 300);
	}
}
