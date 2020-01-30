import EventObserver from '../common/EventObserver.js';

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

export default class SolarModel extends EventObserver {
	
	constructor() {
		super();
		this.src = undefined;
		this.ready = false;
		this.errorMessage = '';
		this.fetching = false;
		
		this.powerValues = [];
		this.energyValues = [];
	}
	
	simulate() {
		const self = this;
		const now = moment();
		//let start = moment().subtract(24,'hours');
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
		
		this.powerValues = [];
		this.energyValues = [];
		
		$.each(myJson, function(i,v){
			const p = new SolarPowerModel(v);
			self.powerValues.push(p);
			
			const e = new SolarEnergyModel( {time:v.time,energy:v.power/6000} );
			self.energyValues.push(e);
		});
	}
	
	fetch() {
		//const self = this;
		if (this.fetching) {
			console.log('FETCHING ALREADY IN PROCESS!');
			return;
		}
		
		this.src = 'solar-model';
		const url = this.backend + '/' + this.src;
		console.log (['fetch url=',url]);
		
		// Fetch happens at time t, we generate random data for every minute starting from t-2h and ending to t.
		// Number of seconds in one hour is 60 x 60 = 3600 
		// so there is 360 10 second intervals in one hour.
		
		// power is more or less random value between 100-1100 (W) for example.
		// energy will cumulate so that if values are in 1 minute interval e = e + p/60, for example.
		
		this.simulate();
		
		
		/*
		const now = moment();
		let start = moment().subtract(24,'hours');
		const myJson = [];
		//let k = Math.round(now.seconds()/10) + now.minutes()*6;
		//let k = now.seconds() + now.minutes()*6;
		
		let e = 42000000.00; // kWh
		
		//const coeff = Math.PI/180;
		while(now.isAfter(start)) {
			start.add(1, 'minutes');
			//const p = 100+Math.sin(k*coeff)*100;
			//e = 100+Math.cos(k*coeff)*100;
			const p = 100 + Math.round(Math.random()*1000); // W!
			e += (p/1000)/60; // kWh!
			myJson.push({time:start.format(),power:p,energy:e});
			//if (k < 360) {
			//	k++;
			//} else {
			//	k=0;
			//}
		}
		this.values = []; // Start with fresh array.
		$.each(myJson, function(i,v){
			const p = new SolarPowerModel(v);
			self.values.push(p);
		});
		*/
		
		
		setTimeout(() => {
			this.fetching = false;
			this.ready = true;
			this.notifyAll({model:'SolarModel',method:'fetched',status:200,message:'OK'});
		}, 200);
	}
}
