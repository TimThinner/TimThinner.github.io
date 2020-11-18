import Model from './Model.js';

export default class LogModel extends Model {
	
	constructor(options) {
		super(options);
	}
	
	addToLog(data, token) {
		const self = this;
		if (this.MOCKUP) {
			
			const msg = data.eventType + ' logged';
			setTimeout(() => this.notifyAll({model:'LogModel',method:'addToLog',status:200,message:msg}), 100);
			
		} else {
			// Add authorizatoin headers to this call.
			const myHeaders = new Headers();
			const authorizationToken = 'Bearer '+token;
			myHeaders.append("Authorization", authorizationToken);
			myHeaders.append("Content-Type", "application/json");
			
			const myPost = {
				method: 'POST',
				headers: myHeaders,
				body: JSON.stringify(data)
			};
			const url = this.mongoBackend + '/logs/';
			const myRequest = new Request(url, myPost);
			let status = 500; // RESPONSE (OK: 200, Auth Failed: 401, error: 500)
			/*
			const url = this.mongoBackend + '/logs/';
			fetch(url, {
				method: 'POST',
				body: JSON.stringify(data),
				headers:{
					'Content-Type': 'application/json'
				}
			})*/
			fetch(myRequest)
			.then(function(response) {
				status = response.status;
				return response.json();
			})
			.then(function(myJson) {
				const message = myJson.message;
				self.notifyAll({model:'LogModel',method:'addToLog',status:status,message:message});
			})
			.catch(function(error) {
				self.notifyAll({model:'LogModel',method:'addToLog',status:status,message:error});
			});
		}
	}
}
