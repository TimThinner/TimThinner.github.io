
import Model from '../common/Model.js';

export default class FingridPowerSystemStateModel extends Model {
	
	constructor(options) {
		super(options);
		this.value = 1;//undefined;
	}
	/*
	API-key must be inserted to the http-request header x-api-key, not into the URL-address. 
	If you are importing data from the API into an application, it is usually possible to insert the API-key by modifying the 
	request header parameters in your application: further instructions for doing this are usually available in the 
	documentation of your chosen software.
	Service has throttling that is based on API-keys: you can make 10 000 requests in 24h period with one API-key. 
	
	once per 3 minutes => 20 x 24 = 480 requests only for FingridPowerSystemStateModel.
	
	*/
	fetch() {
		const self = this;
		let status = 500; // error: 500
		this.errorMessage = '';
		this.fetching = true;
		
		
		/*
		{
			"value": 1,
			"start_time": "2021-05-11T11:10:00+0000",
			"end_time": "2021-05-11T11:10:00+0000"
		
		1 = green
		2 = yellow
		3 = red
		4 = black
		5 = blue
		*/
		status = 200;
		setTimeout(()=>{
			console.log('FETCH FINGRID!');
			self.notifyAll({model:self.name, method:'fetched', status:status, message:'OK'});
		},1000);
		
		/*
		const url = 'https://api.fingrid.fi/v1/variable/209/event/json';
		console.log (['fetch url=',url]);
		const API_KEY = "nHXHn1v1f157sG4VYAuy92ZypWGtNYf37KSCxl7B";
		
		const myHeaders = new Headers();
		myHeaders.append("Accept", "application/json");
		myHeaders.append("x-api-key", API_KEY);
		
		fetch(url, {headers: myHeaders})
			.then(function(response) {
				status = response.status;
				return response.json();
			})
			.then(function(myJson) {
				console.log(['myJson=',myJson]);
				self.value = myJson.value;
				
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



