
import Model from '../common/Model.js';

/*

date time format = ‘yyyyMMddHHmm'
documentType = 'A75' → Actual generation per type → domainzone = 'In_Domain'
documentType = 'A65' → System total load → domainzone = ‘outBiddingZone_Domain’
processType = 'A16' → Realised
url = ['https://transparency.entsoe.eu/api?securityToken=' securityToken ...
'&documentType='<documentType> ...
'&processType='<processType> ...
'&' <domainzone> '='<In_Domain> ...
'&periodStart='< date time format>...
'&periodEnd='< date time format>] ;
In the output of the query, the following technology can be retrieved:
{'B01' 'Biomass'
'B02' 'Fossil Brown coal/Lignite'
'B03' 'Fossil Coal-derived gas'
'B04' 'Fossil Gas'
'B05' 'Fossil Hard coal'
'B06' 'Fossil Oil'
'B07' 'Fossil Oil shale'
'B08' 'Fossil Peat'
'B09' 'Geothermal'
'B10' 'Hydro Pumped Storage'
'B11' 'Hydro Run-of-river and poundage'
'B12' 'Hydro Water Reservoir'
'B13' 'Marine'
'B14' 'Nuclear'
'B15' 'Other renewable'
'B16' 'Solar'
'B17' 'Waste'
'B18' 'Wind Offshore'
'B19' 'Wind Onshore'
'B20' 'Other'} ;

*/

export default class EntsoeModel extends Model {
	
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
		//this.value = undefined;
		//this.values = [];
		//this.start_time = undefined;
		//this.end_time = undefined;
	}
	/*
	fetch() {
		const self = this;
		let status = 500; // error: 500
		this.errorMessage = '';
		
		if (this.fetching) {
			console.log(this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		
		//status = 200;
		//setTimeout(()=>{
		//	console.log('FETCH FINGRID!');
		//	self.notifyAll({model:self.name, method:'fetched', status:status, message:'OK'});
		//},1000);
		
		
		this.fetching = true;
		let url = this.src;
		const idomain = '10YFI-1--------U'; // Finland
		
		//url = 'https://transparency.entsoe.eu/api?securityToken='
		// https://transparency.entsoe.eu/api?securityToken=MYTOKEN&documentType=A65&processType=A16&outBiddingZone_Domain=10YCZ-CEPS-----N&periodStart=201512312300&periodEnd=201612312300
		var myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/xml");
		
		const API_KEY = "9f2496b9-6f5e-4396-a1af-263ffccd597a";
		url += API_KEY;
		url += '&documentType=A65';
		url += '&processType=A16';
		url += '&outBiddingZone_Domain='+idomain;
		url += '&periodStart=202105241000';  // yyyyMMddHHmm
		url += '&periodEnd=202105241200';    // yyyyMMddHHmm
		// 
		console.log (['fetch url=',url]);
		fetch(url, {headers: myHeaders})
			.then(function(response) {
				self.status = response.status;
				return response.text();
			})
			.then(function(xmlString) {
				return $.parseXML(xmlString);
			})
			.then(function(data) {
				console.log(['XML data=',data]);
				
				console.log([self.name+' fetch status=',self.status]);
				self.fetching = false;
				self.ready = true;
				self.notifyAll({model:self.name, method:'fetched', status:self.status, message:message});
			})
			.catch(error => {
				console.log([self.name+' fetch error=',error]);
				self.fetching = false;
				self.ready = true;
				const message = self.name+': '+error;
				self.errorMessage = message;
				self.notifyAll({model:self.name, method:'fetched', status:self.status, message:message});
			});
	}*/
	
	fetch(token) {
		const self = this;
		if (this.fetching) {
			console.log('MODEL '+this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		this.status = 500; // error: 500
		this.errorMessage = '';
		this.fetching = true;
		
		var myHeaders = new Headers();
		var authorizationToken = 'Bearer '+token;
		myHeaders.append("Authorization", authorizationToken);
		myHeaders.append("Content-Type", "application/json");
		
		const url = this.mongoBackend + '/proxette/entsoe';
		const body_url = this.src; // URL will be appended in backend.
		
		
		const body_period_start = moment().subtract(2, 'days').format('YYYYMMDD') + '2100'; // yyyyMMddHHmm
		const body_period_end = moment().subtract(1, 'days').format('YYYYMMDD') + '2100';   // yyyyMMddHHmm
		console.log(['body_period_start=',body_period_start,' body_period_end=',body_period_end]);
		
		
		// &periodStart=201512312300&periodEnd=201612312300
		
		const data = {
			url: body_url,
			period_start: body_period_start, // '202105231000'
			period_end: body_period_end      // '202105241000'
		};
		const myPost = {
			method: 'POST',
			headers: myHeaders,
			body: JSON.stringify(data)
		};
		const myRequest = new Request(url, myPost);
		
		fetch(myRequest)
			.then(function(response) {
				self.status = response.status;
				return response.json();
			})
			.then(function(myJson) {
				let message = 'OK';
				console.log(['myJson=',myJson]);
				
				console.log([self.name+' fetch status=',self.status]);
				self.fetching = false;
				self.ready = true;
				self.notifyAll({model:self.name, method:'fetched', status:self.status, message:message});
			})
			.catch(error => {
				console.log([self.name+' fetch error=',error]);
				self.fetching = false;
				self.ready = true;
				const message = self.name+': '+error;
				self.errorMessage = message;
				self.notifyAll({model:self.name, method:'fetched', status:self.status, message:message});
			});
	}
}
