import Model from '../common/Model.js';
/*
	User has:
		id
		email
		token
		readkey
		is_superuser
*/
export default class UserModel extends Model {
	
	constructor(options) {
		super(options);
		this.id = undefined;
		this.email = undefined;
		this.token = undefined;
		this.readkey = undefined;
		this.is_superuser = false;
		this.localStorageLabel = 'MakingCityUserModel';
	}
	/*
	isLoggedIn() {
		let retval = false;
		if (typeof this.expires !== 'undefined') {
			if (moment().isBefore(moment(this.expires))) {
				retval = true;
			}
		}
		return retval;
	}*/
	isLoggedIn() {
		let retval = false;
		if (typeof this.token !== 'undefined') {
			retval = true;
		}
		return retval;
	}
	
	reset() {
		this.id = undefined;
		this.email = undefined;
		this.token = undefined;
		this.readkey = undefined;
		this.is_superuser = false;
	}
	
	/* For safety reasons the "is_superuser"-flag is never stored or restored automatically. */
	store() {
		const status = localStorage.getItem(this.localStorageLabel);
		const new_status = {
			'id':this.id,
			'email':this.email,
			'token':this.token,
			'readkey': this.readkey
		};
		
		// EXCEPT HERE FOR TEST PURPOSES:
		new_status.is_superuser = this.is_superuser;
		
		if (status == null) {
			// no previous status.
			const encoded = JSON.stringify(new_status);
			localStorage.setItem(this.localStorageLabel, encoded);
			
		} else {
			// previous status exist.
			localStorage.removeItem(this.localStorageLabel);
			const encoded = JSON.stringify(new_status);
			localStorage.setItem(this.localStorageLabel, encoded);
		}
	}
	
	/* For safety reasons the "is_superuser"-flag is never stored or restored automatically. */
	restore() {
		const status = localStorage.getItem(this.localStorageLabel);
		if (status == null) {
			console.log('No status stored in localStorage.');
		} else {
			// Status exist: Restore current situation from localStorage.
			const stat = JSON.parse(status);
			if (typeof stat.id !== 'undefined')    { this.id = stat.id; }
			if (typeof stat.email !== 'undefined') { this.email = stat.email; }
			if (typeof stat.token !== 'undefined') { this.token = stat.token; }
			//if (typeof stat.expires !== 'undefined') { this.expires = stat.expires; }
			
			if (typeof stat.readkey !== 'undefined')          { this.readkey = stat.readkey; }
			//if (typeof stat.readkeystartdate !== 'undefined') { this.readkeystartdate = stat.readkeystartdate; }
			//if (typeof stat.readkeyenddate !== 'undefined')   { this.readkeyenddate = stat.readkeyenddate; }
			
			// EXCEPT HERE FOR TEST PURPOSES:
			if (typeof stat.is_superuser !== 'undefined') { this.is_superuser = stat.is_superuser; }
		}
		
		if (this.isLoggedIn()) {
			// No need to do anything.
		} else {
			this.reset();
			this.store();
		}
	}
	
	
	logout() {
		this.reset();
		this.store();
		console.log('USER LOGOUT! Localstorage cleaned!');
		setTimeout(() => this.notifyAll({model:'UserModel',method:'logout',status:200,message:'Logout OK'}), 100);
	}
	
	/*
	this.mongoBackend = 'http://localhost:3000';
	*/
	
	login(data) {
		const self = this;
		if (this.MOCKUP) {
			this.id = 'nodatabaseid';
			this.email = data.email;
			this.token = 'nodatabasetoken';
			this.is_superuser = false;
			
			// logged in moment()
			//const exp = moment().add(24,'hours');
			//const exp = moment().add(2,'minutes');
			// Formats a string to the ISO8601 standard.
			//this.expires = exp.toISOString(); // 2013-02-04T22:44:30.652Z
			// Store token and email temporarily into localStorage.
			// It will be removed when the user logs-out.
			this.store();
			setTimeout(() => this.notifyAll({model:'UserModel',method:'login',status:200,message:'Login OK'}), 100);
		} else {
			let status = 500; // (OK: 200, AUTH FAILED: 401, error: 500)
			const url = this.mongoBackend + '/users/login';
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
				if (status === 200 && myJson.token) {
					// Login was OK, set the Authentication-token to model.
					self.token = myJson.token;
					self.id = myJson.userId.toString();
					self.email = data.email;
					self.is_superuser = myJson.is_superuser;
					self.readkey = myJson.readkey;
					//self.readkeystartdate = myJson.readkeystartdate;
					//self.readkeyenddate = myJson.readkeyenddate;
					
					// logged in moment()
					//const exp = moment().add(24,'hours');
					//const exp = moment().add(60,'seconds');
					//const exp = moment().add(2,'minutes');
					// Formats a string to the ISO8601 standard.
					//self.expires = exp.toISOString(); // 2013-02-04T22:44:30.652Z
					
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
	}
	
	signup(data) {
		const self = this;
		if (this.MOCKUP) {
			setTimeout(() => this.notifyAll({model:'UserModel',method:'signup',status:201,message:'Signup OK'}), 100);
		} else {
			let status = 500; // RESPONSE (OK: 201, MAIL EXISTS: 409, error: 500)
			const url = this.mongoBackend + '/users/signup';
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
				const message = myJson.message;
				self.notifyAll({model:'UserModel',method:'signup',status:status,message:message});
			})
			.catch(function(error){
				self.notifyAll({model:'UserModel',method:'signup',status:status,message:error});
			});
		}
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
		const url = this.mongoBackend + '/users/changepsw';
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
}
