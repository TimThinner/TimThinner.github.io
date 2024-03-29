import Model from '../common/Model.js';
/*

*/
export default class UserPropsModel extends Model {
	constructor(options) {
		super(options);
		this.bindings = [];
	}
	
	/* Model:
		this.name = options.name;
		this.src = options.src;
		this.ready = false;
		this.errorMessage = '';
		this.fetching = false;
	*/
	
	fetch(po) {
		const self = this;
		const token = po.token;
		
		if (this.fetching) {
			console.log(this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		
		let status = 500; // (OK: 200, AUTH FAILED: 401, error: 500)
		this.errorMessage = '';
		this.fetching = true;
		
		const myHeaders = new Headers();
		const authorizationToken = 'Bearer '+token;
		myHeaders.append("Authorization", authorizationToken);
		
		const url = this.mongoBackend + '/bindings';
		fetch(url, {headers: myHeaders})
			.then(function(response) {
				status = response.status;
				return response.json();
			})
			.then(function(myJson) {
				console.log(['myJson=',myJson]);
				self.bindings = myJson.bindings;
				console.log(['self.bindings=',self.bindings]);
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
