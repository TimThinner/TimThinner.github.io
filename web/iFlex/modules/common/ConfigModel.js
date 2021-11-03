import Model from './Model.js';

export default class ConfigModel extends Model {
	
	constructor(options) {
		super(options);
		this.configs = [];
	}
	
	fetch() {
		const self = this;
		//const token = po.token;
		
		if (this.fetching) {
			console.log(this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		this.errorMessage = '';
		this.fetching = true;
		
		let status = 500; // (OK: 200, AUTH FAILED: 401, error: 500)
		//const myHeaders = new Headers();
		//const authorizationToken = 'Bearer '+token;
		//myHeaders.append("Authorization", authorizationToken);
		
		const url = this.mongoBackend + '/configurations';
		fetch(url)//, {headers: myHeaders})
			.then(function(response) {
				status = response.status;
				return response.json();
			})
			.then(function(myJson) {
				console.log(['myJson=',myJson]);
				self.configs = myJson.configurations;
				console.log(['self.configs=',self.configs]);
				self.fetching = false;
				self.ready = true;
				self.notifyAll({model:self.name, method:'fetched', status:status, message:'OK'});
			})
			.catch(error => {
				self.fetching = false;
				self.ready = true;
				self.errorMessage = error;
				self.notifyAll({model:self.name, method:'fetched', status:status, message:error});
			});
	}
	
}
