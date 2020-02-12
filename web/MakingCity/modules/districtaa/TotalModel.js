import Model from '../common/Model.js';
/*

https://makingcity.vtt.fi/data/arina/iss/feeds.json?meterId=114&limit=1000&start=2020-02-10&end=2020-02-10


[{"created_at":"2020-02-10T00:01:06","meterId":114,"averagePower":28.8,"totalEnergy":451145,"energyDiff":0.6},
{"created_at":"2020-02-10T00:02:18","meterId":114,"averagePower":35,"totalEnergy":451145.7,"energyDiff":0.7},
{"created_at":"2020-02-10T00:03:34","meterId":114,"averagePower":28.421,"totalEnergy":451146.3,"energyDiff":0.6},

...

{"created_at":"2020-02-10T14:02:00","meterId":114,"averagePower":83.836,"totalEnergy":451889.4,"energyDiff":1.7},
{"created_at":"2020-02-10T14:03:19","meterId":114,"averagePower":82.025,"totalEnergy":451891.2,"energyDiff":1.8},
{"created_at":"2020-02-10T14:04:33","meterId":114,"averagePower":48.649,"totalEnergy":451892.2,"energyDiff":1},
{"created_at":"2020-02-10T14:05:51","meterId":114,"averagePower":50.769,"totalEnergy":451893.3,"energyDiff":1.1}
]
*/
export class Total {
	constructor(obj) {
		this.time = new Date(obj.created_at); // "2020-02-10T00:01:06"
		this.meterId = obj.meterId; // Number
		this.averagePower = obj.averagePower; // Float
		this.totalEnergy = obj.totalEnergy; // Float
		this.energyDiff = obj.energyDiff; // Float
	}
}

export class CalculatedEnergy {
	constructor() {
		this.energy = {};
	}
	
	resetEnergy() {
		const now = moment();
		
		//const nowDD = now.format('DD');
		//console.log(['nowDD=',nowDD]); //now.format()]);
		let start = moment();
		start.hours(0);
		start.minutes(0);
		start.seconds(0);
		
		// Make sure that Hour is entered into energy object AFTER
		// it is fully done!
		now.minutes(0);
		now.seconds(0);
		
		//let startDD = start.format('DD');
		while(now.isAfter(start)) {
			
			const HH = start.format('HH');
			console.log(['HH=',HH]);
			
			const startTimeDate = start.format();//'YYYY-MM-DDTHH:mm:ss');
			console.log(['startTimeDate=',startTimeDate]); // "2020-02-11T08:00:00+02:00"
			this.energy[HH] = {};
			this.energy[HH]['time'] = new Date(startTimeDate);
			this.energy[HH]['sum'] = 0;
			this.energy[HH]['count'] = 0;
			this.energy[HH]['average'] = 0;
			start.add(1, 'hours');
			//startDD = start.format('DD');
		};
	}
	
	addEnergy(e) {
		const HH = moment(e.created_at).format('HH');
		if (this.energy.hasOwnProperty(HH)) {
			//console.log(['addEnergy HH=',HH]);
			this.energy[HH]['count']++;
			this.energy[HH]['sum'] += e.averagePower;
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


export default class TotalModel extends Model {
	constructor() {
		super();
		this.values = [];
		this.energyValues = [];
	}
	
	removeDuplicates(json) {
		// Check if there are timestamp duplicates?
		const test = {};
		const newJson = [];
		json.forEach(item => { 
			const datetime = item.created_at;
			if (test.hasOwnProperty(datetime)) {
				console.log('DUPLICATE!!!!!!');
			} else {
				test[datetime] = item;
				newJson.push(item);
			}
		});
		return newJson;
	}
	
	fetch() {
		const self = this;
		if (this.fetching) {
			console.log('TOTAL FETCHING ALREADY IN PROCESS!');
			return;
		}
		
		const debug_time_start = moment().valueOf();
		
		let status = 500; // error: 500
		this.errorMessage = '';
		this.fetching = true;
		
		const today = moment().format('YYYY-MM-DD');
		console.log(['today=',today]);
		
		// in 24 hours there is 24 x 60 minutes = 1440
		this.src = 'data/arina/iss/feeds.json?meterId=114&limit=1440'; //&start=2020-02-10&end=2020-02-10
		// append start and end date
		const url = this.backend + '/' + this.src + '&start='+today+'&end='+today;
		
		console.log (['fetch url=',url]);
		fetch(url)
			.then(function(response) {
				status = response.status;
				return response.json();
			})
			.then(function(myJson) {
				self.values = []; // Start with fresh empty data.
				self.energyValues = [];
				
				console.log(['Total myJson=',myJson]);
				const newson = self.removeDuplicates(myJson);
				
				let myce = new CalculatedEnergy();
				myce.resetEnergy();
				//console.log(['myce.energy=',myce.energy]);
				$.each(newson, function(i,v){
					if (v.averagePower > 0) {
						// set cumulative energy for each hour.
						myce.addEnergy(v);
						const p = new Total(v);
						self.values.push(p);
					}
				});
				//console.log(['HUU myce.energy=',myce.energy]);
				myce.calculateAverage(); 
				myce.copyTo(self.energyValues);
				
				console.log(['BEFORE SORT self.energyValues=',self.energyValues]);
				// Then sort array based according to time, oldest entry first.
				self.energyValues.sort(function(a,b){
					var bb = moment(b.time);
					var aa = moment(a.time);
					return aa - bb;
				});
				
				console.log(['AFTER SORT self.energyValues=',self.energyValues]);
				console.log(['self.values=',self.values]);
				
				const debug_time_elapse = moment().valueOf()-debug_time_start;
				console.log(['TotalModel fetch debug_time_elapse=',debug_time_elapse]);
				
				self.fetching = false;
				self.ready = true;
				self.notifyAll({model:'TotalModel',method:'fetched',status:status,message:'OK'});
			})
			.catch(error => {
				self.fetching = false;
				self.ready = true;
				self.errorMessage = error;
				self.notifyAll({model:'TotalModel', method:'fetched', status:status, message:error});
			});
	}
}
