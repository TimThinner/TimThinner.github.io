import Model from '../common/Model.js';
export default class NewUserElectricityModel extends Model {
	
	/* Model:
		this.name = options.name;
		this.src = options.src;
		this.ready = false;
		this.errorMessage = '';
		this.status = 500;
		this.fetching = false;
	*/
	
	/*
	
	NEW:
	Use URL:
		https://makingcity.vtt.fi/data/sivakka/apartments/feeds.json?apiKey=12E6F2B1236A&type=energy&start=2022-04-07T00:00&end=2022-04-08T00:00
	
	Fetch one day at a time. It contains 1 minute interval= 1440 values per day.
	Current day has only values so far.
	
	If today is 8.4.2022
	when index = 0 => start=2022-04-07T00:00&end=2022-04-08T00:00
	when index = 1 => start=2022-04-06T00:00&end=2022-04-07T00:00
	...
	Response is like this:
	...
	[
	{"created_at":"2022-04-07T00:26:35","residentId":1,"apartmentId":101,"meterId":1001,"averagePower":720,"totalEnergy":20871.153,"impulseLastCtr":12,"impulseTotalCtr":20871153},
	{"created_at":"2022-04-07T00:27:35","residentId":1,"apartmentId":101,"meterId":1001,"averagePower":660,"totalEnergy":20871.164,"impulseLastCtr":11,"impulseTotalCtr":20871164},
	{"created_at":"2022-04-07T00:28:35","residentId":1,"apartmentId":101,"meterId":1001,"averagePower":720,"totalEnergy":20871.176,"impulseLastCtr":12,"impulseTotalCtr":20871176},
	{"created_at":"2022-04-07T00:29:35","residentId":1,"apartmentId":101,"meterId":1001,"averagePower":660,"totalEnergy":20871.187,"impulseLastCtr":11,"impulseTotalCtr":20871187},
	...
	]
	Extract:
		created_at
		averagePower
		totalEnergy
	*/
	constructor(options) {
		
		super(options);
		
		this.type = options.type;
		this.limit = options.limit;
		this.index = options.index;
		this.period = {start: undefined, end: undefined};
		this.values = [];
	}
	
	/*
		NOTE: Each day has its own model.
		There is 'UserElectricity0Model', 'UserElectricity1Model', 'UserElectricity2Model', ...
		where index is the same number as in models name.
		index	fetch
		0		start=2022-04-08T00:00&end=2022-04-08T12:34
		1		start=2022-04-07T00:00&end=2022-04-08T00:00
		2		start=2022-04-06T00:00&end=2022-04-07T00:00
		...
	*/
	
	setTimePeriod() {
		const i = this.index;
		if (i === 0) {
			// if current day, fetch always from start of current day, for example:
			// start=2022-04-08T00:00&end=2022-04-08T12:34
			const e_m = moment();
			const s_m = moment();
			s_m.hours(0);
			s_m.minutes(0);
			this.period.start = s_m.format('YYYY-MM-DDTHH:mm');
			this.period.end = e_m.format('YYYY-MM-DDTHH:mm');
			
		} else {
			// if not the current day, fetch always full day, for example:
			// start=2022-04-07T00:00&end=2022-04-08T00:00
			const ei = i-1;
			const si = i;
			const e_m = moment().subtract(ei, 'days');
			// Make dates start at midnight and end at midnight.
			e_m.hours(0);
			e_m.minutes(0);
			const s_m = moment(e_m).subtract(1, 'days');
			this.period.start = s_m.format('YYYY-MM-DDTHH:mm');
			this.period.end = e_m.format('YYYY-MM-DDTHH:mm');
		}
	}
	
	doTheFetch(url) {
		const self = this;
		
		fetch(url)
			.then(function(response) {
				self.status = response.status;
				return response.json();
			})
			.then(function(myJson) {
				let message = 'OK';
				const resu = JSON.parse(myJson);
				if (Array.isArray(resu)) {
					
					self.values = resu;
					console.log(['self.values=',self.values]);
					
				} else {
					if (myJson === 'No data!') {
						self.status = 404;
						message = self.name+': '+myJson;
						self.errorMessage = message;
						self.measurement = [];
						
					} else if (myJson === 'Err:PROTOCOL_SEQUENCE_TIMEOUT') {
						console.log('Err:PROTOCOL_SEQUENCE_TIMEOUT  !!!!!!!!!!!!!!!!!!?');
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
				self.notifyAll({model:self.name, method:'fetched', status:self.status, message:message, index:self.index});
			})
			.catch(error => {
				console.log([self.name+' fetch error=',error]);
				self.fetching = false;
				self.ready = true;
				const message = self.name+': '+error;
				self.errorMessage = message;
				self.notifyAll({model:self.name, method:'fetched', status:self.status, message:message, index:self.index});
			});
	}
	
	fetch(token, readkey) {
		if (this.fetching) {
			console.log('MODEL '+this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		
		// Always start with setting the TIME PERIOD!
		this.setTimePeriod();
		this.status = 500; // error: 500
		this.errorMessage = '';
		this.fetching = true;
		
		const start_date = this.period.start;
		const end_date = this.period.end;
		
		if (typeof token !== 'undefined') {
			var myHeaders = new Headers();
			var authorizationToken = 'Bearer '+token;
			myHeaders.append("Authorization", authorizationToken);
			myHeaders.append("Content-Type", "application/json");
			
			if (typeof readkey !== 'undefined') {
				// Normal user has a readkey, which was created when user registered into the system. 
				//const url = this.mongoBackend + '/apartments/feeds/';
				// this.src = 'data/sivakka/apartments/feeds.json' 
				const url = this.mongoBackend + '/proxes/apafeeds';
				const body_url = this.backend + '/' + this.src;
				const data = {
					url:body_url,
					readkey:readkey,
					type: this.type,
					limit:this.limit,
					start: start_date,
					end: end_date,
					expiration_in_seconds: 3600
				};
				const myPost = {
					method: 'POST',
					headers: myHeaders,
					body: JSON.stringify(data)
				};
				const myRequest = new Request(url, myPost);
				this.doTheFetch(myRequest);
				
			} else {
				// No readkey? Forbidden (403).
				this.status = 403;
				this.fetching = false;
				this.ready = true;
				const message = this.name+': Forbidden';
				this.errorMessage = message;
				this.notifyAll({model:this.name, method:'fetched', status:this.status, message:message, index:this.index});
			}
			
		} else {
			// No token? Authentication failed (401).
			this.status = 401;
			this.fetching = false;
			this.ready = true;
			const message = this.name+': Auth failed';
			this.errorMessage = message;
			this.notifyAll({model:this.name, method:'fetched', status:this.status, message:message, index:this.index});
		}
	}
}
