import Model from './Model.js';

export default class JSONReaderModel extends Model {
	
	constructor(options) {
		super(options);
		this.json = {};
		this.result = [];
	}
	
	get(options) {
		const type = options.type;
		const title = options.title;
		
		this.result = [];
		
		if (type === 'connectors') {
			this.json.connectors.forEach(c=>{
				const idstitle = c["ids:title"];
				if (typeof idstitle !== 'undefined') {
					if (Array.isArray(idstitle)) {
						if (idstitle[0] === title) {
							this.result.push(c);
						}
					} else {
						if (idstitle === title) {
							this.result.push(c);
						}
					}
					this.result.push(c);
				}
			});
		}
		this.notifyAll({model:this.name, method:'get', type:type});
	}
	
	fetch() {
		const self = this;
		
		if (this.fetching) {
			console.log(this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		this.errorMessage = '';
		this.fetching = true;
		
		let status = 500; // (OK: 200, AUTH FAILED: 401, error: 500)
		//const myHeaders = new Headers();
		//const authorizationToken = 'Bearer '+token;
		//myHeaders.append("Authorization", authorizationToken);
		
		//const url = this.mongoBackend + '/feedbacks';
		const url = this.src; //mongoBackend + '/feedbacks';
		fetch(url)
			.then(function(response) {
				status = response.status;
				return response.json();
			})
			.then(function(myJson) {
				console.log(['myJson=',myJson]);
				
				self.json = myJson;
				
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