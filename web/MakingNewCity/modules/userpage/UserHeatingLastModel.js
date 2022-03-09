import Model from '../common/Model.js';
export default class UserHeatingLastModel extends Model {
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
	*/
	constructor(options) {
		super(options);
		this.measurement = {};
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
				self.measurement = resu;
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
				const url = this.mongoBackend + '/proxes/apalast';
				// this.src = 'data/sivakka/apartments/feeds.json' 
				
				// this.src = 'data/sivakka/wlsensordata/last.json' + '?pointId=11534143'
				
				// this.backend = 'https://makingcity.vtt.fi';
				
				const body_url = this.backend + '/' + this.src + '?pointId='+pid;
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
