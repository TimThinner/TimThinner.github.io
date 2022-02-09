import Model from './Model.js';

export default class ProxyCleanerModel extends Model {
	
	constructor(options) {
		super(options);
	}
	
	fetch() {
		// To remove all proxy entries that are obviously old.
		const self = this;
		
		this.ready = false;
		this.errorMessage = '';
		this.fetching = true;
		
		let status = 500;
		
		const url = this.mongoBackend + '/proxes/clean/';
		fetch(url)
			.then(function(response) {
				status = response.status;
				return response.json();
			})
			.then(function(myJson) {
				//console.log(['clean myJson=',myJson]);
				self.fetching = false;
				self.ready = true;
				self.notifyAll({model:self.name, method:'fetch', status:status, message:'OK'});
			})
			.catch(error => {
				self.fetching = false;
				self.ready = true;
				self.errorMessage = error;
				self.notifyAll({model:self.name, method:'fetch', status:status, message:error});
			});
	}
}
