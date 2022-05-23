import Model from './Model.js';

export default class JSONReaderModel extends Model {
	
	constructor(options) {
		super(options);
		this.json = {};
		this.result = [];
	}
	
	extract(e) {
		const idstitle = e["ids:title"];
		const id = e["@id"];
		let title;
		if (typeof idstitle !== 'undefined') {
			if (Array.isArray(idstitle)) {
				title = idstitle[0];
			} else {
				title = idstitle;
			}
		}
		this.result.push({id:id,title:title});
	}
	
	getAllIds() {
		this.result = [];
		
		this.json.connectors.forEach(c=>{
			this.extract(c);
			
			c.catalogs.forEach(cat=>{
				this.extract(cat);
				
				cat["ids:offeredResource"].forEach(offe=>{
					this.extract(offe);
					
					offe["ids:representation"].forEach(rep=>{
						this.extract(rep);
					});
				});
			});
		});
		
		this.notifyAll({model:this.name, method:'getAllIds'});
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

/*
		if (type === 'connector') {
			this.json.connectors.forEach(c=>{
				const idstitle = c["ids:title"];
				
				
				
				console.log(['idstitle=',idstitle]);
				
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
					
				}
			});
		}
*/