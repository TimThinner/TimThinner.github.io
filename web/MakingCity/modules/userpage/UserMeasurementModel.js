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

https://makingcity.vtt.fi/data/sivakka/apartments/feeds.json?apiKey=12E6F2B1236A&type=power&limit=10&start=2020-09-30&end=2020-09-30
https://makingcity.vtt.fi/data/sivakka/apartments/feeds.json?apiKey=12E6F2B1236A&type=temperature&limit=10&start=2020-09-30&end=2020-09-30
https://makingcity.vtt.fi/data/sivakka/apartments/feeds.json?apiKey=12E6F2B1236A&type=water&limit=10&start=2020-09-30&end=2020-09-30

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
export default class UserMeasurementModel extends Model {
	constructor(options) {
		super(options);
		// By default UserMeasurementModel shows data from today.
		//this.start = moment().format('YYYY-MM-DD');
		//this.end = moment().format('YYYY-MM-DD');
		this.timerange = 1;
		this.measurement = {};
	}
	
	
	/*
	fetch(token, readkey) {
		const self = this;
		if (this.fetching) {
			console.log('MEASUREMENT '+this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		
		let status = 500; // error: 500
		this.errorMessage = '';
		this.fetching = true;
		
		let start_date = moment().format('YYYY-MM-DD');
		let end_date = moment().format('YYYY-MM-DD');
		
		if (this.timerange > 1) {
			const diffe = this.timerange-1;
			start_date = moment().subtract(diffe, 'days').format('YYYY-MM-DD');
		}
		
		if (typeof token !== 'undefined') {
			
			var myHeaders = new Headers();
			var authorizationToken = 'Bearer '+token;
			myHeaders.append("Authorization", authorizationToken);
			myHeaders.append("Content-Type", "application/json");
			
			// Params example:
			//req.body.url		https://makingcity.vtt.fi/data/sivakka/apartments/last.json
			//req.body.readkey	5f743b8d49612827a005bd2c
			//
			if (typeof readkey !== 'undefined') {
				// Normal user has a readkey, which was created when user registered into the system. 
				const url = this.mongoBackend + '/measurements/';
				//const body_url = this.backend + '/' + this.src + '&start='+start_date+'&end='+end_date;
				const body_url = 'https://makingcity.vtt.fi/data/sivakka/apartments/last.json';
				const body_readkey = readkey;
				const data = {url:body_url, readkey:body_readkey};
				
				const myPost = {
					method: 'POST',
					headers: myHeaders,
					body: JSON.stringify(data)
				};
				const myRequest = new Request(this.mongoBackend + '/measurements/', myPost);
				
				//console.log('fetch url='+this.mongoBackend+'/measurements/');
				//console.log('body.url='+body_url);
				
				fetch(myRequest)
					.then(function(response) {
						status = response.status;
						return response.json();
					})
					.then(function(myJson) {
						self.measurement = myJson;
						console.log(['self.measurement=',self.measurement]);
						console.log(['UserMeasurementModel fetch status=',status]);
						self.fetching = false;
						self.ready = true;
						self.notifyAll({model:self.name, method:'fetched', status:status, message:'OK'});
					})
					.catch(error => {
						console.log(['UserMeasurementModel fetch error=',error]);
						self.fetching = false;
						self.ready = true;
						self.errorMessage = error;
						self.notifyAll({model:self.name, method:'fetched', status:status, message:error});
					});
			} else {
				// Abnormal user (admin) => no readkey. Use STATIC response for testing purposes.
				console.log('Using STATIC response!');
				status = 200; // OK
				self.measurement = {
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
				};
				console.log(['self.measurement=',self.measurement]);
				setTimeout(() => {
					this.fetching = false;
					this.ready = true;
					this.notifyAll({model:this.name, method:'fetched', status:status, message:'OK'});
				}, 200);
			}
		} else {
			const error = 'Token MISSING';
			self.fetching = false;
			self.ready = true;
			self.errorMessage = error
			self.notifyAll({model:self.name, method:'fetched', status:status, message:error});
		}
	}
	*/
	
	
	fetch(token) {
		const self = this;
		if (this.fetching) {
			console.log('MEASUREMENT '+this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		
		let status = 500; // error: 500
		this.errorMessage = '';
		this.fetching = true;
		
		console.log('Using STATIC response!');
		status = 200; // OK
		this.measurement = {
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
		};
		console.log(['self.measurement=',self.measurement]);
		setTimeout(() => {
			this.fetching = false;
			this.ready = true;
			this.notifyAll({model:this.name, method:'fetched', status:status, message:'OK'});
		}, 200);
	}
}
