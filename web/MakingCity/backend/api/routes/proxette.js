const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const https = require('https');
const http = require('http');
//const checkAuth = require('../middleware/check-auth');
const xml2js = require('xml2js');
/*
curl -u user:pass -s -H "Content-Type: application/xml" -d "<obj is=\"obix:HistoryFilter\" xmlns=\"http://obix.org/ns/schema/1.0\"> name=\"limit\" val=\"3\" /><abstime name=\"start\" val=\"2021-05-03T09:51:15.062Z\"/><abstime name=\"end\" null=\"true\"/></obj>" https://ba.vtt.fi/TestServlet/testHistory/query/
​
problem with request: Hostname/IP does not match certificate's altnames: IP: 130.188.4.49 is not in the cert's list:

problem with request: Hostname/IP does not match certificate's altnames
*/
/*
*/
//router.post('/obix', checkAuth, (req,res,next)=>{
router.post('/obix', (req,res,next)=>{
	
	const body = req.body.xml;
	const auth = req.body.auth;
	const type = req.body.type;
	
	//const url = 'https://ba.vtt.fi/TestServlet/testHistory/query/';
	const options = {
		host: '130.188.4.49', //'http://ba.vtt.fi',
		port: 443,
		path: '/TestServlet/testHistory/query/',
		method: 'POST',
		rejectUnauthorized: false, // SEE: https://levelup.gitconnected.com/how-to-resolve-certificate-errors-in-nodejs-app-involving-ssl-calls-781ce48daded
		headers: {
			"Content-Type": type,
			"Authorization": auth
		}
	};
	const req2 = https.request(options, (res2) => {
		//console.log(`STATUS: ${res2.statusCode}`);
		//console.log(`HEADERS: ${JSON.stringify(res2.headers)}`);
		res2.setEncoding('utf8');
		
		let rawData = '';
		res2.on('data', (chunk) => { rawData += chunk; });
		res2.on('end', () => {
			try {
				var parser = new xml2js.Parser(/* options */);
				parser.parseStringPromise(rawData).then(function (result) {
					var json = JSON.stringify(result);
					res.status(200).json(json);
				})
				.catch(function (err) {
					// Failed
					res.status(500).json({error:err});
				});
			} catch(e) {
				console.log(['error message=',e.message]);
				res.status(500).json({error: e});
			}
		});
	});
	req2.on('error', (e) => {
		console.error(`problem with request: ${e.message}`);
	});
	// Write data to request body
	req2.write(body);
	req2.end();
});

router.post('/entsoe', (req,res,next)=>{
	// OK.
	// Use FAKE key now:
	const fakeKey = '9f2496b9-6f5e-4396-a1af-263ffccd597a';
	// 'https://transparency.entsoe.eu/api
	let url = req.body.url + '?securityToken='+fakeKey;
	// req.body.url
	// req.body.document_type
	// req.body.domain
	// req.body.period_start
	// req.body.period_end
	
	// documentTypeGen = 'A75' ; % Actual generation per type 
	// documentTypeLoad = 'A65' ; % System total load
	
	// documentType = 'A75' Actual generation per type	domainzone = 'In_Domain'
	// documentType = 'A65' System total load			domainzone = ‘outBiddingZone_Domain’
	
	url += '&documentType=' + req.body.document_type; // A65 or A75
	url += '&processType=A16';
	
	// '10YFI-1--------U'; // Finland
	let domainzone;
	if (req.body.document_type === 'A65') {
		domainzone = '&outBiddingZone_Domain=' + req.body.domain;
	} else {
		domainzone = '&outBiddingZone_Domain=' + req.body.domain;
	}
	url += domainzone;
	url += '&periodStart=' + req.body.period_start;   // yyyyMMddHHmm
	url += '&periodEnd=' + req.body.period_end;       // yyyyMMddHHmm
	//const auth = req.headers.authorization;
	//const options = {
		//headers: {
			//'Content-Type': 'application/xml',
			//'Authorization': auth
		//}
	//};
	
	console.log(['url=',url]);
	
	//https.get(url, options, (res2) => {
	https.get(url, (res2) => {
		const { statusCode } = res2;
		const contentType = res2.headers['content-type'];
		
		//console.log(['statusCode=',statusCode]);
		//console.log(['contentType=',contentType]);
		
		let error;
		if (statusCode !== 200) {
			error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
		} else if (!/^text\/xml/.test(contentType)) {
			error = new Error('Invalid content-type.\n' + `Expected text/xml but received ${contentType}`);
		}
		if (error) {
			// Consume response data to free up memory
			res2.resume();
			return res.status(500).json({error: error});
		}
		res2.setEncoding('utf8');
		let rawData = '';
		res2.on('data', (chunk) => { rawData += chunk; });
		res2.on('end', () => {
			try {
				var parser = new xml2js.Parser(/* options */);
				parser.parseStringPromise(rawData).then(function (result) {
					//console.log(['result=',result]);
					var json = JSON.stringify(result);
					//console.log(['json=',json]);
					res.status(200).json(json);
				})
				.catch(function (err) {
					// Failed
					res.status(500).json({error:err});
				});
			} catch(e) {
				console.log(['error message=',e.message]);
				res.status(500).json({error: e});
			}
		});
	}).on('error', (e) => {
		console.log(['error message=',e.message]);
		res.status(500).json({error: e});
	});
});

/*

Russia
data are available from https://br.so-ups.ru
No need for api key, web request is enough
date time format = 'yyyy.MM.dd'
url = 'http://br.so-ups.ru/webapi/api/CommonInfo/PowerGeneration?priceZone[]=1&startDate='<Start date time>'&endDate='<End date time> ;
routine in MatLab is available in section 5.4.2
the technology retrieved from br are:

P_AES nuclear power
P_GES hydropower
P_TES CHP units
P_BS stock (mainly pulp and paper factories)
P_REN solar

http://br.so-ups.ru/webapi/api/CommonInfo/PowerGeneration?priceZone[]=1&startDate=2021.05.24&endDate=2021.05.24
RESPONSE:
[
  {
    "$id": "1",
    "m_Item1": 1,
    "m_Item2": [
      {
        "INTERVAL": 0,
        "M_DATE": "2021-05-24T00:00:00+03:00",
        "P_AES": 22519.451171875,
        "P_GES": 9818.150390625,
        "P_TES": 34141.2421875,
        "P_BS": 6375.35205078125,
        "P_REN": 0
      },
      ...
      {
        "INTERVAL": 23,
        "M_DATE": "2021-05-24T00:00:00+03:00",
        "P_AES": 22870,
        "P_GES": 11249.2998046875,
        "P_TES": 36445.94921875,
        "P_BS": 6572.93115234375,
        "P_REN": 0
      }
    ]
  }
]
*/
router.post('/russia', (req,res,next)=>{
	// req.body.url
	// req.body.start_date
	// req.body.end_date
	let url = req.body.url + '&startDate=' + req.body.start_date + '&endDate=' + req.body.end_date;
	console.log(['url=',url]);
	const options = {
		headers: {
			'Content-Type': 'application/json'
		}
	};
	http.get(url, options, (res2) => {
		const { statusCode } = res2;
		const contentType = res2.headers['content-type'];
		//console.log(['statusCode=',statusCode]);
		//console.log(['contentType=',contentType]);
		let error;
		if (statusCode !== 200) {
			error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
		} else if (!/^application\/json/.test(contentType)) {
			error = new Error('Invalid content-type.\n' + `Expected application/json but received ${contentType}`);
		}
		if (error) {
			// Consume response data to free up memory
			res2.resume();
			return res.status(500).json({error: error});
		}
		res2.setEncoding('utf8');
		let rawData = '';
		res2.on('data', (chunk) => { rawData += chunk; });
		res2.on('end', () => {
			try {
 				const parsedData = JSON.parse(rawData);
				//console.log(['parsedData=',parsedData]);
				res.status(200).json(parsedData);
			} catch(e) {
				console.log(['error message=',e.message]);
				res.status(500).json({error: e});
			}
		});
	}).on('error', (e) => {
		console.log(['error message=',e.message]);
		res.status(500).json({error: e});
	});
});
/*
Sweden
data are available from https://www.svk.se/om-kraftsystemet/kontrollrummet/
No need for api key, web request is enough
date time format = 'yyyy-MM-dd'
url = 'https://www.svk.se/ControlRoom/GetProductionHistory/?productionDate=' <Date time>'&countryCode=SE'] ;
routine in MatLab is available in section 5.4.1
As the return json file is for an entire day, one must retrieve the last entry for each field to return the right amount of energy per technology
the technology retrieved from svk are:
{'production', ...
'nuclear', ...
'thermal', ...
'unknown', ...
'wind', ...
'hydro', ...
'consumption'} ;

https://www.svk.se/ControlRoom/GetProductionHistory/?productionDate=2021-05-24&countryCode=SE

one sample per 60 seconds
one day = 60 x 24 = 1440 samples
extract the last one:
"name" = 1 (2,3,4,5,6,7)

Powerindex = {'production', ... 'nuclear', ... 'hydro', ... 'thermal', ... 'wind', ... 'unknown', ... 'consumption'} ;


data [] last item. {x = unix timestamp in ms, y = value) 

[
  {
    "name": 1,
    "sortorder": 1,
    "data": [
      {
        "x": 1590271260000,
        "y": 14343
      },
      {
        "x": 1590357480000,
        "y": 12015
      }
    ]
  }
]
*/
router.post('/sweden', (req,res,next)=>{
	// req.body.url					https://www.svk.se/ControlRoom/GetProductionHistory/
	// req.body.production_date		YYYY-MM-DD
	let url = req.body.url + '?productionDate=' + req.body.production_date + '&countryCode=SE';
	console.log(['url=',url]);
	const options = {
		headers: {
			'Content-Type': 'application/json'
		}
	};
	https.get(url, options, (res2) => {
		const { statusCode } = res2;
		const contentType = res2.headers['content-type'];
		//console.log(['statusCode=',statusCode]);
		//console.log(['contentType=',contentType]);
		let error;
		if (statusCode !== 200) {
			error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
		} else if (!/^application\/json/.test(contentType)) {
			error = new Error('Invalid content-type.\n' + `Expected application/json but received ${contentType}`);
		}
		if (error) {
			// Consume response data to free up memory
			res2.resume();
			return res.status(500).json({error: error});
		}
		res2.setEncoding('utf8');
		let rawData = '';
		res2.on('data', (chunk) => { rawData += chunk; });
		res2.on('end', () => {
			try {
 				const parsedData = JSON.parse(rawData);
				//console.log(['parsedData=',parsedData]);
				res.status(200).json(parsedData);
			} catch(e) {
				console.log(['error message=',e.message]);
				res.status(500).json({error: e});
			}
		});
	}).on('error', (e) => {
		console.log(['error message=',e.message]);
		res.status(500).json({error: e});
	});
});
/*
//5.5.6. data parser
documentType = dtype; // Actual generation per type 
processType = ptype; // Realised 
In_Domain = idomain; 
switch documentType 
case 'A75' domainzone = 'In_Domain'; 
case 'A65' domainzone = 'outBiddingZone_Domain';


documentTypeGen = 'A75';  // Actual generation per type 
documentTypeLoad = 'A65'; // System total load 
processType = 'A16';  // % Realised 


switch country 
case 'Norway' idomain = '10YNO-4--------9';
[Powerout, PoweroutLoad] = getdata(documentTypeGen, documentTypeLoad, processType, idomain, bid);

case 'Estonia' idomain = '10Y1001A1001A39I';
[Powerout, PoweroutLoad] = getdata(documentTypeGen, documentTypeLoad, processType, idomain, bid);

case 'Finland' idomain = '10YFI-1--------U';
[Powerout, PoweroutLoad] = getdata(documentTypeGen, documentTypeLoad, processType, idomain, bid);

case 'Sweden' // SE1 
idomain = '10Y1001A1001A44P';
[Powerout1, PoweroutLoad1] = getdata(documentTypeGen, documentTypeLoad, processType, idomain, bid);

// SE3 
idomain = '10Y1001A1001A46L';
[Powerout2, PoweroutLoad2] = getdata(documentTypeGen, documentTypeLoad, processType, idomain, bid); 
if ~isa(Powerout2, 'struct') && ~isa(Powerout1, 'struct') Powerout = 0; else if ~isa(Powerout1, 'struct')
Powerout = Powerout2 ; elseif ~isa(Powerout2, 'struct') Powerout = Powerout1 ; else Powerout = Powerout1 ; listfield = fieldnames(Powerout2) ; for ifield = 1:length(listfield) if isfield(Powerout, listfield{ifield}) Powerout.(listfield{ifield}) = Powerout.(listfield{ifield}) + Powerout2.(listfield{ifield}) ; else Powerout.(listfield{ifield}) = Powerout2.(listfield{ifield}) ; end end end end PoweroutLoad = PoweroutLoad1 + PoweroutLoad2 ; 

case 'Russia' idomain = '10Y1001A1001A49F'; 
[Powerout, PoweroutLoad] = getdata(documentTypeGen, documentTypeLoad, processType, idomain, bid);
*/

module.exports = router;
