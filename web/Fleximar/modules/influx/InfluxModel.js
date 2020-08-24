import EventObserver from '../common/EventObserver.js';

export default class InfluxModel extends EventObserver {
	
	constructor(options) {
		super();
		this.name = options.name;
		this.src = options.src;
		this.ready = false;
		this.errorMessage = '';
		this.fetching = false;
	}
	
	reset() {
		
	}
	
	/* Model:
		this.name = options.name;
		this.src = options.src;
		this.ready = false;
		this.errorMessage = '';
		this.fetching = false;
	*/
	
	fetch(token) {
		const self = this;
		if (this.fetching) {
			console.log('MODEL '+this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		//const debug_time_start = moment().valueOf();
		let status = 500; // error: 500
		this.errorMessage = '';
		this.fetching = true;
		
		let start_date = moment().format('YYYY-MM-DD');
		let end_date = moment().format('YYYY-MM-DD');
		
		//if (this.timerange > 1) {
		//	const diffe = this.timerange-1;
		//	start_date = moment().subtract(diffe, 'days').format('YYYY-MM-DD');
		//}
		// append start and end date
		const url = /*this.backend + '/' + */ this.src + '&start='+start_date+'&end='+end_date;
		
		console.log (['InfluxModel fetch url=',url]);
		status = 200; // OK
		//status = 401;
		//this.errorMessage = 'Auth failed';
		setTimeout(() => {
			
			this.fetching = false;
			this.ready = true;
			this.notifyAll({model:this.name, method:'fetched', status:status, message:this.errorMessage});
			
		}, 200);
		
		/*
		fetch(url)
			.then(function(response) {
				status = response.status;
				return response.json();
			})
			.then(function(myJson) {
				self.values = []; // Start with fresh empty data.
				self.energyValues = [];
				
				self.process(myJson);
				
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
		*/
	}
}

