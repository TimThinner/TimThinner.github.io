import Model from '../common/Model.js';
/*
	https://makingcity.vtt.fi/data/arina/iss/feeds.json?meterId=116&limit=1440&start=2020-02-12&end=2020-02-12
	
	{"created_at":"2020-02-12T00:24:02","meterId":116,"averagePower":0,"totalEnergy":342.45,"energyDiff":0},
	{"created_at":"2020-02-12T00:25:18","meterId":116,"averagePower":0,"totalEnergy":342.45,"energyDiff":0},
	{"created_at":"2020-02-12T00:26:31","meterId":116,"averagePower":0,"totalEnergy":342.45,"energyDiff":0},
	{"created_at":"2020-02-12T00:27:45","meterId":116,"averagePower":0.486,"totalEnergy":342.46,"energyDiff":0.01}, ...
*/
export class Solar {
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
			//console.log(['HH=',HH]);
			
			const startTimeDate = start.format();//'YYYY-MM-DDTHH:mm:ss');
			//console.log(['startTimeDate=',startTimeDate]); // "2020-02-11T08:00:00+02:00"
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

export default class SolarModel extends Model {
	
	constructor() {
		super();
		this.values = [];
		this.energyValues = [];
	}
	
	removeDuplicates(json) {
		// Check if there are timestamp duplicates?
		// And remove those with averagePower=0 at the same time.
		const test = {};
		const newJson = [];
		json.forEach(item => { 
			const datetime = item.created_at;
			if (test.hasOwnProperty(datetime)) {
				console.log(['DUPLICATE!!!!!! averagePower=',item.averagePower]);
				if (item.averagePower > test[datetime].averagePower) {
					console.log('This has MORE averagePower so probably this is the correct one?');
					
					const huh = newJson.pop();
					if (huh.created_at === datetime) {
						console.log('YES, Replacing THE CORRECT ONE!');
						
						// Just re-assign item 
						test[datetime] = item;
						newJson.push(item);
						
					} else {
						console.log('SOMETHING IS FISHY HERE!!!????!!!!');
						newJson.push(huh);
					}
				}
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
			console.log('SOLAR FETCHING ALREADY IN PROCESS!');
			return;
		}
		
		const debug_time_start = moment().valueOf();
		
		let status = 500; // error: 500
		this.errorMessage = '';
		this.fetching = true;
		
		const today = moment().format('YYYY-MM-DD');
		console.log(['today=',today]);
		
		// in 24 hours there is 24 x 60 minutes = 1440
		this.src = 'data/arina/iss/feeds.json?meterId=116&limit=1440'; //&start=2020-02-10&end=2020-02-10
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
				
				console.log(['Solar myJson=',myJson]);
				const newson = self.removeDuplicates(myJson);
				
				let myce = new CalculatedEnergy();
				myce.resetEnergy();
				
				$.each(newson, function(i,v){
					
					// set cumulative energy for each hour.
					myce.addEnergy(v);
					const p = new Solar(v);
					self.values.push(p);
					
				});
				
				myce.calculateAverage(); 
				myce.copyTo(self.energyValues);
				
				// Then sort array based according to time, oldest entry first.
				self.energyValues.sort(function(a,b){
					var bb = moment(b.time);
					var aa = moment(a.time);
					return aa - bb;
				});
				
				const debug_time_elapse = moment().valueOf()-debug_time_start;
				console.log(['SolarModel fetch debug_time_elapse=',debug_time_elapse]);
				
				self.fetching = false;
				self.ready = true;
				self.notifyAll({model:'SolarlModel',method:'fetched',status:status,message:'OK'});
			})
			.catch(error => {
				self.fetching = false;
				self.ready = true;
				self.errorMessage = error;
				self.notifyAll({model:'SolarModel', method:'fetched', status:status, message:error});
			});
	}
	
}
