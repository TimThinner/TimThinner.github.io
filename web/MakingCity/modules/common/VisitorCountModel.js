import Model from './Model.js';

export default class VisitorCountModel extends Model {
	
	constructor(options) {
		super(options);
	}
	
	get() {
		const self = this;
		if (this.MOCKUP) {
			
			setTimeout(() => this.notifyAll({model:self.name,method:'get',status:200,count:123}), 100);
			
		} else {
			let status = 500;
			const url = this.mongoBackend + '/visitorcounts/';
			fetch(url, {
				method: 'GET',
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
				const count = myJson.count;
				if (status === 200) {
					self.notifyAll({model:self.name, method:'get',status:status,count:count});
				} else {
					self.notifyAll({model:self.name, method:'get',status:status,message:message});
				}
				
			})
			.catch(function(error) {
				self.notifyAll({model:self.name,method:'get',status:status,message:error});
			});
		}
	}
	
	inc() {
		const self = this;
		if (this.MOCKUP) {
			
			setTimeout(() => this.notifyAll({model:self.name,method:'inc',status:200,message:'Visitor count incremented'}), 100);
			
		} else {
			let status = 500;
			const url = this.mongoBackend + '/visitorcounts/';
			fetch(url, {
				method: 'POST',
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
				self.notifyAll({model:self.name, method:'inc',status:status,message:message});
			})
			.catch(function(error) {
				self.notifyAll({model:self.name,method:'inc',status:status,message:error});
			});
		}
	}
}
