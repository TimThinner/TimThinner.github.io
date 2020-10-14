import Model from '../common/Model.js';
/*

	https://makingcity.vtt.fi/data/sivakka/apartments/feeds.json?apiKey=12E6F2B1236A&type=water&start=2020-10-12&end=2020-10-12
	
	[
	{"created_at":"2020-10-12T00:00:38","residentId":1,"apartmentId":101,"meterId":301,"coldTotal":2970.1,"coldAverage":null,"hotTotal":1984.8,"hotAverage":null},
	{"created_at":"2020-10-12T00:01:38","residentId":1,"apartmentId":101,"meterId":301,"coldTotal":2970.1,"coldAverage":null,"hotTotal":1984.8,"hotAverage":null},
	{"created_at":"2020-10-12T00:02:38","residentId":1,"apartmentId":101,"meterId":301,"coldTotal":2970.1,"coldAverage":null,"hotTotal":1984.8,"hotAverage":null},
	
	...
	
	{"created_at":"2020-10-12T13:28:38","residentId":1,"apartmentId":101,"meterId":301,"coldTotal":3196.6,"coldAverage":null,"hotTotal":2153.2,"hotAverage":null},
	{"created_at":"2020-10-12T13:29:38","residentId":1,"apartmentId":101,"meterId":301,"coldTotal":3196.6,"coldAverage":null,"hotTotal":2153.2,"hotAverage":null}
	]
	
	
*/
export default class UserWaterModel extends Model {
	constructor(options) {
		super(options);
		this.timerange = 1;
		this.type = 'water';
		this.limit = 1;
		this.measurement = {};
	}
	
	/*
		fetch_d
		Calls directly from src using backend (NOT mongoBackend).
	*/
	fetch_d() {
		const self = this;
		let status = 500; // error: 500
		const readkey = '12E6F2B1236A';
		this.errorMessage = '';
		this.fetching = true;
		
		// this.src = 'data/sivakka/apartments/feeds.json'   
		//      must append: ?apiKey=12E6F2B1236A&type=water&start=2020-10-12&end=2020-10-12'
		
		//const start_date = moment().format('YYYY-MM-DD');
		//const end_date = moment().format('YYYY-MM-DD');
		const e_m = moment();
		const s_m = moment().subtract(10, 'minutes');
		const start_date = s_m.format('YYYY-MM-DDTHH:mm');
		const end_date = e_m.format('YYYY-MM-DDTHH:mm');
		
		const url = this.backend + '/' + this.src + '?apiKey='+readkey+'&type='+this.type+'&limit='+this.limit+'&start='+start_date+'&end='+end_date;
		
		fetch(url)
			.then(function(response) {
				status = response.status;
				return response.json();
			})
			.then(function(myJson) {
				self.measurement = myJson;
				console.log(['self.measurement=',self.measurement]);
				console.log([self.name+' fetch status=',status]);
				self.fetching = false;
				self.ready = true;
				let message = 'OK';
				if (typeof self.measurement.message !== 'undefined') {
					message = self.measurement.message;
				}
				self.notifyAll({model:self.name, method:'fetched', status:status, message:message});
			})
			.catch(error => {
				console.log([self.name+' fetch error=',error]);
				self.fetching = false;
				self.ready = true;
				self.errorMessage = error;
				self.notifyAll({model:self.name, method:'fetched', status:status, message:error});
			});
	}
	
	/* Model:
		this.name = options.name;
		this.src = options.src;
		this.ready = false;
		this.errorMessage = '';
		this.fetching = false;
	*/
	
	fetch(token, readkey) {
		const self = this;
		
		if (this.fetching) {
			console.log('MODEL '+this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		if (this.MOCKUP) {
			this.fetch_d();
		} else {
			let status = 500;
			this.errorMessage = '';
			this.fetching = true;
			
			const e_m = moment();
			const s_m = moment().subtract(10, 'minutes');
			const start_date = s_m.format('YYYY-MM-DDTHH:mm');
			const end_date = e_m.format('YYYY-MM-DDTHH:mm');
			
			//let start_date = moment().format('YYYY-MM-DD');
			//let end_date = moment().format('YYYY-MM-DD');
			/*
			if (this.timerange > 1) {
				const diffe = this.timerange-1;
				start_date = moment().subtract(diffe, 'days').format('YYYY-MM-DD');
			}*/
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
							status = response.status;
							return response.json();
						})
						.then(function(myJson) {
							self.measurement = myJson;
							//console.log(['self.measurement=',self.measurement]);
							//console.log([self.name+' fetch status=',status]);
							self.fetching = false;
							self.ready = true;
							let message = 'OK';
							if (typeof self.measurement.message !== 'undefined') {
								message = self.measurement.message;
							}
							self.notifyAll({model:self.name, method:'fetched', status:status, message:message});
						})
						.catch(error => {
							console.log([self.name+' fetch error=',error]);
							self.fetching = false;
							self.ready = true;
							self.errorMessage = error;
							self.notifyAll({model:self.name, method:'fetched', status:status, message:error});
						});
				} else {
					// Abnormal user (admin) => no readkey. Use direct url for testing purposes.
					this.fetch_d();
				}
				
			} else {
				// No token? Authentication failed (401).
				self.errorMessage = 'Auth failed';
				console.log([self.name+' fetch error = ',self.errorMessage]);
				self.fetching = false;
				self.ready = true;
				self.notifyAll({model:self.name, method:'fetched', status:401, message:error});
			}
		}
	}
}
