import Model from './Model.js';
import CalculatedEnergy from './CalculatedEnergy.js';
/*

https://makingcity.vtt.fi/data/arina/iss/feeds.json?meterId=114&start=2020-02-12&end=2020-02-12


[{"created_at":"2020-02-10T00:01:06","meterId":114,"averagePower":28.8,"totalEnergy":451145,"energyDiff":0.6},
{"created_at":"2020-02-10T00:02:18","meterId":114,"averagePower":35,"totalEnergy":451145.7,"energyDiff":0.7},
{"created_at":"2020-02-10T00:03:34","meterId":114,"averagePower":28.421,"totalEnergy":451146.3,"energyDiff":0.6},

...

{"created_at":"2020-02-10T14:02:00","meterId":114,"averagePower":83.836,"totalEnergy":451889.4,"energyDiff":1.7},
{"created_at":"2020-02-10T14:03:19","meterId":114,"averagePower":82.025,"totalEnergy":451891.2,"energyDiff":1.8},
{"created_at":"2020-02-10T14:04:33","meterId":114,"averagePower":48.649,"totalEnergy":451892.2,"energyDiff":1},
{"created_at":"2020-02-10T14:05:51","meterId":114,"averagePower":50.769,"totalEnergy":451893.3,"energyDiff":1.1}
]


NOTE: When Authentcation is added to the system, the auth backend returns:
		
		return res.status(401).json({
			message: 'Auth failed'
		});
		
This status code and errorMessage must be caught and wired to forceLogout() action.
		
		// Force LOGOUT if Auth failed!
		if (options.status === 401) {
			setTimeout(() => {
				this.controller.forceLogout();
			}, 1000);
		}
*/
export class Feed {
	constructor(obj) {
		this.time = new Date(obj.created_at); // "2020-02-10T00:01:06"
		this.meterId = obj.meterId; // Number
		this.averagePower = obj.averagePower; // Float
		this.totalEnergy = obj.totalEnergy; // Float
		this.energyDiff = obj.energyDiff; // Float
	}
}

export default class FeedModel extends Model {
	constructor(options) {
		super(options);
		// By default FeedModel shows data from today.
		//this.start = moment().format('YYYY-MM-DD');
		//this.end = moment().format('YYYY-MM-DD');
		this.timerange = 1;
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
				//console.log(['DUPLICATE!!!!!! averagePower=',item.averagePower]);
				if (test[datetime].averagePower === 0 && item.averagePower > 0) {
					// Replacing duplicate ONLY if old value was zero and new value is NOT zero!
					console.log('REPLACE DUPLICATE (OLD WAS ZERO VALUE)!!!');
					test[datetime] = item;
				}
				/*
				if (item.averagePower > test[datetime].averagePower) {
					//console.log('This has MORE averagePower so probably this is the correct one?');
					const huh = newJson.pop();
					if (huh.created_at === datetime) {
						//console.log('YES, Replacing THE CORRECT ONE!');
						// Just re-assign item 
						test[datetime] = item;
						newJson.push(item);
					} else {
						console.log('SOMETHING IS FISHY HERE!!!????!!!!');
						newJson.push(huh);
					}
				}
				*/
			} else {
				test[datetime] = item;
				newJson.push(item);
			}
		});
		return newJson;
	}
	
	process(myJson) {
		const self = this;
		const newson = this.removeDuplicates(myJson);
		let myce = new CalculatedEnergy();
		myce.resetEnergy(this.timerange);
		//console.log(['myce.energy=',myce.energy]);
		$.each(newson, function(i,v){
			// set cumulative energy for each hour.
			
			let tv = v;
			if (typeof v.pointId !== 'undefined') {
				tv.meterId = v.pointId;
			} 
			if (typeof v.pointValue !== 'undefined') {
				tv.averagePower = v.pointValue;
			}
			myce.addEnergy(tv);
			
			const p = new Feed(tv);
			self.values.push(p);
		});
		//console.log(['HUU myce.energy=',myce.energy]);
		myce.calculateAverage(); 
		myce.copyTo(self.energyValues);
		
		//console.log(['BEFORE SORT self.energyValues=',self.energyValues]);
		
		// Then sort array based according to time, oldest entry first.
		self.energyValues.sort(function(a,b){
			var bb = moment(b.time);
			var aa = moment(a.time);
			return aa - bb;
		});
		
		//console.log(['AFTER SORT self.energyValues=',self.energyValues]);
		//console.log(['self.values=',self.values]);
	}
	
	fetch_d() {
		const self = this;
		let status = 500; // error: 500
		this.errorMessage = '';
		this.fetching = true;
		
		let start_date = moment().format('YYYY-MM-DD');
		let end_date = moment().format('YYYY-MM-DD');
		
		if (this.timerange > 1) {
			const diffe = this.timerange-1;
			start_date = moment().subtract(diffe, 'days').format('YYYY-MM-DD');
		}
		// append start and end date
		const url = this.backend + '/' + this.src + '&start='+start_date+'&end='+end_date;
		
		console.log (['fetch url=',url]);
		fetch(url)
			.then(function(response) {
				status = response.status;
				return response.json();
			})
			.then(function(myJson) {
				self.values = []; // Start with fresh empty data.
				self.energyValues = [];
				
				if (Array.isArray(myJson)) {
					//console.log(['Before process() myJson=',myJson]);
					self.process(myJson);
				}
				
				self.fetching = false;
				self.ready = true;
				self.notifyAll({model:self.name, method:'fetched', status:status, message:'OK'});
			})
			.catch(error => {
				self.fetching = false;
				self.ready = true;
				self.errorMessage = error;
				self.notifyAll({model:self.name, method:'fetched', status:status, message:error});
			});
	}
	
	fetch(token) {
		const self = this;
		
		if (this.fetching) {
			console.log(this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		
		if (typeof token !== 'undefined') {
			
			let status = 500; // error: 500
			this.errorMessage = '';
			this.fetching = true;
			
			let start_date = moment().format('YYYY-MM-DD');
			let end_date = moment().format('YYYY-MM-DD');
			
			if (this.timerange > 1) {
				const diffe = this.timerange-1;
				start_date = moment().subtract(diffe, 'days').format('YYYY-MM-DD');
			}
			
			var myHeaders = new Headers();
			var authorizationToken = 'Bearer '+token;
			myHeaders.append("Authorization", authorizationToken);
			myHeaders.append("Content-Type", "application/json");
			
			const url = this.mongoBackend + '/feeds/';
			const body_url = this.backend + '/' + this.src + '&start='+start_date+'&end='+end_date;
			const data = {url:body_url};
				
			const myPost = {
				method: 'POST',
				headers: myHeaders,
				body: JSON.stringify(data)
			};
			const myRequest = new Request(this.mongoBackend + '/feeds/', myPost);
			
			//console.log('fetch url='+this.mongoBackend+'/feeds/');
			//console.log('body.url='+body_url);
			
			fetch(myRequest)
				.then(function(response) {
					status = response.status;
					return response.json();
				})
				.then(function(myJson) {
					self.values = []; // Start with fresh empty data.
					self.energyValues = [];
					
					if (Array.isArray(myJson)) {
						//console.log(['Before process() myJson=',myJson]);
						self.process(myJson);
					}
					//console.log(['FeedModel fetch status=',status]);
					self.fetching = false;
					self.ready = true;
					self.notifyAll({model:self.name, method:'fetched', status:status, message:'OK'});
				})
				.catch(error => {
					console.log(['FeedModel fetch error=',error]);
					self.fetching = false;
					self.ready = true;
					self.errorMessage = error;
					self.notifyAll({model:self.name, method:'fetched', status:status, message:error});
				});
		} else {
			this.fetch_d();
		}
	}
}
