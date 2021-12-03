import Model from '../common/Model.js';
/*
*/
/*export class Status {
	constructor(obj) {
		this.time = new Date(obj.dateTime); // "2020-02-05 08:12:19"
		this.meterId = obj.meterId; // Number
		this.meterName = obj.meterName; // String
		this.meterType = obj.meterType; // Number
		this.energy = obj.energy; // Float
		this.avPower = obj.avPower; // Float
		this.timeDiff = obj.timeDiff; // Number
		this.energyDiff = obj.energyDiff; // Float
	}
}*/

export default class SivakkaStatusModel extends Model {
	constructor(options) {
		super(options); // name and src
		 /*
			Model has:
				this.name = options.name;
				this.src = options.src;
				this.ready = false;
				this.errorMessage = '';
				this.status = 500;
				this.fetching = false;
		*/
		this.values = [];
	}
	
	fetch() {
		const self = this;
		let status = 500; // error: 500
		this.errorMessage = '';
		
		if (this.fetching) {
			console.log(this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		/*status = 200;
		setTimeout(()=>{
			console.log('FETCH FINGRID!');
			self.notifyAll({model:self.name, method:'fetched', status:status, message:'OK'});
		},1000);*/
		this.fetching = true;
		
		const url = this.mongoBackend + '/proxes/sivakkastatus';
		const body_url = this.backend + '/' + this.src;
		
		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		const data = {
			url: body_url,
			expiration_in_seconds: 60
		};
		const myPost = {
			method: 'POST',
			headers: myHeaders,
			body: JSON.stringify(data)
		};
		const myRequest = new Request(url, myPost);
		
		fetch(myRequest)
		//fetch(url, {headers: myHeaders})
			.then(function(response) {
				status = response.status;
				return response.json();
			})
			.then(function(myJson) {
				const resu = JSON.parse(myJson);
				
				console.log(['resu=',resu]);
				
				/*
				if (Array.isArray(resu)) {
					self.values = resu;
					console.log(['self.values=',self.values]);
				} else {
					self.value = resu.value;
					self.start_time = resu.start_time;
					self.end_time = resu.end_time;
					console.log(['self.value=',self.value,'self.start_time=',self.start_time,'self.end_time=',self.end_time]);
				}
				*/
				
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
