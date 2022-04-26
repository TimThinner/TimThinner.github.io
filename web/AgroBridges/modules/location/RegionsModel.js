import Model from '../common/Model.js';
/*

See also:
https://ec.europa.eu/eurostat/web/gisco/geodata/reference-data/administrative-units-statistical-units/nuts


Try to read all NUTS-3 codes for any COUNTRY (CNTR_CODE) and extract NUTS_NAME and NAME_LATN
IN FILE 

NUTS_LB_2021_3035.json

{
	"type":"Topology",
	"arcs":[],
	"objects":{"NUTS_LB_2021_3035":{"type":"GeometryCollection","geometries":[

{
"type":"Point",
"coordinates":[4309292.7645,3441513.4943],
"properties":{"NUTS_ID":"DEF0","LEVL_CODE":2,"CNTR_CODE":"DE","NAME_LATN":"Schleswig-Holstein","NUTS_NAME":"Schleswig-Holstein","MOUNT_TYPE":0,"URBN_TYPE":null,"COAST_TYPE":0,"FID":"DEF0"},
"id":"DEF0"
},
{
	"type":"Point",
	"coordinates":[4392871.8445,3088607.0577],
	"properties":{"NUTS_ID":"DEG0","LEVL_CODE":2,"CNTR_CODE":"DE","NAME_LATN":"Thüringen","NUTS_NAME":"Thüringen","MOUNT_TYPE":0,"URBN_TYPE":null,"COAST_TYPE":0,"FID":"DEG0"},
	"id":"DEG0"
},
...
,
{
"type":"Point",
"coordinates":[4245437.3572,4380700.353599999],
"properties":{"NUTS_ID":"NO0A3","LEVL_CODE":3,"CNTR_CODE":"NO","NAME_LATN":"Møre og Romsdal","NUTS_NAME":"Møre og Romsdal","MOUNT_TYPE":3,"URBN_TYPE":3,"COAST_TYPE":1,"FID":"NO0A3"},
"id":"NO0A3"
}]}}}

*/
export default class RegionsModel extends Model {
	constructor(options) {
		super(options);
		//this.countries = ['BE'];
		//this.selected = 'BE';
		
		this.regions = [];
	}
	
	// Extract only NUTS-3 regions from data.
	extract(geometries, cc){
		this.regions = [];
		geometries.forEach(r=>{
			if (typeof r.properties !== 'undefined') {
				if (r.properties.CNTR_CODE === cc && r.properties.LEVL_CODE === 3) {
					this.regions.push({
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
		//console.log(['EXTRACTED country_regions for ',cc,'=',country_regions]);
	}
	
	fetch(context) {
		// context is country code (CNTR_CODE in JSON)
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
