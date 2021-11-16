import Model from '../common/Model.js';
/*


NOTE:
New REST-API interface:

https://app.swaggerhub.com/apis/jean-nicolas.louis/emission-and_power_grid_status/1.0.0

The one that we need to retrieve is:
http://128.214.253.150/api/v1/resources/emissions/latest?country=Finland&EmDB=EcoInvent 


http://128.214.253.150/api/v1/resources/emissions/findByDate?startdate="2021-11-11 00:00:00"&enddate="2021-11-12 00:00:00"&country=Finland&EmDB=EcoInvent


This link should work for the last 24 hours.

http://128.214.253.150/api/v1/resources/emissions/findByDate?startdate=2021-11-15%2015%3A00%3A00&enddate=2021-11-16%2015%3A00%3A00&EmDB=EcoInvent&country=FI

The special characters have to be encoded in hex format to be passed correctly in Apache.


RESPONSE EXAMPLE:

{ "results": [ { "country": "FI", "date_time": "2021-11-16 10:31:06", "em_cons": 160.305, "em_prod": 148.0854, "emdb": "EcoInvent", "id": 159293 } ] }

*/
export default class EcoInventModel extends Model {
	
	constructor(options) {
		super(options);
		 /*
			Model has:
				this.name = options.name;
				this.src = options.src;
				this.ready = false;
				this.errorMessage = '';
				this.status = 500;
				this.fetching = false;
		*/
		//this.value = undefined;
		this.results = [];
		//this.start_time = undefined;
		//this.end_time = undefined;
	}
	
	fetch() {
		const self = this;
		
		if (this.fetching) {
			console.log(this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		
		let status = 500; // error: 500
		this.errorMessage = '';
		this.fetching = true;
		
		const body_url = 'latest?country=Finland&EmDB=EcoInvent';
		
		const url = this.mongoBackend + '/proxes/ecoinvent';
		
		console.log(['fetch url=',url]);
		
		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		const data = {
			url: body_url,
			expiration_in_seconds: 180
		};
		const myPost = {
			method: 'POST',
			headers: myHeaders,
			body: JSON.stringify(data)
		};
		const myRequest = new Request(url, myPost);
		fetch(myRequest)
			.then(function(response) {
				status = response.status;
				return response.json();
			})
			.then(function(myJson) {
				self.results = []; // Start with fresh empty data.
				//console.log(['myJson=',myJson]);
				const resu = JSON.parse(myJson);
				//console.log(['resu=',resu]);
				if (typeof resu !== 'undefined' && typeof resu.results !== 'undefined') {
					self.results = resu.results;
				}
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
