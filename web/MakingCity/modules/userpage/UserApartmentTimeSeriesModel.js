import Model from '../common/Model.js';

export default class UserApartmentTimeSeriesModel extends Model {
	
	/* Model:
		this.name = options.name;
		this.src = options.src;
		this.ready = false;
		this.errorMessage = '';
		this.status = 500;
		this.fetching = false;
	*/
	
	/*
	Another case is when we need DAILY consumption data. This applies to electricity and water, where we need to fetch 
	total consumptions at the beginnning and at the end of each day.
	This also is different to those which go back 24 hours (or one week, or one month) from current time.
	But we have the limit=1 here also, which makes this easier. And we should keep already fetched daily values in memory. They don't change.
	This is a new "category", data is not needed to fetch periodically. Fetch ONCE case.
	
	
	apartmentId: 101
	coldAverage: null
	coldTotal: 14678.5
	created_at: "2020-11-29T23:59:01"
	hotAverage: null
	hotTotal: 9968.9
	meterId: 301
	residentId: 1
	
	
	apartmentId: 101
	coldAverage: null
	coldTotal: 14678.5
	created_at: "2020-11-29T23:59:01"
	hotAverage: null
	hotTotal: 9968.9
	meterId: 301
	residentId: 1
	
	
	*/
	constructor(options) {
		
		super(options);
		
		this.type = options.type;
		this.limit = options.limit;
		this.numberOfRounds = options.rounds;
		this.rounds = 0;
		this.measurement = [];
		this.period = {start: undefined, end: undefined};
		
		this.values = [];
		this.energyValues = [];
		this.waterValues = [];
	}
	
	reset() {
		this.values = [];
		this.energyValues = [];
		this.waterValues = [];
	}
	
	// always subtract 1.- 2.   2.-3. etc.
	
/*
coldTotal: 13732.4
​​​created_at: "2020-11-27T23:59:01"
​​​hotTotal: 9333.3
*/
	updateWaterValues() {
		let previous = undefined;
		this.waterValues = [];
		this.values.forEach((v,i)=>{
			if (i===0) {
				previous = v;
			} else {
				const time = new Date(previous.created_at);
				const hot = previous.hotTotal - v.hotTotal;
				const cold = previous.coldTotal - v.coldTotal;
				const e = {'time':time,'hot':hot,'cold':cold};
				this.waterValues.push(e);
				previous = v;
			}
		});
	}
	
	updateEnergyValues() {
		let previous = undefined;
		this.energyValues = [];
		this.values.forEach((v,i)=>{
			if (i===0) {
				previous = v;
			} else {
				const time = new Date(previous.created_at);
				const ene = previous.totalEnergy - v.totalEnergy;
				const e = {'time':time,'energy':ene};
				this.energyValues.push(e);
				previous = v;
			}
		});
		
	}
	
	setPeriod() {
		// this.rounds 0, 1, 2, 3, ....
		// Create a separate model for each full day in history starting from "yesterday".
		let e_m = moment();
		e_m.hours(0);
		e_m.minutes(0);
		e_m.seconds(0);
		let s_m = moment(e_m).subtract(5,'minutes');
		
		if (this.rounds===0) {
			this.period.start = s_m.format('YYYY-MM-DDTHH:mm');
			this.period.end = e_m.format('YYYY-MM-DDTHH:mm');
		} else {
			const numberOfHours = this.rounds*24;
			e_m = moment(e_m).subtract(numberOfHours,'hours');
			s_m = moment(s_m).subtract(numberOfHours,'hours');
			this.period.start = s_m.format('YYYY-MM-DDTHH:mm');
			this.period.end = e_m.format('YYYY-MM-DDTHH:mm');
		}
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
						self.values.push(myJson[0]);
						//console.log(['VALUES ARRAY HAS NOW ',self.values.length,' ITEMS! values=',self.values]);
						if (self.type==='water') {
							self.updateWaterValues();
						} else if (self.type==='energy') {
							self.updateEnergyValues();
						}
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
				//self.fetching = false;
				//self.ready = true;
				self.notifyAll({model:self.name, method:'fetched', status:self.status, message:message});
			})
			.catch(error => {
				console.log([self.name+' fetch error=',error]);
				//self.fetching = false;
				//self.ready = true;
				const message = self.name+': '+error;
				self.errorMessage = message;
				self.notifyAll({model:self.name, method:'fetched', status:self.status, message:message});
			});
	}
	
	fetch(token, readkey) {
		const self = this;
		/*
		if (this.fetching) {
			console.log('MODEL '+this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		*/
		// Always start with setting the TIME PERIOD!
		if (this.rounds < this.numberOfRounds) {
			this.setPeriod();
			this.rounds++;
			
			
			
		} else {
			this.rounds=0;
			console.log('STOP!');
			
			
			this.fetching = false;
			this.ready = true;
			this.notifyAll({model:this.name, method:'fetched-all', status:200, message:'OK'});
			return;
		}
		
		console.log(['FETCH FROM:',this.period.start,' TO:',this.period.end]);
		
		
		
		this.status = 500; // error: 500
		this.errorMessage = '';
		this.fetching = true;
		this.ready = false;
		
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
									self.values.push(myJson[0]);
									//console.log(['VALUES ARRAY HAS NOW ',self.values.length,' ITEMS! values=',self.values]);
									if (self.type==='water') {
										self.updateWaterValues();
									} else if (self.type==='energy') {
										self.updateEnergyValues();
									}
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
							//self.fetching = false;
							//self.ready = true;
							self.notifyAll({model:self.name, method:'fetched', status:self.status, message:message});
						})
						.catch(error => {
							console.log([self.name+' fetch error=',error]);
							//self.fetching = false;
							//self.ready = true;
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
				//self.fetching = false;
				//self.ready = true;
				const message = self.name+': Auth failed';
				self.errorMessage = message;
				self.notifyAll({model:self.name, method:'fetched', status:self.status, message:message});
			}
		}
	}
}
