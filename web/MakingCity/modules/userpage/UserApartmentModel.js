import Model from '../common/Model.js';

export default class UserApartmentModel extends Model {
	
	/* Model:
		this.name = options.name;
		this.src = options.src;
		this.ready = false;
		this.errorMessage = '';
		this.status = 500;
		this.fetching = false;
	*/
	
	constructor(options) {
		
		super(options);
		
		this.type = options.type;
		this.limit = options.limit;
		// timerange:
		//   - "NOW"
		//   - "NOW-24HOURS"
		//   - "NOW-7DAYS"
		//   - "NOW-1MONTH"
		this.timerange = options.timerange;
		this.measurement = [];
		this.period = {start: undefined, end: undefined};
	}
	
	setTimePeriod() {
		if (this.timerange === 'NOW-24HOURS') {
			const e_m = moment().subtract(24, 'hours');
			const s_m = moment(e_m).subtract(10, 'minutes');
			this.period.start = s_m.format('YYYY-MM-DDTHH:mm');
			this.period.end = e_m.format('YYYY-MM-DDTHH:mm');
			
		} else if (this.timerange === 'NOW-7DAYS') {
			const e_m = moment().subtract(7, 'days');
			const s_m = moment(e_m).subtract(10, 'minutes');
			this.period.start = s_m.format('YYYY-MM-DDTHH:mm');
			this.period.end = e_m.format('YYYY-MM-DDTHH:mm');
			
		} else if (this.timerange === 'NOW-1MONTH') {
			const e_m = moment().subtract(1, 'months');
			const s_m = moment(e_m).subtract(10, 'minutes');
			this.period.start = s_m.format('YYYY-MM-DDTHH:mm');
			this.period.end = e_m.format('YYYY-MM-DDTHH:mm');
			
		} else { // 'NOW'
			const e_m = moment();
			const s_m = moment(e_m).subtract(10, 'minutes');
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
		const readkey = '12E6F2B1236A';
		
		// this.src = 'data/sivakka/apartments/feeds.json'   
		//      must append: ?apiKey=12E6F2B1236A&type=type&limit=limit&start=2020-10-12T09:00&end=2020-10-12T10:00'
		
		const start_date = this.period.start;
		const end_date = this.period.end;
		
		const url = this.backend + '/' + this.src + '?apiKey='+readkey+'&type='+this.type+'&limit='+this.limit+'&start='+start_date+'&end='+end_date;
		
		fetch(url)
			.then(function(response) {
				self.status = response.status;
				return response.json();
			})
			.then(function(myJson) {
				let message = 'OK';
				if (Array.isArray(myJson)) {
					self.measurement = myJson;
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
								self.measurement = myJson;
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
