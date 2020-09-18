import Model from '../../common/Model.js';
/*
	
	
	Model has following properties  + it extends EventObserver
	constructor(options) {
		super();
		this.name = options.name;
		this.src = options.src;
		this.ready = false;
		this.errorMessage = '';
		this.fetching = false;
	}
	fetch() {
		console.log('DUMMY FETCH!');
		this.ready = true;
	}
*/
export default class RegCodeModel extends Model {
	
	constructor(options) {
		super(options);
		this.id = undefined;
		this.email = undefined;
		this.apartmentId = undefined;
		this.code = undefined;
		this.startdate = undefined;
		this.enddate = undefined;
	}
	
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
		
		console.log (['RegCodeModel fetch url=',url]);
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
	
	/*
	data:
		email: req.body.email,
		apartmentId: req.body.apartmentId,
		code: req.body.code
	*/
	addOne(data, authToken) {
		var self = this;
		var myHeaders = new Headers();
		var authorizationToken = 'Bearer '+authToken;
		myHeaders.append("Authorization", authorizationToken);
		myHeaders.append("Content-Type", "application/json");
		
		var myPost = {
			method: 'POST',
			headers: myHeaders,
			body: JSON.stringify(data)
		};
		var myRequest = new Request(this.mongoBackend + '/regcodes', myPost);
		var status = 500; // RESPONSE (OK: 201, Auth Failed: 401, error: 500)
		
		fetch(myRequest)
			.then(function(response){
				status = response.status;
				return response.json();
			})
			.then(function(myJson){
				if (status === 201) {
					self.id = myJson._id;
					self.email       = myJson.email;
					self.apartmentId = myJson.apartmentId;
					self.code        = myJson.code;
					self.startdate   = myJson.startdate;
					self.enddate     = myJson.enddate;
				} 
				self.notifyAll({model:'RegCodeModel', method:'addOne', status:status, message:myJson.message});
			})
			.catch(function(error){
				self.notifyAll({model:'RegCodeModel', method:'addOne', status:status, message:error});
			});
	}
}
