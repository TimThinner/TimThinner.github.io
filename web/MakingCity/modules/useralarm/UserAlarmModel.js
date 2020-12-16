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
*/
export default class UserAlarmModel extends Model {
	constructor(options) {
		super(options);
		this.alarms = [];
	}
	
	fetch(token) {
		const self = this;
		if (this.fetching) {
			console.log(this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		if (this.MOCKUP) {
			this.errorMessage = '';
			this.fetching = true;
			
			setTimeout(() => {
				this.alarms = [];
				this.fetching = false;
				this.ready = true;
				this.notifyAll({model:this.name, method:'fetched', status:200, message:'OK'});
			}, 200);
			
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
		}
	}
	
	addOne(data, token) {
		const self = this;
		
		if (this.MOCKUP) {
			setTimeout(() => {
				this.notifyAll({model:this.name, method:'addOne', status:201, message:'OK'});
			}, 200);
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
		}
	}
	
	updateOne(id, data, token) {
		const self = this;
		
		if (this.MOCKUP) {
			setTimeout(() => {
				this.notifyAll({model:this.name, method:'updateOne', status:200, message:'OK'});
			}, 200);
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
		}
	}
	
	deleteOne(id, authToken) {
		const self = this;
		
		if (this.MOCKUP) {
			setTimeout(() => {
				this.notifyAll({model:this.name, method:'deleteOne', status:200, message:'Alarm deleted'});
			}, 200);
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
		}
	}
}
