import Model from '../common/Model.js';
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
	
	
	NOTE: We DO NOT store alarms to database now!
	We are using this module always as a MOCKUP module.
	The system slows down too much if database is filled with alarms!
	
*/
export default class UserAlarmModel extends Model {
	constructor(options) {
		super(options);
		this.alarms = [];
		this.selected = undefined;
	}
	
	clear(prefix) {
		/*
		let new_alarms = [];
		this.alarms.forEach(a=>{
			if (a.alarmType.indexOf(prefix)===-1) {
				new_alarms.push(a);
			}
		});
		*/
		this.alarms = this.alarms.filter(a => a.alarmType.indexOf(prefix)===-1);
		//const result = this.alarms.filter(a => a.alarmType.indexOf(prefix)===-1);
		//this.alarms = result;
	}
	
	fetch(token) {
		const self = this;
		if (this.fetching) {
			console.log(this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		
		//if (this.MOCKUP) {
			this.errorMessage = '';
			this.fetching = true;
			setTimeout(() => {
				//this.alarms = [];
				/*
				alarmTimestamp: "2021-01-25T23:00"
​​​​				alarmType: "HeatingHumidityUpperLimit"
​​​​				refToUser: "nodatabaseid"
				severity: 3
				*/
				console.log(['FETCHING OLD ALARMS this.alarms=',this.alarms]);
				this.fetching = false;
				this.ready = true;
				this.notifyAll({model:this.name, method:'fetched', status:200, message:'OK'});
			}, 200);
		/*
		} else {
			this.errorMessage = '';
			this.fetching = true;
			
			let status = 500; // (OK: 200, AUTH FAILED: 401, error: 500)
			const myHeaders = new Headers();
			const authorizationToken = 'Bearer '+token;
			myHeaders.append("Authorization", authorizationToken);
			
			const url = this.mongoBackend + '/alarms';
			fetch(url, {headers: myHeaders})
				.then(function(response) {
					status = response.status;
					return response.json();
				})
				.then(function(myJson) {
					console.log(['myJson=',myJson]);
					self.alarms = myJson.alarms;
					console.log(['self.alarms=',self.alarms]);
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
		}*/
	}
	/*
		"HeatingTemperatureUpperLimit"
		"HeatingTemperatureLowerLimit"
		"HeatingHumidityUpperLimit"
		"HeatingHumidityLowerLimit"
		
		"EnergyUpperLimit"
		"EnergyLowerLimit"
		
		"WaterHotUpperLimit"
		"WaterHotLowerLimit"
		"WaterColdUpperLimit"
		"WaterColdLowerLimit"
		
		const data = {
			refToUser: UM.id,
			alarmType: 'HeatingTemperatureUpperLimit',
			alarmTimestamp: '2020-12-12T12:00',
			severity: 3
		};
		self.models['UserAlarmModel'].addOne(data, authToken);
	*/
	addOne(data, token) {
		const self = this;
		
		//if (this.MOCKUP) {
			
			// Check that this alarm is not already in array!
			let found = false;
			for (let a of this.alarms) {
				if (a.refToUser === data.refToUser && 
					a.alarmType === data.alarmType && 
					a.alarmTimestamp === data.alarmTimestamp) {
					found = true;
					break;
				}
			}
			if (found) {
				console.log("HEY, ALARM IS ALREADY IN HERE!!!!!!!");
			} else {
				this.alarms.push(data); // For testing!
				setTimeout(() => {
					this.notifyAll({model:this.name, method:'addOne', status:201, message:'OK'});
				}, 200);
			}
		/*
		} else {
			const myHeaders = new Headers();
			const authorizationToken = 'Bearer '+token;
			myHeaders.append("Authorization", authorizationToken);
			myHeaders.append("Content-Type", "application/json");
			
			const myPost = {
				method: 'POST',
				headers: myHeaders,
				body: JSON.stringify(data)
			};
			const myRequest = new Request(this.mongoBackend + '/alarms', myPost);
			let status = 500; // RESPONSE (OK: 201, Auth Failed: 401, error: 500)
			
			fetch(myRequest)
				.then(function(response){
					status = response.status;
					return response.json();
				})
				.then(function(myJson){
					self.notifyAll({model:self.name, method:'addOne', status:status, message:myJson.message});
				})
				.catch(function(error){
					self.notifyAll({model:self.name, method:'addOne', status:status, message:error});
				});
		}*/
	}
	
	updateOne(id, data, token) {
		const self = this;
		
		//if (this.MOCKUP) {
			setTimeout(() => {
				this.notifyAll({model:this.name, method:'updateOne', status:200, message:'OK'});
			}, 200);
		/*
		} else {
			
			const myHeaders = new Headers();
			const authorizationToken = 'Bearer '+token;
			myHeaders.append("Authorization", authorizationToken);
			myHeaders.append("Content-Type", "application/json");
			
			const myPut = {
				method: 'PUT',
				headers: myHeaders,
				body: JSON.stringify(data)
			};
			const myRequest = new Request(this.mongoBackend + '/alarms/'+id, myPut);
			let status = 500; // RESPONSE (OK: 200, Auth Failed: 401, error: 500)
			
			fetch(myRequest)
				.then(function(response){
					status = response.status;
					return response.json();
				})
				.then(function(myJson){
					self.notifyAll({model:self.name, method:'updateOne', status:status, message:myJson.message});
				})
				.catch(function(error){
					self.notifyAll({model:self.name, method:'updateOne', status:status, message:error});
				});
		}*/
	}
	
	deleteOne(id, authToken) {
		const self = this;
		
		//if (this.MOCKUP) {
			setTimeout(() => {
				this.notifyAll({model:this.name, method:'deleteOne', status:200, message:'Alarm deleted'});
			}, 200);
		/*
		} else {
			// remove one alarm from the database.
			const myHeaders = new Headers();
			const authorizationToken = 'Bearer '+token;
			myHeaders.append("Authorization", authorizationToken);
			myHeaders.append("Content-Type", "application/json");
			
			const myRemove = {
				method: 'DELETE',
				headers: myHeaders
			};
			
			const myRequest = new Request(this.mongoBackend + '/alarms/'+id, myRemove);
			let status = 500; // RESPONSE (OK: 200, Auth Failed: 401, Alarm NOT found 404, error: 500)
			
			fetch(myRequest)
				.then(function(response){
					status = response.status;
					return response.json();
				})
				.then(function(myJson){
					self.notifyAll({model:self.name, method:'deleteOne', status:status, message:myJson.message, id:id});
				})
				.catch(function(error){
					self.notifyAll({model:self.name, method:'deleteOne', status:status, message:error, id:id});
				});
		}*/
	}
}
