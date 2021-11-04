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
	
	updateConfig(id, data, token) {
		const self = this;
		
		const myHeaders = new Headers();
		const authorizationToken = 'Bearer '+token;
		myHeaders.append("Authorization", authorizationToken);
		myHeaders.append("Content-Type", "application/json");
		
		const myPut = {
			method: 'PUT',
			headers: myHeaders,
			body: JSON.stringify(data)
		};
		const myRequest = new Request(this.mongoBackend + '/configurations/'+id, myPut);
		let status = 500; // RESPONSE (OK: 200, Auth Failed: 401, error: 500)
		
		fetch(myRequest)
			.then(function(response){
				status = response.status;
				return response.json();
			})
			.then(function(myJson){
				if (status === 200) {
					/*const data = [
						{propName:'signup', value:true},
					];*/
					data.forEach(d => {
						if (d.propName === 'signup') {
							if (self.configs.length > 0) 
								self.configs[0].signup = d.value;
							}
						}
					});
				}
				self.notifyAll({model:self.name, method:'updateConfig', status:status, message:myJson.message});
			})
			.catch(function(error){
				self.notifyAll({model:self.name, method:'updateConfig', status:status, message:error});
			});
		
	}
}
