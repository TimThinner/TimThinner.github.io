import Model from '../common/Model.js';
/*
*/
export class Status {
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
}

export default class StatusModel extends Model {
	constructor(options) {
		super(options); // name and src
		this.values = [];
	}
	
	fetch() {
		const self = this;
		if (this.fetching) {
			console.log('STATUS FETCHING ALREADY IN PROCESS!');
			return;
		}
		
		//const debug_time_start = moment().valueOf();
		//console.log(['debug_time_start=',debug_time_start]);
		
		const today = moment().format('YYYY-MM-DD');
		//console.log(['today=',today]);
		
		let status = 500; // error: 500
		this.errorMessage = '';
		this.fetching = true;
		
		const url = this.backend + '/' + this.src;
		console.log (['fetch url=',url]);
		fetch(url)
			.then(function(response) {
				status = response.status;
				return response.json();
			})
			.then(function(myJson) {
				self.values = []; // Start with fresh array.
				//console.log(['Status myJson=',myJson]);
				
				$.each(myJson, function(i,v){
					const p = new Status(v);
					self.values.push(p);
				});
				//console.log(['self.values=',self.values]);
				
				//const debug_time_elapse = moment().valueOf()-debug_time_start;
				//console.log([self.name,' fetch debug_time_elapse=',debug_time_elapse]);
				
				self.fetching = false;
				self.ready = true;
				self.notifyAll({model:self.name,method:'fetched',status:status,message:'OK'});
			})
			.catch(error => {
				self.fetching = false;
				self.ready = true;
				self.errorMessage = error;
				self.notifyAll({model:self.name, method:'fetched', status:status, message:error});
			});
	}
}
