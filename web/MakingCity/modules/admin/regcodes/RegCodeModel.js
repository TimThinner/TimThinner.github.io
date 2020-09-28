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
		/*this.id = undefined;
		this.email = undefined;
		this.apartmentId = undefined;
		this.code = undefined;
		this.startdate = undefined;
		this.enddate = undefined;*/
		this.regcodes = [];
		this.selected = undefined;
	}
	
	setSelected(sel) {
		this.selected = sel;
	}
	
	getSelected() {
		return this.selected;
	}
	
	fetch(token) {
		const self = this;
		
		console.log(['MODEL '+this.name+' FETCH CALLED! token=',token]);
		
		if (this.fetching) {
			console.log('MODEL '+this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		this.errorMessage = '';
		this.fetching = true;
		
		let status = 500; // (OK: 200, AUTH FAILED: 401, error: 500)
		const myHeaders = new Headers();
		const authorizationToken = 'Bearer '+token;
		myHeaders.append("Authorization", authorizationToken);
		
		const url = this.mongoBackend + '/regcodes';
		fetch(url, {headers: myHeaders})
			.then(function(response) {
				status = response.status;
				return response.json();
			})
			.then(function(myJson) {
				console.log(['myJson=',myJson]);
				self.regcodes = myJson.regcodes;
				console.log(['self.regcodes=',self.regcodes]);
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
		/*
		status = 200; // OK
		setTimeout(() => {
			
			this.fetching = false;
			this.ready = true;
			this.notifyAll({model:this.name, method:'fetched', status:status, message:'OK'});
			
		}, 200);*/
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
				self.notifyAll({model:'RegCodeModel', method:'addOne', status:status, message:myJson.message});
			})
			.catch(function(error){
				self.notifyAll({model:'RegCodeModel', method:'addOne', status:status, message:error});
			});
	}
	
	updateOne(id, data, authToken) {
		const self = this;
		const myHeaders = new Headers();
		const authorizationToken = 'Bearer '+authToken;
		myHeaders.append("Authorization", authorizationToken);
		myHeaders.append("Content-Type", "application/json");
		
		const myPut = {
			method: 'PUT',
			headers: myHeaders,
			body: JSON.stringify(data)
		};
		var myRequest = new Request(this.mongoBackend + '/regcodes/'+id, myPut);
		var status = 500; // RESPONSE (OK: 200, Auth Failed: 401, error: 500)
		
		fetch(myRequest)
			.then(function(response){
				status = response.status;
				return response.json();
			})
			.then(function(myJson){
				// NOTE: When a product is updated, we fetch all products and orders from server.
				// So no need for complex manipulation for in-memory model-lists here!
				self.notifyAll({model:'RegCodeModel', method:'updateOne', status:status, message:myJson.message});
			})
			.catch(function(error){
				self.notifyAll({model:'RegCodeModel', method:'updateOne', status:status, message:error});
			});
	}
}
