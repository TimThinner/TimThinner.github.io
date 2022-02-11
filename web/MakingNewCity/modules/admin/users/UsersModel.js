import Model from '../../common/Model.js';
/*
	
	
	Model has following properties  + it extends EventObserver
	constructor(options) {
		super();
		this.name = options.name;
		this.src = options.src;
		this.ready = false;
		this.errorMessage = '';
		this.fetching = false;
	}
	fetch() {
		console.log('DUMMY FETCH!');
		this.ready = true;
	}
*/
export default class UsersModel extends Model {
	
	constructor(options) {
		super(options);
		this.users = [];
	}
	
	fetch(token) {
		const self = this;
		if (this.fetching) {
			console.log('MODEL '+this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		let status = 500; // (OK: 200, AUTH FAILED: 401, error: 500)
		this.errorMessage = '';
		this.fetching = true;
		
		const myHeaders = new Headers();
		const authorizationToken = 'Bearer '+token;
		myHeaders.append("Authorization", authorizationToken);
		
		const url = this.mongoBackend + '/users';
		fetch(url, {headers: myHeaders})
			.then(function(response) {
				status = response.status;
				return response.json();
			}).then(function(myJson) {
				//console.log(['myJson=',myJson]);
				self.users = myJson.users;
				console.log(['self.users=',self.users]);
				self.fetching = false;
				self.ready = true;
				let message = 'OK';
				if (typeof self.users.message !== 'undefined') {
					message = self.users.message;
				}
				self.notifyAll({model:self.name, method:'fetched', status:status, message:message});
			}).catch(error => {
				self.fetching = false;
				self.ready = true;
				self.errorMessage = error;
				self.notifyAll({model:self.name, method:'fetched', status:status, message:error});
			});
	}
}
