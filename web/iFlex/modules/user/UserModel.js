import Model from '../common/Model.js';
/*
	User has:
		id
		email
		token
		apartmentId
		readkey
		readkey_startdate
		readkey_enddate
		obix_code
		obix_code_b
		obix_code_c
		request_for_sensors
		consent_a
		consent_b
		
		is_superuser
*/
export default class UserModel extends Model {
	
	constructor(options) {
		super(options);
		this.id = undefined;
		this.email = undefined;
		this.token = undefined;
		this.apartmentId = undefined;
		this.readkey = undefined;
		this.readkey_startdate = undefined;
		this.readkey_enddate = undefined;
		this.obix_code = '';
		this.obix_code_b = '';
		this.obix_code_c = '';
		this.request_for_sensors = false;
		this.consent_a = false;
		this.consent_b = false;
		this.is_superuser = false;
		this.localStorageLabel = 'iFlexUserModel';
	}
	
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
		this.apartmentId = undefined;
		this.readkey = undefined;
		this.readkey_startdate = undefined;
		this.readkey_enddate = undefined;
		this.obix_code = '';
		this.obix_code_b = '';
		this.obix_code_c = '';
		this.request_for_sensors = false;
		this.consent_a = false;
		this.consent_b = false;
		this.is_superuser = false;
	}
	
	store() {
		const status = localStorage.getItem(this.localStorageLabel);
		const new_status = {
			'id': this.id,
			'email': this.email,
			'token': this.token,
			'apartmentId': this.apartmentId,
			'readkey': this.readkey,
			'readkey_startdate': this.readkey_startdate,
			'readkey_enddate': this.readkey_enddate,
			'obix_code': this.obix_code,
			'obix_code_b': this.obix_code_b,
			'obix_code_c': this.obix_code_c,
			'request_for_sensors': this.request_for_sensors,
			'consent_a': this.consent_a,
			'consent_b': this.consent_b
		};
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
			if (typeof stat.apartmentId !== 'undefined') { this.apartmentId = stat.apartmentId; }
			if (typeof stat.readkey !== 'undefined') { this.readkey = stat.readkey; }
			if (typeof stat.readkey_startdate !== 'undefined') { this.readkey_startdate = stat.readkey_startdate; }
			if (typeof stat.readkey_enddate !== 'undefined') { this.readkey_enddate = stat.readkey_enddate; }
			if (typeof stat.obix_code !== 'undefined') { this.obix_code = stat.obix_code; }
			if (typeof stat.obix_code_b !== 'undefined') { this.obix_code_b = stat.obix_code_b; }
			if (typeof stat.obix_code_c !== 'undefined') { this.obix_code_c = stat.obix_code_c; }
			if (typeof stat.request_for_sensors !== 'undefined') { this.request_for_sensors = stat.request_for_sensors; }
			if (typeof stat.consent_a !== 'undefined') { this.consent_a = stat.consent_a; }
			if (typeof stat.consent_b !== 'undefined') { this.consent_b = stat.consent_b; }
		}
		
		if (this.isLoggedIn()) {
			// Let the masterController know that user is logged in.
			setTimeout(() => this.notifyAll({model:'UserModel',method:'login',status:200,message:'Login OK'}), 100);
		} else {
			this.reset();
			this.store();
		}
	}
	
	
	logout() {
		
		// Before resetting (id, email, token, ...), we might want to do something...
		// like logging "Logout" for current user.
		// NOTE: NO setTimeout, we need this to happen now!
		this.notifyAll({model:'UserModel',method:'before-logout',id:this.id,token:this.token});
		
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
				self.apartmentId = myJson.apartmentId;
				self.readkey = myJson.readkey;
				self.readkey_startdate = myJson.readkey_startdate;
				self.readkey_enddate = myJson.readkey_enddate;
				self.obix_code = myJson.obix_code;
				self.obix_code_b = myJson.obix_code_b;
				self.obix_code_c = myJson.obix_code_c;
				self.request_for_sensors = myJson.request_for_sensors;
				self.consent_a = myJson.consent_a;
				self.consent_b = myJson.consent_b;
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
		const self = this;
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
	
	signupApa(data) {
		const self = this;
		let status = 500; // RESPONSE (OK: 201, MAIL EXISTS: 409, error: 500)
		const url = this.mongoBackend + '/regcodes/anon';
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
			self.notifyAll({model:'UserModel',method:'signupApa',status:status,message:message,data:data});
		})
		.catch(function(error){
			self.notifyAll({model:'UserModel',method:'signupApa',status:status,message:error});
		});
	}
	
	changePassword(data) {
		const self = this;
		const myHeaders = new Headers();
		const authorizationToken = 'Bearer '+this.token;
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
	
	
	updateUserData(id, data, token) {
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
		const myRequest = new Request(this.mongoBackend + '/users/'+id, myPut);
		let status = 500; // RESPONSE (OK: 200, Auth Failed: 401, error: 500)
		
		fetch(myRequest)
			.then(function(response){
				status = response.status;
				return response.json();
			})
			.then(function(myJson){
				if (status === 200) {
					/*const data = [
						{propName:'consent_a', value:   },
						{propName:'consent_b', value:   },
						{propName:'obix_code', value:   },
					];*/
					data.forEach(d => {
						if (d.propName === 'consent_a') {
							self.consent_a = d.value;
							
						} else if (d.propName === 'consent_b') {
							self.consent_b = d.value;
							
						} else if (d.propName === 'obix_code') {
							self.obix_code = d.value;
							
						} else if (d.propName === 'obix_code_b') {
							self.obix_code_b = d.value;
							
						} else if (d.propName === 'obix_code_c') {
							self.obix_code_c = d.value;
						}
					});
					self.store();
				}
				self.notifyAll({model:self.name, method:'updateUserData', status:status, message:myJson.message});
			})
			.catch(function(error){
				self.notifyAll({model:self.name, method:'updateUserData', status:status, message:error});
			});
		
	}
}
