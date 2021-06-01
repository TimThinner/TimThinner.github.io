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

Results could be object with keys like this:
{
	'A75': {
		'Norway': {
			'B01': [  {"position":"18","quantity":"945"}, ... ]
			...
			'B20': [  ]
		},
		'Estonia': {
			'B01': [  ],
			...
			'B20': [  ]
		},
		'Finland': {
			
		},
		'SwedenSE1': {
			
		},
		'SwedenSE3': {
			
		},
		'Russia': {
			
		}
	},
	'A65': {
		
	}
}
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
		this.document_type = options.document_type; //'A65'or 'A75'
		this.psr_type = options.psr_type;
		switch (options.area_name) {
			case 'NorwayNO4': 
				this.domain = '10YNO-4--------9';
				break;
			case 'Estonia':
				this.domain = '10Y1001A1001A39I';
				break;
			case 'Finland':
				this.domain = '10YFI-1--------U';
				break;
			case 'SwedenSE1':
				this.domain = '10Y1001A1001A44P';
				break;
			case 'SwedenSE3':
				this.domain = '10Y1001A1001A46L';
				break;
			case 'Russia':
				this.domain = '10Y1001A1001A49F';
				break;
			default:
				this.domain = undefined;
				break;
		}
		this.points = [];
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
		
		/*
		Fetching:
		
		Number of document types: 2 => 
			'A65'		System total load
			'A75'		Actual generation per type
		
		A.10. Areas
		BZ—Bidding Zone
		BZA—Bidding Zone Aggregation
		CA—Control Area
		MBA—Market Balance Area
		
		Number of areas: 5 => 
		case 'NorwayNO4'		idomain = '10YNO-4--------9'		NO4 BZ / MBA
		case 'Estonia'			idomain = '10Y1001A1001A39I'		Estonia, Elering BZ / CA / MBA
		case 'Finland'			idomain = '10YFI-1--------U'		Finland, Fingrid BZ / CA / MBA
		case 'SwedenSE1'		idomain = '10Y1001A1001A44P'		SE1 BZ / MBA
		case 'SwedenSE3'		idomain = '10Y1001A1001A46L'		SE3 BZ / MBA
		case 'Russia'			idomain = '10Y1001A1001A49F'		Russia BZ / CA / MBA
		
		Number of technologies: 20 => (psrType used only when document type = 'A75')
		'B01' 'Biomass'
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
		'B20' 'Other'
		*/
		const data = {
			url: body_url,
			document_type: this.document_type, //'A65'or 'A75'
			psr_type: this.psr_type,
			domain:  this.domain,
			period_start: body_period_start, // '202105231000'
			period_end: body_period_end,     // '202105241000'
			expiration_in_seconds: 180 // 3 minutes
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
				const resu = JSON.parse(myJson);
				console.log(['resu=',resu]);
				if (typeof resu !== 'undefined' && typeof resu.GL_MarketDocument !== 'undefined') {
					if (resu.GL_MarketDocument['TimeSeries'] !== 'undefined' && Array.isArray(resu.GL_MarketDocument['TimeSeries'])) {
						resu.GL_MarketDocument['TimeSeries'].forEach(ts=> {
							
							if (typeof ts.MktPSRType !== 'undefined' && Array.isArray(ts.MktPSRType)) {
								ts.MktPSRType.forEach(t=>{
									if (typeof t.psrType !== 'undefined') {
										console.log(['t.psrType=',t.psrType[0]]);
									}
								});
							}
							
							if (typeof ts.Period !== 'undefined' && Array.isArray(ts.Period)) {
								ts.Period.forEach(p=> {
									
									if (typeof p.resolution !== 'undefined' && Array.isArray(p.resolution)) {
										console.log(['resolution=',p.resolution[0]]);
									}
									
									if (typeof p.Point !== 'undefined' && Array.isArray(p.Point)) {
										p.Point.forEach(po=> {
											let position;
											let quantity;
											if (typeof po.position !== 'undefined' && Array.isArray(po.position)) {
												position = po.position[0];
											}
											if (typeof po.quantity !== 'undefined' && Array.isArray(po.quantity)) {
												quantity = po.quantity[0];
											}
											console.log(['position=',position,' quantity=',quantity]);
										});
									}
								});
							}
						});
						
					}
				}
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
