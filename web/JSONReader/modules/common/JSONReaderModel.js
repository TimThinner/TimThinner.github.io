import Model from './Model.js';


/*
"connectors": [
	"ids:title" : ["Luke's Farm"],
	"ids:description": ["Description of connector"],
	"catalogs": [ 
		"ids:offeredResource": [
			"ids:representation": [
				"ids:instance": [
			"ids:contractOffer": [
				"ids:permission":[
					"ids:action": ["USE"],
					
Recursive travering might be 

Object.keys()
if Array.isArray => forEach 
NOTE Array can be just a string.



*/


export default class JSONReaderModel extends Model {
	
	constructor(options) {
		super(options);
		this.json = {};
		this.result = [];
	}
	
	extract(name, e) {
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
		this.result.push({name:name,id:id,title:title});
	}
	
	
	getAllIdsR(e) {
		if (e && Array.isArray(e)) {
			if (e.length === 1 && typeof e[0] === 'string') {
				console.log(['LEAF string=',e]);
			} else {
				e.forEach(ee=>{
					this.getAllIdsR(ee);
				});
			}
		} else {
			// Object (but not Array)
			// get all keys => values
			if (e["@type"]) {
				console.log(['@type=',e["@type"]]);
			}
			Object.keys(e).forEach(key => {
				console.log(['key=',key,' value=',e[key]]);
				if (e[key] && Array.isArray(e[key])) {
					this.getAllIdsR(e[key]);
				}
			});
		}
	}
	
	getAll() {
		this.result = [];
		const root = this.json.connectors;
		this.getAllIdsR(root);
	}
	
	getAllIds() {
		this.result = [];
		
		this.json.connectors.forEach(c=>{
			this.extract('connector',c);
			
			c.catalogs.forEach(cat=>{
				this.extract('catalog',cat);
				
				cat["ids:offeredResource"].forEach(offe=>{
					this.extract('offeredResource', offe);
					
					if (offe["ids:representation"]) {
						offe["ids:representation"].forEach(rep=>{
							this.extract('representation',rep);
							
							if (rep["ids:instance"]) {
								rep["ids:instance"].forEach(ins=>{
									this.extract('instance',ins);
								});
							}
						});
					}
					if (offe["ids:contractOffer"]) {
						offe["ids:contractOffer"].forEach(con=>{
							
							this.extract('contractOffer',con);
							if (con["ids:permission"]) {
								con["ids:permission"].forEach(per=>{
									this.extract('permission',per);
								});
							}
						});
					}
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
