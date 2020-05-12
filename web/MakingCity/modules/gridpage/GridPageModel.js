import Model from '../common/Model.js';
/*

https://makingcity.vtt.fi/data/arina/iss/feeds.json?meterId=114&start=2020-02-12&end=2020-02-12


[{"created_at":"2020-02-10T00:01:06","meterId":114,"averagePower":28.8,"totalEnergy":451145,"energyDiff":0.6},
{"created_at":"2020-02-10T00:02:18","meterId":114,"averagePower":35,"totalEnergy":451145.7,"energyDiff":0.7},
{"created_at":"2020-02-10T00:03:34","meterId":114,"averagePower":28.421,"totalEnergy":451146.3,"energyDiff":0.6},

...

{"created_at":"2020-02-10T14:02:00","meterId":114,"averagePower":83.836,"totalEnergy":451889.4,"energyDiff":1.7},
{"created_at":"2020-02-10T14:03:19","meterId":114,"averagePower":82.025,"totalEnergy":451891.2,"energyDiff":1.8},
{"created_at":"2020-02-10T14:04:33","meterId":114,"averagePower":48.649,"totalEnergy":451892.2,"energyDiff":1},
{"created_at":"2020-02-10T14:05:51","meterId":114,"averagePower":50.769,"totalEnergy":451893.3,"energyDiff":1.1}
]
*/
export default class GridPageModel extends Model {
	constructor(options) {
		super(options);
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
		const url = this.backend + '/' + this.src + '&start='+start_date+'&end='+end_date;
		
		console.log (['GridPageModel fetch url=',url]);
		status = 200; // OK
		setTimeout(() => {
			
			this.fetching = false;
			this.ready = true;
			this.notifyAll({model:this.name, method:'fetched', status:status, message:'OK'});
			
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
