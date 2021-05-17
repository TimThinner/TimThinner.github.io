
import Model from '../common/Model.js';

export default class FingridModel extends Model {
	
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
		this.value = undefined;
		this.values = [];
		this.start_time = undefined;
		this.end_time = undefined;
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
		let url = this.src;
		
		if (url.endsWith('?')) {
			// Round to next full hour.
			let now = moment();
			now.add(30, 'minutes').startOf('hour');
			
			let future = moment(); // 24 + 12 hours 
			future.add(30, 'minutes').startOf('hour').add(36, 'hours');
			
			// https://api.fingrid.fi/v1/variable/248/events/json?
			//
			//start_time=2021-05-14T15%3A00%3A00Z&end_time=2021-05-16T15%3A00%3A00Z
			url += 'start_time=';
			
			let nows = now.toISOString();
			// remove from the end '.000Z' and add 'Z'
			let nowz = nows.substring(0, nows.length-5);
			nowz += 'Z';
			url += nowz;
			
			url += '&end_time=';
			let futures = future.toISOString();
			// remove from the end '.000Z' and add 'Z'
			let futurez = futures.substring(0, futures.length-5);
			futurez += 'Z';
			url += futurez;
			/*
			"fetch url=", "https://api.fingrid.fi/v1/variable/248/events/json?start_time=2021-05-14T13:00:00.000Z&end_time=2021-05-15T13:00:00.000Z" ]
			*/
		}
		
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
				
				if (Array.isArray(myJson)) {
					self.values = myJson;
				} else {
					self.value = myJson.value;
					self.start_time = myJson.start_time;
					self.end_time = myJson.end_time;
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
