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


<====================================================================================
NEW: To get the so-called "hour-price" for electricity you can use following method:

securityToken = <YOUR ENTSOE TOKEN> ;
documentType = 'A44' ;
in_Domain = '10YFI-1--------U' ;
domainzone = 'in_Domain' ;
periodStart = char(datetime(datetime(datestr(now)).Year, datetime(datestr(now)).Month, datetime(datestr(now)).Day, 'Format','yyyyMMddHHmm')) ;
% example '202111230000'
periodEnd = char(datetime(datetime(datestr(now)).Year, datetime(datestr(now)).Month, datetime(datestr(now)).Day + 1,23,0,0, 'Format','yyyyMMddHHmm'))
% example '202111242300'
% API query
url = ['https://transparency.entsoe.eu/api?securityToken=' securityToken ...
       '&documentType=' documentType ...
       '&' domainzone '=' in_Domain ...
       '&out_Domain=' in_Domain ...
       '&periodStart=' periodStart ...
       '&periodEnd=' periodEnd] ;
% Out
All values must be multiplied by 24% (VAT in Finland) and you get the day-ahead pricing like in the Tuntihinta application.
(in Euro/MWh, convert it to euro cents/kWh by dividing by 10 the values)

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
		
		/*
		<Period>
			<timeInterval>
				<start>2015-12-31T23:00Z</start>
				<end>2016-01-01T23:00Z</end>
			</timeInterval>
			<resolution>PT60M</resolution>
			<Point>
				<position>1</position>
				<quantity>6363</quantity>
			</Point>
			<Point>
				<position>2</position>
				<quantity>6288</quantity>
			</Point>
			<Point>
				<position>3</position>
				<quantity>6182</quantity>
			</Point>
			<Point>
				<position>4</position>
				<quantity>6100</quantity>
			</Point>
		*/
		
		// Response is a TimeSeries, where we have Period
		this.timeseries = [];
		this.created = undefined;
		
		
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
	
	parse(resu) {
		if (typeof resu.Acknowledgement_MarketDocument !== 'undefined') {
			if (resu.Acknowledgement_MarketDocument['Reason'] && Array.isArray(resu.Acknowledgement_MarketDocument['Reason'])) {
				resu.Acknowledgement_MarketDocument['Reason'].forEach(reason=> {
					//message += reason.text;
					console.log(['NOTE!!! reason=',reason]);
				});
			}
		} else if (typeof resu.GL_MarketDocument !== 'undefined') {
			
			// NOTE: Many of these XML-to-JSON-elements are wrapped in Arrays, even when there actually is only one item!
			if (resu.GL_MarketDocument['createdDateTime'] !== 'undefined' && Array.isArray(resu.GL_MarketDocument['createdDateTime'])) {
				
				const cDT = resu.GL_MarketDocument['createdDateTime'].forEach(crea=> {
					this.created = crea;
				});
				
			}
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
							
							let myp = {};
							
							if (typeof p.resolution !== 'undefined' && Array.isArray(p.resolution)) {
								console.log(['resolution=',p.resolution[0]]);
								myp['resolution'] = p.resolution[0];
							}
							if (typeof p.timeInterval !== 'undefined' && Array.isArray(p.timeInterval)) {
								p.timeInterval.forEach(ti=> {
									console.log(['timeInterval start=',ti.start[0],' end=',ti.end[0]]);
									myp['timeInterval'] = {'start':ti.start[0],'end':ti.end[0]};
								});
							}
							if (typeof p.Point !== 'undefined' && Array.isArray(p.Point)) {
								myp['Point'] = [];
								
								p.Point.forEach(po=> {
									let position;
									let quantity;
									if (typeof po.position !== 'undefined' && Array.isArray(po.position)) {
										position = po.position[0];
										
									}
									if (typeof po.quantity !== 'undefined' && Array.isArray(po.quantity)) {
										quantity = po.quantity[0];
									}
									
									myp['Point'].push({'position':position,'quantity':quantity});
									console.log(['position=',position,' quantity=',quantity]);
								});
							}
							
							this.timeseries.push(myp);
						});
					}
				});
			}
		}
	}
	
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
		
		const url = this.mongoBackend + '/proxes/entsoe';
		const body_url = this.src; // URL will be appended in backend.
		
		// NOTE: Times are given always in UTC time!!!
		const body_period_start = moment.utc().subtract(2, 'hours').format('YYYYMMDDHH') + '00'; // yyyyMMddHHmm
		const body_period_end = moment.utc().format('YYYYMMDDHH') + '00';   // yyyyMMddHHmm
		//console.log(['body_period_start=',body_period_start,' body_period_end=',body_period_end]);
		
		//EntsoeA65NorwayNO4Model: SyntaxError: JSON.parse: unexpected character at line 1 column 2 of the JSON data
		
		/*
		<Acknowledgement_MarketDocument>
			<mRID>14812aa9-2a1b-4</mRID>
			<createdDateTime>2021-06-21T09:17:42Z</createdDateTime>
			<sender_MarketParticipant.mRID codingScheme="A01">10X1001A1001A450</sender_MarketParticipant.mRID>
			<sender_MarketParticipant.marketRole.type>A32</sender_MarketParticipant.marketRole.type>
			<receiver_MarketParticipant.mRID codingScheme="A01">10X1001A1001A450</receiver_MarketParticipant.mRID>
			<receiver_MarketParticipant.marketRole.type>A39</receiver_MarketParticipant.marketRole.type>
			<received_MarketDocument.createdDateTime>2021-06-21T09:17:42Z</received_MarketDocument.createdDateTime>
			<Reason>
				<code>999</code>
				<text>
					No matching data found for Data item Actual Total Load [6.1.A] (10YNO-4--------9) and interval 2021-06-21T07:00:00.000Z/2021-06-21T09:00:00.000Z.
				</text>
			</Reason>
		</Acknowledgement_MarketDocument>
		*/
		
		
		/*
		let body_period_start = moment.utc().subtract(2, 'hours').format('YYYYMMDDHH') + '00'; // yyyyMMddHHmm
		let body_period_end = moment.utc().format('YYYYMMDDHH') + '00';   // yyyyMMddHHmm
		
		if (this.name === 'EntsoeA65NorwayNO4Model') {
			body_period_start = moment.utc().add(2, 'hours').format('YYYYMMDDHH') + '00'; // yyyyMMddHHmm
			body_period_end = moment.utc().add(4, 'hours').format('YYYYMMDDHH') + '00';   // yyyyMMddHHmm
		}*/
		
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
				console.log(['myJson=',myJson]);
				if (typeof myJson.error !== 'undefined') {
					// We can ignore this error... usually it means that asked data is not available right now.
					// But it can be available next time we call this function.
					console.log(['myJson.error=',myJson.error]);
					self.status = 200; // Don't show the RED "OK" message (status was 500, so force it to 200).
				} else {
					const resu = JSON.parse(myJson);
					console.log(['resu=',resu]);
					if (typeof resu !== 'undefined') {
						self.parse(resu);
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
