import EventObserver from '../common/EventObserver.js';

export default class UserModel extends EventObserver {
	
	constructor() {
		super();
		this.authToken = '';
		this.email = '';
		this.id = '';
		this.is_superuser = false;
		this.address_street = '';
		this.address_postal_code = '';
		this.address_city = '';
		this.locations = [];
		this.localStorageLabel = 'FlexiUserModel';
	}
	
	reset() {
		this.authToken = '';
		this.email = '';
		this.id = '';
		this.is_superuser = false;
		this.address_street = '';
		this.address_postal_code = '';
		this.address_city = '';
		this.locations = [];
	}
	
	login() {
		this.authToken = 'TOKEN-1234-abcd-5678';
		this.id = '1234567890';
		this.email = 'timthinner@gmail.com';
		this.is_superuser = false;
		this.address_street = '';
		this.address_postal_code = '';
		this.address_city = '';
		this.locations = [];
		// Store the UserModel into localStorage.
		this.store();
		setTimeout(() => this.notifyAll({model:'UserModel',method:'login',status:200,message:'User logged in.'}), 100);
	}
	logout() {
		this.reset();
		// Store the empty UserModel into localStorage.
		this.store();
		setTimeout(() => this.notifyAll({model:'UserModel',method:'logout',status:200,message:'User logged out.'}), 100);
	}
	
	
	
	// For safety reasons the "is_superuser"-flag is never stored or restored automatically.
	store() {
		var status = localStorage.getItem(this.localStorageLabel);
		var new_status = {'token':this.authToken,'email':this.email,'id':this.id};
		if (this.locations.length > 0) {
			//console.log(['this.locations=',this.locations]);
			new_status.locations = [];
			this.locations.forEach(loc => {
				new_status.locations.push({name:loc.name, id: loc._id});
			});
		}
		// EXCEPT HERE FOR TEST PURPOSES:
		new_status.is_superuser = this.is_superuser;
		new_status.address_street = this.address_street;
		new_status.address_postal_code = this.address_postal_code;
		new_status.address_city = this.address_city;
		
		if (status == null) {
			// no previous status.
			var encoded = JSON.stringify(new_status);
			localStorage.setItem(this.localStorageLabel, encoded);
			
		} else {
			// previous status exist.
			localStorage.removeItem(this.localStorageLabel);
			var encoded = JSON.stringify(new_status);
			localStorage.setItem(this.localStorageLabel, encoded);
		}
	}
	// For safety reasons the "is_superuser"-flag is never stored or restored automatically.
	restore() {
		var status = localStorage.getItem(this.localStorageLabel);
		if (status == null) {
			console.log('No status stored in localStorage.');
		} else {
			// Status exist: Restore current situation from localStorage.
			var stat = JSON.parse(status);
			if (typeof stat.id !== 'undefined') {
				this.id = stat.id;
			}
			if (typeof stat.token !== 'undefined') {
				this.authToken = stat.token;
			}
			if (typeof stat.email !== 'undefined') {
				this.email = stat.email;
			}
			if (typeof stat.address_street !== 'undefined') {
				this.address_street = stat.address_street;
			}
			if (typeof stat.address_postal_code !== 'undefined') {
				this.address_postal_code = stat.address_postal_code;
			}
			if (typeof stat.address_city !== 'undefined') {
				this.address_city = stat.address_city;
			}
			if (typeof stat.locations !== 'undefined') {
				stat.locations.forEach(loc => {
					this.locations.push({name:loc.name, id: loc.id});
				});
			}
			// EXCEPT HERE FOR TEST PURPOSES:
			if (typeof stat.is_superuser !== 'undefined') {
				this.is_superuser = stat.is_superuser;
			}
		}
		if (this.authToken === '') {
			setTimeout(() => this.notifyAll({model:'UserModel',method:'restored',status:401,message:'Unauthorized.'}), 100);
		} else {
			setTimeout(() => this.notifyAll({model:'UserModel',method:'restored',status:200,message:'Auth successfully restored.'}), 100);
		}
	}
	/*
	login(data) {
		var self = this;
		var status = 500; // (OK: 200, AUTH FAILED: 401, error: 500)
		var url = this.mongoBackend + '/users/login';
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
			var message = myJson.message;
			if (status === 200 && myJson.token) {
				// Login was OK, set the Authentication-token to model.
				self.authToken = myJson.token;
				self.id = myJson.userId.toString();
				self.email = data.email;
				self.is_superuser = myJson.is_superuser;
				self.address_street = myJson.address_street;
				self.address_postal_code = myJson.address_postal_code;
				self.address_city = myJson.address_city;
				self.locations = myJson.locations;
				// Store token and email temporarily into localStorage.
				// It will be removed when the user logs-out.
				self.store();
			}
			self.notifyAll({model:'UserModel',method:'login',status:status,message:message});
		})
		.catch(function(error) {
			self.notifyAll({model:'UserModel',method:'login',status:status,message:error});
		});
	}
	
	signup(data) {
		var self = this;
		var status = 500; // RESPONSE (OK: 201, MAIL EXISTS: 409, error: 500)
		var url = this.mongoBackend + '/users/signup';
		fetch(url, {
			method: 'POST',
			body: JSON.stringify(data),
			headers:{
				'Content-Type': 'application/json'
			}
		})
		.then(function(response){
			status = response.status;
			return response.json();
		})
		.then(function(myJson){
			var message = myJson.message;
			self.notifyAll({model:'UserModel',method:'signup',status:status,message:message});
		})
		.catch(function(error){
			self.notifyAll({model:'UserModel',method:'signup',status:status,message:error});
		});
	}
	
	changePassword(data) {
		const self = this;
		const myHeaders = new Headers();
		const authorizationToken = 'Bearer '+this.authToken;
		myHeaders.append("Authorization", authorizationToken);
		myHeaders.append("Content-Type", "application/json");
		
		const myPost = {
			method: 'POST',
			headers: myHeaders,
			body: JSON.stringify(data)
		};
		const url = this.mongoBackend + '/users/changepassword';
		const myRequest = new Request(url, myPost);
		let status = 500; // RESPONSE (OK: 200, Auth Failed: 401, error: 500)
		
		fetch(myRequest)
			.then(function(response){
				status = response.status;
				return response.json();
			})
			.then(function(myJson){
				self.notifyAll({model:'UserModel', method:'changePassword', status:status, message:myJson.message});
			})
			.catch(function(error){
				self.notifyAll({model:'UserModel', method:'changePassword', status:status, message:error});
			});
	}
	
	//router.get('/confirmation/:token', (req, res, next)=>{
	confirmation(token) {
		var self = this;
		var status = 500; // RESPONSE (OK: 201, MAIL EXISTS: 409, error: 500)
		var url = this.mongoBackend + '/users/confirmation/' + token;
		fetch(url)
		.then(function(response){
			status = response.status;
			return response.json();
		})
		.then(function(myJson){
			var message = myJson.message;
			self.notifyAll({model:'UserModel',method:'confirmation',status:status,message:message});
		})
		.catch(function(error){
			self.notifyAll({model:'UserModel',method:'confirmation',status:status,message:error});
		});
	}
	
	logout() {
		setTimeout(() => this.notifyAll({model:'UserModel',method:'logout',status:200,message:'User logged out.'}), 100);
	}
	
	updateOne(id, data, authToken) {
		const self = this;
		const myHeaders = new Headers();
		const authorizationToken = 'Bearer '+authToken;
		myHeaders.append("Authorization", authorizationToken);
		myHeaders.append("Content-Type", "application/json");
		
		const myPut = {
			method: 'PUT',
			headers: myHeaders,
			body: JSON.stringify(data)
		};
		const url = this.mongoBackend + '/users/'+id;
		const myRequest = new Request(url, myPut);
		let status = 500; // RESPONSE (OK: 200, Auth Failed: 401, error: 500)
		
		fetch(myRequest)
			.then(function(response){
				status = response.status;
				return response.json();
			})
			.then(function(myJson){
				self.notifyAll({model:'UserModel', method:'updateOne', status:status, message:myJson.message,id:id,data:data});
			})
			.catch(function(error){
				self.notifyAll({model:'UserModel', method:'updateOne', status:status, message:error});
			});
	}
	
	cancelForm() {
		setTimeout(() => this.notifyAll({model:'UserModel',method:'cancelForm',status:200,message:''}), 100);
	}
	
	openForm() {
		setTimeout(() => this.notifyAll({model:'UserModel',method:'openForm',status:200,message:''}), 100);
	}
	
	
	*/
}
