
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
	fetch(token) {
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
		
		const url = this.mongoBackend + '/proxes/fingrid';
		let body_url = this.src;
		
		if (body_url.endsWith('?')) {
			// Round to next full hour.
			let now = moment();
			now.add(30, 'minutes').startOf('hour');
			
			let future = moment(); // 24 + 12 hours 
			future.add(30, 'minutes').startOf('hour').add(36, 'hours');
			
			// https://api.fingrid.fi/v1/variable/248/events/json?
			//
			//start_time=2021-05-14T15%3A00%3A00Z&end_time=2021-05-16T15%3A00%3A00Z
			body_url += 'start_time=';
			
			let nows = now.toISOString();
			// remove from the end '.000Z' and add 'Z'
			let nowz = nows.substring(0, nows.length-5);
			nowz += 'Z';
			body_url += nowz;
			
			body_url += '&end_time=';
			let futures = future.toISOString();
			// remove from the end '.000Z' and add 'Z'
			let futurez = futures.substring(0, futures.length-5);
			futurez += 'Z';
			body_url += futurez;
			/*
			"fetch body_url=", "https://api.fingrid.fi/v1/variable/248/events/json?start_time=2021-05-14T13:00:00.000Z&end_time=2021-05-15T13:00:00.000Z" ]
			*/
		}
		
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
		//fetch(url, {headers: myHeaders})
			.then(function(response) {
				status = response.status;
				return response.json();
			})
			.then(function(myJson) {
				const resu = JSON.parse(myJson);
				if (Array.isArray(resu)) {
					self.values = resu;
				} else {
					self.value = resu.value;
					self.start_time = resu.start_time;
					self.end_time = resu.end_time;
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
