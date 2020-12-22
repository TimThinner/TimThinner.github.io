import Model from '../common/Model.js';
/*
*/
export default class StatusJetitekModel extends Model {
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
		
		let status = 500; // error: 500
		this.errorMessage = '';
		this.fetching = true;
		
		// https://makingcity.vtt.fi/data/arina/jetitek/feeds.json?pointId=983&start=2020-12-22&end=2020-12-22&limit=1
		// https://makingcity.vtt.fi/data/arina/jetitek/feeds.json?pointId=1012&start=2020-12-22&end=2020-12-22&limit=1
		const start_date = moment().format('YYYY-MM-DD');
		const end_date = moment().format('YYYY-MM-DD');
		
		// append start and end date
		const url = this.backend + '/' + this.src + '&start='+start_date+'&end='+end_date+'&limit=1';
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
					self.values.push(v);
				});
				//console.log(['self.values=',self.values]);
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
