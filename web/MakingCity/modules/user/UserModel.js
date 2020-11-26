import Model from '../common/Model.js';
/*
	User has:
		id
		email
		token
		readkey
		price_energy_monthly
		price_energy_basic
		price_energy_transfer
		
		
		
		
		is_superuser
*/
export default class UserModel extends Model {
	
	constructor(options) {
		super(options);
		this.id = undefined;
		this.email = undefined;
		this.token = undefined;
		this.readkey = undefined;
		/*
		this.price_energy_monthly  = 0;
		this.price_energy_basic    = 0;
		this.price_energy_transfer = 0;
		*/
		// Set energy prices to some reasonable level:
		this.price_energy_monthly  = 10;
		this.price_energy_basic    = 4.5;
		this.price_energy_transfer = 4.5;
		
		/*
		this.heating_target_temperature = 0;
		this.heating_temperature_upper  = 0;
		this.heating_temperature_lower  = 0;
		this.heating_target_humidity    = 0;
		this.heating_humidity_upper     = 0;
		this.heating_humidity_lower     = 0;
		*/
		// Set Heating targets and limits to some reasonable level:
		this.heating_temperature_upper  = 24.0;
		this.heating_target_temperature = 22.0;
		this.heating_temperature_lower  = 20.0;
		this.heating_humidity_upper     = 45;
		this.heating_target_humidity    = 40;
		this.heating_humidity_lower     = 35;
		
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
		this.price_energy_monthly  = 0;
		this.price_energy_basic    = 0;
		this.price_energy_transfer = 0;
		this.heating_target_temperature = 0;
		this.heating_temperature_upper  = 0;
		this.heating_temperature_lower  = 0;
		this.heating_target_humidity    = 0;
		this.heating_humidity_upper     = 0;
		this.heating_humidity_lower     = 0;
		this.is_superuser = false;
	}
	
	/* For safety reasons the "is_superuser"-flag is never stored or restored automatically. */
	store() {
		const status = localStorage.getItem(this.localStorageLabel);
		const new_status = {
			'id': this.id,
			'email': this.email,
			'token': this.token,
			'readkey': this.readkey,
			'price_energy_monthly':  this.price_energy_monthly,
			'price_energy_basic':    this.price_energy_basic,
			'price_energy_transfer': this.price_energy_transfer,
			'heating_target_temperature': this.heating_target_temperature,
			'heating_temperature_upper':  this.heating_temperature_upper,
			'heating_temperature_lower':  this.heating_temperature_lower,
			'heating_target_humidity':    this.heating_target_humidity,
			'heating_humidity_upper':     this.heating_humidity_upper,
			'heating_humidity_lower':     this.heating_humidity_lower
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
			
			if (typeof stat.readkey !== 'undefined') { this.readkey = stat.readkey; }
			
			if (typeof stat.price_energy_monthly !== 'undefined')  { this.price_energy_monthly = stat.price_energy_monthly; }
			if (typeof stat.price_energy_basic !== 'undefined')    { this.price_energy_basic = stat.price_energy_basic; }
			if (typeof stat.price_energy_transfer !== 'undefined') { this.price_energy_transfer = stat.price_energy_transfer; }
			
			if (typeof stat.heating_target_temperature !== 'undefined') { this.heating_target_temperature = stat.heating_target_temperature; }
			if (typeof stat.heating_temperature_upper !== 'undefined')  { this.heating_temperature_upper = stat.heating_temperature_upper; }
			if (typeof stat.heating_temperature_lower !== 'undefined')  { this.heating_temperature_lower = stat.heating_temperature_lower; }
			
			if (typeof stat.heating_target_humidity !== 'undefined') { this.heating_target_humidity = stat.heating_target_humidity; }
			if (typeof stat.heating_humidity_upper !== 'undefined')  { this.heating_humidity_upper = stat.heating_humidity_upper; }
			if (typeof stat.heating_humidity_lower !== 'undefined')  { this.heating_humidity_lower = stat.heating_humidity_lower; }
			
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
		if (this.MOCKUP) {
			this.id = 'nodatabaseid';
			this.email = data.email;
			this.token = 'nodatabasetoken';
			this.is_superuser = false;
			// Set energy prices to some reasonable level:
			this.price_energy_monthly  = 10;
			this.price_energy_basic    = 4.5;
			this.price_energy_transfer = 4.5;
			
			// Set Heating targets and limits to some reasonable level:
			this.heating_temperature_upper  = 24.0;
			this.heating_target_temperature = 22.0;
			this.heating_temperature_lower  = 20.0;
			this.heating_humidity_upper     = 45;
			this.heating_target_humidity    = 40;
			this.heating_humidity_lower     = 35;
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
					
					if (typeof myJson.price_energy_monthly !== 'undefined') {
						self.price_energy_monthly = myJson.price_energy_monthly;
					} else {
						self.price_energy_monthly = 0;
					}
					if (typeof myJson.price_energy_basic !== 'undefined') {
						self.price_energy_basic = myJson.price_energy_basic;
					} else {
						self.price_energy_basic = 0;
					}
					if (typeof myJson.price_energy_transfer !== 'undefined') {
						self.price_energy_transfer = myJson.price_energy_transfer;
					} else {
						self.price_energy_transfer = 0;
					}
					
					
					if (typeof myJson.heating_target_temperature !== 'undefined') {
						self.heating_target_temperature = myJson.heating_target_temperature;
					} else {
						self.heating_target_temperature = 0;
					}
					if (typeof myJson.heating_temperature_upper !== 'undefined') {
						self.heating_temperature_upper = myJson.heating_temperature_upper;
					} else {
						self.heating_temperature_upper = 0;
					}
					if (typeof myJson.heating_temperature_lower !== 'undefined') {
						self.heating_temperature_lower = myJson.heating_temperature_lower;
					} else {
						self.heating_temperature_lower = 0;
					}
					
					if (typeof myJson.heating_target_humidity !== 'undefined') {
						self.heating_target_humidity = myJson.heating_target_humidity;
					} else {
						self.heating_target_humidity = 0;
					}
					if (typeof myJson.heating_humidity_upper !== 'undefined') {
						self.heating_humidity_upper = myJson.heating_humidity_upper;
					} else {
						self.heating_humidity_upper = 0;
					}
					if (typeof myJson.heating_humidity_lower !== 'undefined') {
						self.heating_humidity_lower = myJson.heating_humidity_lower;
					} else {
						self.heating_humidity_lower = 0;
					}
					
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
	
	updateEnergyPrices(id, data, authToken, type) {
		const self = this;
		
		if (this.MOCKUP) {
			
			data.forEach(d => {
				if (d.propName === 'price_energy_monthly') {
					self.price_energy_monthly = d.value;
				} else if (d.propName === 'price_energy_basic') {
					self.price_energy_basic = d.value;
				} else if (d.propName === 'price_energy_transfer') {
					self.price_energy_transfer = d.value;
				}
			});
			setTimeout(() => {
				this.notifyAll({model:this.name, method:'updateEnergyPrices', status:200, message:'OK', type:type});
			}, 200);
			
		} else {
			const myHeaders = new Headers();
			const authorizationToken = 'Bearer '+authToken;
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
							{propName:'price_energy_monthly', value:pmi},
							{propName:'price_energy_basic', value:pei},
							{propName:'price_energy_transfer', value:pti}
						];*/
						data.forEach(d => {
							if (d.propName === 'price_energy_monthly') {
								self.price_energy_monthly = d.value;
							} else if (d.propName === 'price_energy_basic') {
								self.price_energy_basic = d.value;
							} else if (d.propName === 'price_energy_transfer') {
								self.price_energy_transfer = d.value;
							}
						});
					}
					self.notifyAll({model:'UserModel', method:'updateEnergyPrices', status:status, message:myJson.message, type:type});
				})
				.catch(function(error){
					self.notifyAll({model:'UserModel', method:'updateEnergyPrices', status:status, message:error, type:type});
				});
		}
	}
	
	updateHeatingTargets(id, data, authToken) {
		const self = this;
		
		if (this.MOCKUP) {
			
			data.forEach(d => {
				if (d.propName === 'heating_target_temperature') {
					self.heating_target_temperature = d.value;
				} else if (d.propName === 'heating_temperature_upper') {
					self.heating_temperature_upper = d.value;
				} else if (d.propName === 'heating_temperature_lower') {
					self.heating_temperature_lower = d.value;
				} else if (d.propName === 'heating_target_humidity') {
					self.heating_target_humidity = d.value;
				} else if (d.propName === 'heating_humidity_upper') {
					self.heating_humidity_upper = d.value;
				} else if (d.propName === 'heating_humidity_lower') {
					self.heating_humidity_lower = d.value;
				}
			});
			setTimeout(() => {
				this.notifyAll({model:this.name, method:'updateHeatingTargets', status:200, message:'OK'});
			}, 200);
			
		} else {
			const myHeaders = new Headers();
			const authorizationToken = 'Bearer '+authToken;
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
							{propName:'heating_target_temperature', value:   },
							{propName:'heating_temperature_upper',  value:   },
							{propName:'heating_temperature_lower',  value:   },
							...
						];*/
						data.forEach(d => {
							if (d.propName === 'heating_target_temperature') {
								self.heating_target_temperature = d.value;
							} else if (d.propName === 'heating_temperature_upper') {
								self.heating_temperature_upper = d.value;
							} else if (d.propName === 'heating_temperature_lower') {
								self.heating_temperature_lower = d.value;
							} else if (d.propName === 'heating_target_humidity') {
								self.heating_target_humidity = d.value;
							} else if (d.propName === 'heating_humidity_upper') {
								self.heating_humidity_upper = d.value;
							} else if (d.propName === 'heating_humidity_lower') {
								self.heating_humidity_lower = d.value;
							}
						});
					}
					self.notifyAll({model:self.name, method:'updateHeatingTargets', status:status, message:myJson.message});
				})
				.catch(function(error){
					self.notifyAll({model:self.name, method:'updateHeatingTargets', status:status, message:error});
				});
		}
	}
}
