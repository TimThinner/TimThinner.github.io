import Model from '../common/Model.js';
export default class UserHeatingModel extends Model {
	/* Model:
		this.name = options.name;
		this.src = options.src;
		this.ready = false;
		this.errorMessage = '';
		this.status = 500;
		this.fetching = false;
	*/
	/*
https://makingcity.vtt.fi/data/sivakka/wlsensordata/last.json?pointId=11534143
Palauttaa: 
{"tMeterId":11534143,"hMeterId":11534144,"created_at":"2022-03-09 12:36:16","timestamp":"2022-03-09 12:33:47","temperature":0,"humidity":1267503.8}


New API to fetch apartment data: 

https://makingcity.vtt.fi/data/sivakka/wlsensordata/feeds.json?pointId=11534143&start=2021-12-26&end=2021-12-31&limit=10

Returns:

[
{"created_at":"2021-12-31T20:20:16","timestamp":"2021-12-31T20:16:29","apartmentId":1,"tMeterId":11534143,"hMeterId":11534144,"temperature":21.1,"humidity":20.6},
{"created_at":"2021-12-31T20:28:16","timestamp":"2021-12-31T20:26:29","apartmentId":1,"tMeterId":11534143,"hMeterId":11534144,"temperature":21.1,"humidity":20.7},
{"created_at":"2021-12-31T20:40:16","timestamp":"2021-12-31T20:36:29","apartmentId":1,"tMeterId":11534143,"hMeterId":11534144,"temperature":21.1,"humidity":20.9},
{"created_at":"2021-12-31T20:48:16","timestamp":"2021-12-31T20:46:29","apartmentId":1,"tMeterId":11534143,"hMeterId":11534144,"temperature":21.1,"humidity":20.9},
{"created_at":"2021-12-31T21:00:16","timestamp":"2021-12-31T20:56:29","apartmentId":1,"tMeterId":11534143,"hMeterId":11534144,"temperature":21.1,"humidity":20.8},
{"created_at":"2021-12-31T21:08:16","timestamp":"2021-12-31T21:06:29","apartmentId":1,"tMeterId":11534143,"hMeterId":11534144,"temperature":21.2,"humidity":20.5},
{"created_at":"2021-12-31T21:20:18","timestamp":"2021-12-31T21:16:29","apartmentId":1,"tMeterId":11534143,"hMeterId":11534144,"temperature":21.2,"humidity":20.4},
{"created_at":"2021-12-31T21:28:18","timestamp":"2021-12-31T21:26:29","apartmentId":1,"tMeterId":11534143,"hMeterId":11534144,"temperature":21.2,"humidity":20.5},
{"created_at":"2021-12-31T21:40:16","timestamp":"2021-12-31T21:36:29","apartmentId":1,"tMeterId":11534143,"hMeterId":11534144,"temperature":21.2,"humidity":20.5},
{"created_at":"2021-12-31T21:48:16","timestamp":"2021-12-31T21:46:29","apartmentId":1,"tMeterId":11534143,"hMeterId":11534144,"temperature":21.2,"humidity":20.5}]

A new measurement once every 10 minutes.

=> 6 times an hour => 144 times a day. => 30 days => 4320 values.

Use "timestamp", "temperature" and "humidity".
	*/
	constructor(options) {
		super(options);
		
		if (typeof options.limit !== 'undefined') {
			this.limit = options.limit;
		} else {
			this.limit = 0; // Default is no limit
		}
		
		if (typeof options.timerange !== 'undefined') {
			this.timerange = options.timerange;
		} else {
			this.timerange = 0; // Default is no timerange
		}
		// Response is either an array of measurements (feeds.json) or one mesurement (last.json).
		this.measurements = [];
		this.measurement = {};
		//this.period = {start: undefined, end: undefined};
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
					const resa = [];
					let notvalid = 0;
					resu.forEach(r=>{
						let temp = r.temperature;
						let humi = r.humidity;
						let valid = true;
						
						// Make sure we have sane values:
						const res = {timestamp: r.timestamp};
						if (temp && temp > 0 && temp < 100) {
							res.temperature = temp; // OK
						} else {
							valid = false;
						}
						if (humi && humi > 0 && humi < 100) {
							res.humidity = humi;
						} else {
							valid = false;
						}
						if (valid) { 
							resa.push(res);
						} else {
							notvalid++;
						}
					});
					
					self.measurements = resa;
					console.log(['notvalid count=',notvalid]);
					console.log(['self.measurements=',self.measurements]);
					
				} else {
					let temp = resu.temperature;
					let humi = resu.humidity;
					
					// Make sure we have sane values:
					const res = {timestamp: resu.timestamp};
					if (temp && temp > 0 && temp < 100) {
						res.temperature = temp; // OK
					} else {
						res.temperature = 0;
					}
					if (humi && humi > 0 && humi < 100) {
						res.humidity = humi;
					} else {
						res.humidity = 0;
					}
					self.measurement = res;
				}
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
	
	fetch(token, readkey, pid) {
		if (this.fetching) {
			console.log('MODEL '+this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		
		this.status = 500; // error: 500
		this.errorMessage = '';
		this.fetching = true;
		
		if (typeof token !== 'undefined') {
			var myHeaders = new Headers();
			var authorizationToken = 'Bearer '+token;
			myHeaders.append("Authorization", authorizationToken);
			myHeaders.append("Content-Type", "application/json");
			
			if (typeof readkey !== 'undefined') {
				// Normal user has a readkey, which was created when user registered into the system. 
				//const url = this.mongoBackend + '/apartments/feeds/';
				
				const url = this.mongoBackend + '/proxes/apartments';
				// this.src = 'data/sivakka/apartments/feeds.json' 
				
				/* NOTE:
				Now the backend creates full URL using given params, like: type, limit, start, end =>
				Rewrite this so that URL is is created here at the model.
				
				https://makingcity.vtt.fi/data/sivakka/wlsensordata/feeds.json?pointId=11534143&start=2021-12-26&end=2021-12-31&limit=10
				NEW:
				const body_url = this.backend + '/' + this.src + '?pointId=' + pid + '&start=' + start_date + '&end=' + end_date;
				
				Append pointId: 			?pointId=11534143
				Append start:				&start=2021-12-26
				Append end:					&end=2021-12-31
				*/
				let body_url = this.backend + '/' + this.src + '?pointId='+pid;
				if (this.timerange > 0) {
					const e_m = moment();
					const s_m = moment(e_m).subtract(this.timerange, 'days');
					//this.period.start = s_m.format('YYYY-MM-DDTHH:mm');
					//this.period.end = e_m.format('YYYY-MM-DDTHH:mm');
					const start_date = s_m.format('YYYY-MM-DD');
					const end_date = e_m.format('YYYY-MM-DD');
					body_url += '&start='+start_date+'&end='+end_date;
				}
				if (this.limit > 0) {
					body_url += '&limit='+this.limit;
				}
				
				console.log(['body_url=',body_url]);
				
				
				const data = {
					url:body_url, 
					readkey:readkey, 
					expiration_in_seconds: 180 // 3 minutes
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
				this.notifyAll({model:this.name, method:'fetched', status:this.status, message:message});
			}
			
		} else {
			// No token? Authentication failed (401).
			this.status = 401;
			this.fetching = false;
			this.ready = true;
			const message = this.name+': Auth failed';
			this.errorMessage = message;
			this.notifyAll({model:this.name, method:'fetched', status:this.status, message:message});
		}
	}
}
