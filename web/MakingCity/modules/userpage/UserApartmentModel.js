import Model from '../common/Model.js';
import CalculatedEnergy from '../common/CalculatedEnergy.js';

export default class UserApartmentModel extends Model {
	
	/* Model:
		this.name = options.name;
		this.src = options.src;
		this.ready = false;
		this.errorMessage = '';
		this.status = 500;
		this.fetching = false;
	*/
	
	
	
	/*
	
	Todo: 
	
	When we process response with more than one measurement, we must form result per hour (YYYYMMDDHH) => approx. 60 measurements 
	are summed into object with timestamp as a key (like in FeedModel).
	
	
	created_at: "2020-10-23T00:21:45", meterId: 114, averag
	
	this.energy[YYYYMMDDHH] = {};
	
	
	
	
	apartmentId: 101
​​​​​	averagePower: 660
	created_at: "2020-10-17T06:48:38"
​​​​​	impulseLastCtr: 11
​​​​​	impulseTotalCtr: 474430
​​​​​	meterId: 1001
​​​​​	residentId: 1
​​​​​	totalEnergy: 474.43
	*/
	
	constructor(options) {
		
		super(options);
		
		this.type = options.type;
		this.limit = options.limit;
		// timerange:
		//   - {ends:{value:0,unit:'minutes'},starts:{value:10,unit:'minutes'}}
		//   - {ends:{value:24,unit:'hours'},starts:{value:10,unit:'minutes'}}
		//   - {ends:{value:7,unit:'days'},starts:{value:10,unit:'minutes'}}
		//   - {ends:{value:1,unit:'months'},starts:{value:10,unit:'minutes'}}
		this.timerange = options.timerange;
		this.measurement = [];
		this.period = {start: undefined, end: undefined};
		
		
		this.values = [];
		this.energyValues = [];
		
	}
	
	setTimePeriod() {
		const e_v = this.timerange.ends.value;
		const e_u = this.timerange.ends.unit;
		const s_v = this.timerange.starts.value;
		const s_u = this.timerange.starts.unit;
		const e_m = moment().subtract(e_v, e_u);
		const s_m = moment(e_m).subtract(s_v, s_u);
		this.period.start = s_m.format('YYYY-MM-DDTHH:mm');
		this.period.end = e_m.format('YYYY-MM-DDTHH:mm');
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
		
		
		console.log(['After process() myJson=',newson]);
		
		// More to come.....
		
	}
	
	
	/*
		fetch_d
		Calls directly from src using backend (NOT mongoBackend).
	*/
	fetch_d() {
		const self = this;
		
		// this.src = 'data/sivakka/apartments/feeds.json'   
		//      must append: ?apiKey=12E6F2B1236A&type=type&limit=limit&start=2020-10-12T09:00&end=2020-10-12T10:00'
		// Use FAKE key now: '12E6F2B1236A'
		const fakeKey = '12E6F2B1236A';
		const start_date = this.period.start;
		const end_date = this.period.end;
		
		let url = this.backend + '/' + this.src + '?apiKey='+fakeKey+'&type='+this.type;
		if (this.limit > 0) {
			url += '&limit='+this.limit;
		}
		url += '&start='+start_date+'&end='+end_date;
		
		fetch(url)
			.then(function(response) {
				self.status = response.status;
				return response.json();
			})
			.then(function(myJson) {
				let message = 'OK';
				if (Array.isArray(myJson)) {
					
					if (myJson.length === 1) {
						self.measurement = myJson;
					} else {
						console.log(['Before process() myJson=',myJson]);
						self.process(myJson);
					}
					
					
				} else {
					if (myJson === 'No data!') {
						self.status = 404;
						message = self.name+': '+myJson;
						self.errorMessage = message;
						self.measurement = [];
					} else if (typeof self.measurement.message !== 'undefined') {
						message = self.measurement.message;
						self.errorMessage = message;
						self.measurement = [];
					} else {
						self.measurement = [];
					}
				}
				console.log(['self.measurement=',self.measurement]);
				console.log([self.name+' fetch status=',self.status]);
				self.fetching = false;
				self.ready = true;
				self.notifyAll({model:self.name, method:'fetched', status:self.status, message:message});
			})
			.catch(error => {
				console.log([self.name+' fetch error=',error]);
				self.fetching = false;
				self.ready = true;
				const message = self.name+': '+error;
				self.errorMessage = message;
				self.notifyAll({model:self.name, method:'fetched', status:self.status, message:message});
			});
	}
	
	fetch(token, readkey) {
		const self = this;
		if (this.fetching) {
			console.log('MODEL '+this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		
		// Always start with setting the TIME PERIOD!
		this.setTimePeriod();
		this.status = 500; // error: 500
		this.errorMessage = '';
		this.fetching = true;
		
		if (this.MOCKUP) {
			this.fetch_d();
		} else {
			const start_date = this.period.start;
			const end_date = this.period.end;
			
			if (typeof token !== 'undefined') {
				var myHeaders = new Headers();
				var authorizationToken = 'Bearer '+token;
				myHeaders.append("Authorization", authorizationToken);
				myHeaders.append("Content-Type", "application/json");
				
				if (typeof readkey !== 'undefined') {
					// Normal user has a readkey, which was created when user registered into the system. 
					const url = this.mongoBackend + '/apartments/feeds/';
					
					// this.src = 'data/sivakka/apartments/feeds.json' 
					const body_url = this.backend + '/' + this.src;
					const data = {url:body_url, readkey:readkey, type: this.type, limit:this.limit, start: start_date, end: end_date };
					
					const myPost = {
						method: 'POST',
						headers: myHeaders,
						body: JSON.stringify(data)
					};
					const myRequest = new Request(url, myPost);
					fetch(myRequest)
						.then(function(response) {
							self.status = response.status;
							return response.json();
						})
						.then(function(myJson) {
							let message = 'OK';
							if (Array.isArray(myJson)) {
								
								if (myJson.length === 1) {
									self.measurement = myJson;
								} else {
									console.log(['Before process() myJson=',myJson]);
									self.process(myJson);
								}
								
							} else {
								if (myJson === 'No data!') {
									self.status = 404;
									message = self.name+': '+myJson;
									self.errorMessage = message;
									self.measurement = [];
								} else if (typeof self.measurement.message !== 'undefined') {
									message = self.measurement.message;
									self.errorMessage = message;
									self.measurement = [];
								} else {
									self.measurement = [];
								}
							}
							//console.log(['self.measurement=',self.measurement]);
							//console.log([self.name+' fetch status=',self.status]);
							self.fetching = false;
							self.ready = true;
							self.notifyAll({model:self.name, method:'fetched', status:self.status, message:message});
						})
						.catch(error => {
							console.log([self.name+' fetch error=',error]);
							self.fetching = false;
							self.ready = true;
							const message = self.name+': '+error;
							self.errorMessage = message;
							self.notifyAll({model:self.name, method:'fetched', status:self.status, message:message});
						});
				} else {
					// Abnormal user (admin) => no readkey. Use direct url for testing purposes.
					this.fetch_d();
				}
				
			} else {
				// No token? Authentication failed (401).
				self.status = 401;
				self.fetching = false;
				self.ready = true;
				const message = self.name+': Auth failed';
				self.errorMessage = message;
				self.notifyAll({model:self.name, method:'fetched', status:self.status, message:message});
			}
		}
	}
}
