import EventObserver from '../common/EventObserver.js';


export default class HexModel extends EventObserver {
	
	constructor(options) {
		super();
		this.name = options.name;
		this.src = options.src;
		this.ready = false;
		this.errorMessage = '';
		this.fetching = false;
		
		this.selectedLegend = undefined;
		this.features = undefined;
		
	}
	
	reset() {
		
	}
	
	selectLegend(d) {
		this.selectedLegend = d;
		setTimeout(() => {
			this.notifyAll({model:this.name, method:'legend-selected'});
		},200);
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
		
		console.log (['HexModel fetch url=',url]);
		status = 200; // OK
		//status = 401;
		//this.errorMessage = 'Auth failed';
		/*setTimeout(() => {
			
			this.fetching = false;
			this.ready = true;
			
			this.notifyAll({model:this.name, method:'fetched', status:status, message:this.errorMessage});
			
		}, 200);*/
		Promise.all([
			d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
			d3.json('https://unpkg.com/world-atlas@1.1.4/world/50m.json')
		]).then(([tsvData, topoJSONData])=>{
			//console.log(tsvData);
			//console.log(topoJSONData);
			const rowById = {};
			tsvData.forEach(d=> {
				// Use d.name for the title
				// Use d.iso_n3 for id
				rowById[d.iso_n3] = d;
			});
			const countries = topojson.feature(topoJSONData, topoJSONData.objects.countries);
			countries.features.forEach(d => {
				Object.assign(d.properties, rowById[d.id]);
			});
			this.features = countries.features;
			
			this.fetching = false;
			this.ready = true;
			
			this.notifyAll({model:this.name, method:'fetched', status:status, message:this.errorMessage});
		});
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

