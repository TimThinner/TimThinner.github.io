import Model from './Model.js';

export default class LogModel extends Model {
	
	constructor(options) {
		super(options);
	}
	
	addToLog(data) {
		const self = this;
		if (this.MOCKUP) {
			
			const msg = data.eventType + ' logged';
			setTimeout(() => this.notifyAll({model:'LogModel',method:'addToLog',status:200,message:msg}), 100);
			
		} else {
			let status = 500;
			const url = this.mongoBackend + '/logs/';
			fetch(url, {
				method: 'POST',
				body: JSON.stringify(data),
				headers:{
					'Content-Type': 'application/json'
				}
			})
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
