import Model from '../common/Model.js';
/*
"NUTS_ID":"FI","LEVL_CODE":0,"CNTR_CODE":"FI","NAME_LATN":"Suomi/Finland","NUTS_NAME":"Suomi/Finland","MOUNT_TYPE":0,"URBN_TYPE":null,"COAST_TYPE":0,"FID":"FI"},"id":"FI"},{"type":"Point","coordinates":[3747520.6227,2640639.6722999997],"properties":{"N
*/

export default class CountriesModel extends Model {
	constructor(options) {
		super(options);
		this.countries = [];
	}
	
	// Extract only NUTS-0 countries from data. 
	// cc is a list of countries included in this application.
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
}
