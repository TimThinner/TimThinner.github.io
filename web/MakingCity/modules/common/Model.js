import EventObserver from './EventObserver.js';

export default class Model extends EventObserver {
	
	constructor(options) {
		super();
		this.name = options.name;
		this.src = options.src;
		this.ready = false;
		this.errorMessage = '';
		this.status = 500;
		this.fetching = false;
	}
	
	/* Dummy reset. */
	reset() {
		
	}
	
	/* Dummy fetch. */
	fetch() {
		console.log('DUMMY FETCH!');
		this.ready = true;
	}
	// To remove all proxy entries that are obviously old.
	clean() {
		const self = this;
		let status = 500;
		const url = this.mongoBackend + '/proxes/clean/';
		fetch(url)
			.then(function(response) {
				status = response.status;
				return response.json();
			})
			.then(function(myJson) {
				console.log(['clean myJson=',myJson]);
				self.notifyAll({model:self.name, method:'clean', status:status, message:'OK'});
			})
			.catch(error => {
				self.notifyAll({model:self.name, method:'clean', status:status, message:error});
			});
	}
}
