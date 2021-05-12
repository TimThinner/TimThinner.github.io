
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
		/*status = 200;
		setTimeout(()=>{
			console.log('FETCH FINGRID!');
			self.notifyAll({model:self.name, method:'fetched', status:status, message:'OK'});
		},1000);*/
		this.fetching = true;
		const url = this.src;
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
				self.start_time = myJson.start_time;
				self.end_time = myJson.end_time;
				
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
