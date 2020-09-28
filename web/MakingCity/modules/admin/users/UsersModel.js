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
		
		console.log(['MODEL '+this.name+' FETCH CALLED! token=',token]);
		
		if (this.fetching) {
			console.log('MODEL '+this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		//const debug_time_start = moment().valueOf();
		this.errorMessage = '';
		this.fetching = true;
		
		let status = 500; // (OK: 200, AUTH FAILED: 401, error: 500)
		/*
		console.log ([this.name+' fetch url=',url]);
		status = 200; // OK
		setTimeout(() => {
			
			this.fetching = false;
			this.ready = true;
			this.notifyAll({model:this.name, method:'fetched', status:status, message:'OK'});
			
		}, 200);
		*/
		const myHeaders = new Headers();
		const authorizationToken = 'Bearer '+token;
		myHeaders.append("Authorization", authorizationToken);
		
		const url = this.mongoBackend + '/users';
		fetch(url, {headers: myHeaders})
			.then(function(response) {
				status = response.status;
				return response.json();
			})
			.then(function(myJson) {
				//console.log(['myJson=',myJson]);
				self.users = myJson.users;
				console.log(['self.users=',self.users]);
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
