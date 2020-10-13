import Model from '../common/Model.js';
/*

”Virtuaaliasuntoja” on aluksi se viisi kappaletta, joita pääsee lukemaan avaimilla

12E6F2B1236A
22E6F2B1236A
32E6F2B1236A
42E6F2B1236A
52E6F2B1236A

eli vain eka numero vaihtuu.

Muistista:
https://makingcity.vtt.fi/data/sivakka/apartments/last.json?apiKey=12E6F2B1236A

ja tietokannasta:

https://makingcity.vtt.fi/data/sivakka/apartments/feeds.json?apiKey=12E6F2B1236A&type=power&limit=10&start=2020-10-10&end=2020-10-10
https://makingcity.vtt.fi/data/sivakka/apartments/feeds.json?apiKey=12E6F2B1236A&type=temperature&limit=10&start=2020-10-12&end=2020-10-12
https://makingcity.vtt.fi/data/sivakka/apartments/feeds.json?apiKey=12E6F2B1236A&type=water&limit=10&start=2020-10-10&end=2020-10-10

{
  "info": {
    "buildingId": 1,
    "apartmentId": 101
  },
  "power": {
    "powerId": 101,
    "lastImpulseCtr": 0,
    "totalImpulseCtr": 0,
    "averagePower": 0,
    "totalEnergy": 0,
    "DateTime": ""
  },
  "temperature": {
    "tempId": 201,
    "temperature": 0,
    "humidity": 0,
    "DateTime": ""
  },
  "water": {
    "waterId": 301,
    "hotWaterAverage": 0,
    "coldWaterAverage": 0,
    "hotWaterTotal": 0,
    "coldWaterTotal": 0,
    "DateTime": ""
  }
}
*/
export default class UserApartmentModel extends Model {
	constructor(options) {
		super(options);
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
		
		// this.src = 'data/sivakka/apartments/last.json' 
		
		const url = this.backend + '/' + this.src + '?apiKey='+readkey;
		fetch(url)
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
	}
	
	fetch(token, readkey) {
		const self = this;
		if (this.fetching) {
			console.log(this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		
		if (this.MOCKUP) {
			this.fetch_d();
		} else {
			let status = 500;
			this.errorMessage = '';
			this.fetching = true;
			
			if (typeof token !== 'undefined') {
				
				var myHeaders = new Headers();
				var authorizationToken = 'Bearer '+token;
				myHeaders.append("Authorization", authorizationToken);
				myHeaders.append("Content-Type", "application/json");
			
				// Params example:
				//req.body.url		https://makingcity.vtt.fi/data/sivakka/apartments/last.json
				//req.body.readkey	5f743b8d49612827a005bd2c
				//
				// https://makingcity.vtt.fi/data/sivakka/apartments/feeds.json?apiKey=12E6F2B1236A&type=power&limit=10&start=2020-10-12&end=2020-10-12
				// https://makingcity.vtt.fi/data/sivakka/apartments/feeds.json?apiKey=12E6F2B1236A&type=temperature&limit=10&start=2020-10-12&end=2020-10-12
				// https://makingcity.vtt.fi/data/sivakka/apartments/feeds.json?apiKey=12E6F2B1236A&type=water&limit=10&start=2020-10-12&end=2020-10-12
				
				if (typeof readkey !== 'undefined') {
					// Normal user has a readkey, which was created when user registered into the system. 
					const url = this.mongoBackend + '/apartments/last/';
					
					// this.src = 'data/sivakka/apartments/last.json' 
					const body_url = this.backend + '/' + this.src;
					const body_readkey = readkey;
					const data = {url:body_url, readkey:body_readkey};
					
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
					// Abnormal user (admin) => no readkey. Use STATIC response for testing purposes.
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
