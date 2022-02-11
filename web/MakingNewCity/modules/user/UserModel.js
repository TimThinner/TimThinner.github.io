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
		
		// this.DEFAULTS is defined in Configuration.js
		this.price_energy_monthly  = this.DEFAULTS.price_energy_monthly;
		this.price_energy_basic    = this.DEFAULTS.price_energy_basic;
		this.price_energy_transfer = this.DEFAULTS.price_energy_transfer;
		
		this.point_id_a = '';
		this.point_id_b = '';
		this.point_id_c = '';
		
		// Set Heating targets and limits to some reasonable level:
		this.heating_temperature_upper  = this.DEFAULTS.heating_temperature_upper;
		this.heating_target_temperature = this.DEFAULTS.heating_target_temperature;
		this.heating_temperature_lower  = this.DEFAULTS.heating_temperature_lower;
		this.heating_humidity_upper     = this.DEFAULTS.heating_humidity_upper;
		this.heating_target_humidity    = this.DEFAULTS.heating_target_humidity;
		this.heating_humidity_lower     = this.DEFAULTS.heating_humidity_lower;
		
		/* Water targets and limits per 24h */
		this.water_hot_upper   = this.DEFAULTS.water_hot_upper;
		this.water_hot_target  = this.DEFAULTS.water_hot_target;
		this.water_hot_lower   = this.DEFAULTS.water_hot_lower;
		this.water_cold_upper  = this.DEFAULTS.water_cold_upper;
		this.water_cold_target = this.DEFAULTS.water_cold_target;
		this.water_cold_lower  = this.DEFAULTS.water_cold_lower;
		
		/* Electricity targets and limits per 24h */
		this.energy_upper   = this.DEFAULTS.energy_upper;
		this.energy_target  = this.DEFAULTS.energy_target;
		this.energy_lower   = this.DEFAULTS.energy_lower;
		
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
		
		// this.DEFAULTS is defined in Configuration.js
		this.price_energy_monthly  = this.DEFAULTS.price_energy_monthly;
		this.price_energy_basic    = this.DEFAULTS.price_energy_basic;
		this.price_energy_transfer = this.DEFAULTS.price_energy_transfer;
		
		this.point_id_a = '';
		this.point_id_b = '';
		this.point_id_c = '';
		
		// Set Heating targets and limits to some reasonable level:
		this.heating_temperature_upper  = this.DEFAULTS.heating_temperature_upper;
		this.heating_target_temperature = this.DEFAULTS.heating_target_temperature;
		this.heating_temperature_lower  = this.DEFAULTS.heating_temperature_lower;
		this.heating_humidity_upper     = this.DEFAULTS.heating_humidity_upper;
		this.heating_target_humidity    = this.DEFAULTS.heating_target_humidity;
		this.heating_humidity_lower     = this.DEFAULTS.heating_humidity_lower;
		
		/* Water targets and limits per 24h */
		this.water_hot_upper   = this.DEFAULTS.water_hot_upper;
		this.water_hot_target  = this.DEFAULTS.water_hot_target;
		this.water_hot_lower   = this.DEFAULTS.water_hot_lower;
		this.water_cold_upper  = this.DEFAULTS.water_cold_upper;
		this.water_cold_target = this.DEFAULTS.water_cold_target;
		this.water_cold_lower  = this.DEFAULTS.water_cold_lower;
		
		/* Electricity targets and limits per 24h */
		this.energy_upper   = this.DEFAULTS.energy_upper;
		this.energy_target  = this.DEFAULTS.energy_target;
		this.energy_lower   = this.DEFAULTS.energy_lower;
		
		this.is_superuser = false;
	}
	
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
			'point_id_a':  this.point_id_a,
			'point_id_b':  this.point_id_b,
			'point_id_c':  this.point_id_c,
			'heating_target_temperature': this.heating_target_temperature,
			'heating_temperature_upper':  this.heating_temperature_upper,
			'heating_temperature_lower':  this.heating_temperature_lower,
			'heating_target_humidity':    this.heating_target_humidity,
			'heating_humidity_upper':     this.heating_humidity_upper,
			'heating_humidity_lower':     this.heating_humidity_lower,
			'water_hot_upper':   this.water_hot_upper,
			'water_hot_target':  this.water_hot_target,
			'water_hot_lower':   this.water_hot_lower,
			'water_cold_upper':  this.water_cold_upper,
			'water_cold_target': this.water_cold_target,
			'water_cold_lower':  this.water_cold_lower,
			'energy_upper':  this.energy_upper,
			'energy_target': this.energy_target,
			'energy_lower':  this.energy_lower
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
			
			if (typeof stat.point_id_a !== 'undefined') { this.point_id_a = stat.point_id_a; }
			if (typeof stat.point_id_b !== 'undefined') { this.point_id_b = stat.point_id_b; }
			if (typeof stat.point_id_c !== 'undefined') { this.point_id_c = stat.point_id_c; }
			
			if (typeof stat.heating_target_temperature !== 'undefined') { this.heating_target_temperature = stat.heating_target_temperature; }
			if (typeof stat.heating_temperature_upper !== 'undefined')  { this.heating_temperature_upper = stat.heating_temperature_upper; }
			if (typeof stat.heating_temperature_lower !== 'undefined')  { this.heating_temperature_lower = stat.heating_temperature_lower; }
			if (typeof stat.heating_target_humidity !== 'undefined') { this.heating_target_humidity = stat.heating_target_humidity; }
			if (typeof stat.heating_humidity_upper !== 'undefined')  { this.heating_humidity_upper = stat.heating_humidity_upper; }
			if (typeof stat.heating_humidity_lower !== 'undefined')  { this.heating_humidity_lower = stat.heating_humidity_lower; }
			
			if (typeof stat.water_hot_upper !== 'undefined') { this.water_hot_upper = stat.water_hot_upper; }
			if (typeof stat.water_hot_target !== 'undefined') { this.water_hot_target = stat.water_hot_target; }
			if (typeof stat.water_hot_lower !== 'undefined') { this.water_hot_lower = stat.water_hot_lower; }
			if (typeof stat.water_cold_upper !== 'undefined') { this.water_cold_upper = stat.water_cold_upper; }
			if (typeof stat.water_cold_target !== 'undefined') { this.water_cold_target = stat.water_cold_target; }
			if (typeof stat.water_cold_lower !== 'undefined') { this.water_cold_lower = stat.water_cold_lower; }
			
			if (typeof stat.energy_upper !== 'undefined') { this.energy_upper = stat.energy_upper; }
			if (typeof stat.energy_target !== 'undefined') { this.energy_target = stat.energy_target; }
			if (typeof stat.energy_lower !== 'undefined') { this.energy_lower = stat.energy_lower; }
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
		}).then(function(response) {
			status = response.status;
			return response.json();
		}).then(function(myJson) {
			const message = myJson.message;
			if (status === 200 && myJson.token) {
				// Login was OK, set the Authentication-token to model.
				self.token = myJson.token;
				self.id = myJson.userId.toString();
				self.email = data.email;
				self.is_superuser = myJson.is_superuser;
				self.readkey = myJson.readkey;
				
				// this.DEFAULTS is defined in Configuration.js
				self.price_energy_monthly  = self.DEFAULTS.price_energy_monthly;
				self.price_energy_basic    = self.DEFAULTS.price_energy_basic;
				self.price_energy_transfer = self.DEFAULTS.price_energy_transfer;
				
				// Set Heating targets and limits to some reasonable level:
				self.heating_temperature_upper  = self.DEFAULTS.heating_temperature_upper;
				self.heating_target_temperature = self.DEFAULTS.heating_target_temperature;
				self.heating_temperature_lower  = self.DEFAULTS.heating_temperature_lower;
				self.heating_humidity_upper     = self.DEFAULTS.heating_humidity_upper;
				self.heating_target_humidity    = self.DEFAULTS.heating_target_humidity;
				self.heating_humidity_lower     = self.DEFAULTS.heating_humidity_lower;
				
				/* Water targets and limits per 24h */
				self.water_hot_upper   = self.DEFAULTS.water_hot_upper;
				self.water_hot_target  = self.DEFAULTS.water_hot_target;
				self.water_hot_lower   = self.DEFAULTS.water_hot_lower;
				self.water_cold_upper  = self.DEFAULTS.water_cold_upper;
				self.water_cold_target = self.DEFAULTS.water_cold_target;
				self.water_cold_lower  = self.DEFAULTS.water_cold_lower;
				
				self.energy_upper   = self.DEFAULTS.energy_upper;
				self.energy_target  = self.DEFAULTS.energy_target;
				self.energy_lower   = self.DEFAULTS.energy_lower;
				
				if (typeof myJson.price_energy_monthly !== 'undefined') { self.price_energy_monthly = myJson.price_energy_monthly; }
				if (typeof myJson.price_energy_basic !== 'undefined') { self.price_energy_basic = myJson.price_energy_basic; }
				if (typeof myJson.price_energy_transfer !== 'undefined') { self.price_energy_transfer = myJson.price_energy_transfer; }
				
				if (typeof myJson.point_id_a !== 'undefined') { self.point_id_a = myJson.point_id_a; }
				if (typeof myJson.point_id_b !== 'undefined') { self.point_id_b = myJson.point_id_b; }
				if (typeof myJson.point_id_c !== 'undefined') { self.point_id_c = myJson.point_id_c; }
				
				if (typeof myJson.heating_temperature_upper !== 'undefined') { self.heating_temperature_upper = myJson.heating_temperature_upper; }
				if (typeof myJson.heating_target_temperature !== 'undefined') { self.heating_target_temperature = myJson.heating_target_temperature; }
				if (typeof myJson.heating_temperature_lower !== 'undefined') { self.heating_temperature_lower = myJson.heating_temperature_lower; }
				
				if (typeof myJson.heating_humidity_upper !== 'undefined') { self.heating_humidity_upper = myJson.heating_humidity_upper; }
				if (typeof myJson.heating_target_humidity !== 'undefined') { self.heating_target_humidity = myJson.heating_target_humidity; }
				if (typeof myJson.heating_humidity_lower !== 'undefined') { self.heating_humidity_lower = myJson.heating_humidity_lower; }
				
				if (typeof myJson.water_hot_upper !== 'undefined') { self.water_hot_upper = myJson.water_hot_upper; }
 				if (typeof myJson.water_hot_target !== 'undefined') { self.water_hot_target = myJson.water_hot_target; }
 				if (typeof myJson.water_hot_lower !== 'undefined') { self.water_hot_lower = myJson.water_hot_lower; }
				if (typeof myJson.water_cold_upper !== 'undefined') { self.water_cold_upper = myJson.water_cold_upper; }
				if (typeof myJson.water_cold_target !== 'undefined') { self.water_cold_target = myJson.water_cold_target; }
				if (typeof myJson.water_cold_lower !== 'undefined') { self.water_cold_lower = myJson.water_cold_lower; }
				
				
				if (typeof myJson.energy_upper !== 'undefined') { self.energy_upper = myJson.energy_upper; }
				if (typeof myJson.energy_target !== 'undefined') { self.energy_target = myJson.energy_target; }
				if (typeof myJson.energy_lower !== 'undefined') { self.energy_lower = myJson.energy_lower; }
				
				// Store token and email temporarily into localStorage.
				// It will be removed when the user logs-out.
				self.store();
			}
			self.notifyAll({model:'UserModel',method:'login',status:status,message:message});
			
		}).catch(function(error) {
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
		}).then(function(response){
			status = response.status;
			return response.json();
		}).then(function(myJson){
			const message = myJson.message;
			self.notifyAll({model:'UserModel',method:'signup',status:status,message:message});
		}).catch(function(error){
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
		}).then(function(myJson){
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
		}).catch(function(error){
			self.notifyAll({model:'UserModel', method:'updateEnergyPrices', status:status, message:error, type:type});
		});
	}
	
	updateHeatingTargets(id, data, authToken) {
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
		const myRequest = new Request(this.mongoBackend + '/users/'+id, myPut);
		let status = 500; // RESPONSE (OK: 200, Auth Failed: 401, error: 500)
		
		fetch(myRequest)
		.then(function(response){
			status = response.status;
			return response.json();
		}).then(function(myJson){
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
		}).catch(function(error){
			self.notifyAll({model:self.name, method:'updateHeatingTargets', status:status, message:error});
		});
	}
	
	updateWaterTargets(id, data, authToken) {
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
		const myRequest = new Request(this.mongoBackend + '/users/'+id, myPut);
		let status = 500; // RESPONSE (OK: 200, Auth Failed: 401, error: 500)
	
		fetch(myRequest)
		.then(function(response){
			status = response.status;
			return response.json();
		}).then(function(myJson){
			if (status === 200) {
				data.forEach(d => {
					if (d.propName === 'water_hot_upper') {
						self.water_hot_upper = d.value;
					} else if (d.propName === 'water_hot_target') {
						self.water_hot_target = d.value;
					} else if (d.propName === 'water_hot_lower') {
						self.water_hot_lower = d.value;
					} else if (d.propName === 'water_cold_upper') {
						self.water_cold_upper = d.value;
					} else if (d.propName === 'water_cold_target') {
						self.water_cold_target = d.value;
					} else if (d.propName === 'water_cold_lower') {
						self.water_cold_lower = d.value;
					}
				});
			}
			self.notifyAll({model:self.name, method:'updateWaterTargets', status:status, message:myJson.message});
		}).catch(function(error){
			self.notifyAll({model:self.name, method:'updateWaterTargets', status:status, message:error});
		});
	}
	
	updateEnergyTargets(id, data, authToken) {
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
		const myRequest = new Request(this.mongoBackend + '/users/'+id, myPut);
		let status = 500; // RESPONSE (OK: 200, Auth Failed: 401, error: 500)
	
		fetch(myRequest)
		.then(function(response){
			status = response.status;
			return response.json();
		}).then(function(myJson){
			if (status === 200) {
				data.forEach(d => {
					if (d.propName === 'energy_upper') {
						self.energy_upper = d.value;
					} else if (d.propName === 'energy_target') {
						self.energy_target = d.value;
					} else if (d.propName === 'energy_lower') {
						self.energy_lower = d.value;
					}
				});
			}
			self.notifyAll({model:self.name, method:'updateEnergyTargets', status:status, message:myJson.message});
		}).catch(function(error){
			self.notifyAll({model:self.name, method:'updateEnergyTargets', status:status, message:error});
		});
	}
}
