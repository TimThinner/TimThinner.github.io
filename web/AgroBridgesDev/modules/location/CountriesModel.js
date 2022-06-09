import Model from '../common/Model.js';
/*
"NUTS_ID":"FI","LEVL_CODE":0,"CNTR_CODE":"FI","NAME_LATN":"Suomi/Finland","NUTS_NAME":"Suomi/Finland","MOUNT_TYPE":0,"URBN_TYPE":null,"COAST_TYPE":0,"FID":"FI"},"id":"FI"},{"type":"Point","coordinates":[3747520.6227,2640639.6722999997],"properties":{"N
*/

export default class CountriesModel extends Model {
	constructor(options) {
		super(options);
		this.countries = [];
		this.simulation_backup = {
    "DK": "Danmark",
    "EL": "Ελλάδα ",
    "ES": "España",
    "FI": "Suomi/Finland",
    "FR": "France",
    "IE": "Éire/Ireland",
    "IT": "Italia",
    "LT": "Lietuva",
    "LV": "Latvija",
    "NL": "Nederland",
    "PL": "Polska",
    "TR": "Türkiye"
};
	}
	
	// Extract only NUTS-0 countries from data. 
	// cc is a list of countries included in this application.
	
	/*
	extract(geometries, cc){
		this.countries = [];
		geometries.forEach(r=>{
			if (typeof r.properties !== 'undefined') {
				if (cc.includes(r.properties.CNTR_CODE) && r.properties.LEVL_CODE === 0) {
					this.countries.push({
						id: r.properties.NUTS_ID,
						name: r.properties.NUTS_NAME,
						name_latn: r.properties.NAME_LATN
					});
				}
				// '<option value="">name</option>'+
				// r.properties.NUTS_ID => value
				// r.properties.CNTR_CODE
				// r.properties.NAME_LATN
				// r.properties.NUTS_NAME => name
			}
		});
	}
	*/
	
	/*
	fetch(context) {
		// context is a list of country codes (CNTR_CODE in JSON)
		const self = this;
		let status = 500; // error: 500
		this.errorMessage = '';
		if (this.fetching) {
			console.log(this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		this.fetching = true;
		
		const url = this.src;
		console.log (['fetch url=',url]);
		fetch(url)
			.then(function(response) {
				status = response.status;
				return response.json();
			})
			.then(function(myJson) {
				//const resu = JSON.parse(myJson);
				const resu = myJson;
				//console.log(['resu=',resu]);
				if (typeof resu.objects !== 'undefined' && typeof resu.objects['NUTS_LB_2021_3035'] !== 'undefined') {
					const geometries = resu.objects['NUTS_LB_2021_3035'].geometries;
					if (Array.isArray(geometries) && geometries.length > 0) {
						self.extract(geometries, context);
					}
				}
				self.fetching = false;
				self.ready = true;
				self.notifyAll({model:self.name, method:'fetched', status:status, message:'OK'});
			})
			.catch(error => {
				//console.log(['error=',error]);
				self.fetching = false;
				self.ready = true;
				self.errorMessage = error;
				self.notifyAll({model:self.name, method:'fetched', status:status, message:error});
			});
	}
	*/
	
	fillSimulated() {
		console.log(['FILL SIMULATED COUNTRIES');
		
		const c = this.simulation_backup;
		Object.keys(c).forEach(key => {
			this.countries.push({
				id: key,
				name: c[key]
			});
		});
	}
	
	
	fetch() {
		const self = this;
		let status = 500; // error: 500
		this.errorMessage = '';
		if (this.fetching) {
			console.log(this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		this.fetching = true;
		this.countries = [];
		
		if (this.MOCKUP) {
			
			this.fillSimulated();
			this.fetching = false;
			this.ready = true;
			this.notifyAll({model:this.name, method:'fetched', status:200, message:'OK'});
			
			
		} else {
			const url = this.backend + '/countries';
			console.log (['fetch url=',url]);
			fetch(url)
				.then(function(response) {
					status = response.status;
					return response.json();
				})
				.then(function(myJson) {
					let resu;
					if (typeof myJson === 'string') {
						resu = JSON.parse(myJson);
					} else {
						resu = myJson;
					}
					console.log(['resu=',resu]);
					Object.keys(resu).forEach(key => {
						self.countries.push({
							id: key,
							name: resu[key]
						});
					});
					self.fetching = false;
					self.ready = true;
					self.notifyAll({model:self.name, method:'fetched', status:status, message:'OK'});
				})
				.catch(error => {
					//console.log(['error=',error]);
					let msg = "Error: ";
					if (typeof error.message !== 'undefined') {
						msg += error.message;
					} else {
						msg += 'NOT SPECIFIED in error.message.';
					}
					
					self.fillSimulated();
					// ACT LIKE EVERYTHING IS JUST OK!
					self.fetching = false;
					self.ready = true;
					self.notifyAll({model:self.name, method:'fetched', status:200, message:'OK'});
					
					/*
					self.fetching = false;
					self.ready = true;
					self.errorMessage = msg;
					self.notifyAll({model:self.name, method:'fetched', status:status, message:msg});
					*/
				});
		}
	}
}
